/**
 * ZESTORA Contact Messages Service
 * Integrates Supabase PostgreSQL contact_messages table with local caching.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const CONTACT_KEY = 'zestora_contact_messages';

const DEFAULT_MESSAGES = [
  {
    id: 'msg_demo_1',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    subject: 'Corporate Diwali Gifting Boxes',
    message: 'Hello! We are looking to order 150 assorted dehydrated fruit snack boxes for our annual team gift hampers. Could you share pricing details for custom branding packaging?',
    date: '10 Sep 2024, 04:15 PM',
    createdAt: '2024-09-10T10:45:00.000Z',
    status: 'new',
    read: false
  },
  {
    id: 'msg_demo_2',
    name: 'Rohit Verma',
    email: 'rohit.v@techpulse.in',
    subject: 'Bulk Office Pantry Supply',
    message: 'Do you offer recurring weekly replenishment orders for corporate pantries in Koramangala Bengaluru? We love the dried pineapple and alphonso mango!',
    date: '08 Sep 2024, 11:30 AM',
    createdAt: '2024-09-08T06:00:00.000Z',
    status: 'resolved',
    read: true
  }
];

export const contactService = {
  getMessages() {
    const list = getStorageItem(CONTACT_KEY, null);
    if (!list || !Array.isArray(list)) {
      setStorageItem(CONTACT_KEY, DEFAULT_MESSAGES);
      return DEFAULT_MESSAGES;
    }
    return list;
  },

  async fetchFromDatabase() {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getMessages();
    }

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted = data.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || '',
          subject: m.subject || 'General Inquiry',
          message: m.message,
          status: m.status || 'new',
          read: Boolean(m.read),
          date: new Date(m.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          createdAt: m.created_at
        }));
        setStorageItem(CONTACT_KEY, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase fetch contact messages error:', err);
    }
    return this.getMessages();
  },

  submitMessage({ name, email, phone, subject, message }) {
    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' };
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject || 'General Inquiry',
      message: message.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      createdAt: new Date().toISOString(),
      status: 'new',
      read: false
    };

    const messages = this.getMessages();
    const updated = [newMessage, ...messages];
    setStorageItem(CONTACT_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('contact_messages').insert({
            name: newMessage.name,
            email: newMessage.email,
            phone: newMessage.phone,
            subject: newMessage.subject,
            message: newMessage.message,
            status: 'new',
            read: false
          });
        } catch (err) {
          console.warn('Supabase submitMessage error:', err);
        }
      })();
    }

    return { success: true, message: newMessage };
  },

  updateStatus(id, nextStatus) {
    const messages = this.getMessages();
    const updated = messages.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: nextStatus,
          read: nextStatus === 'resolved' ? true : m.read
        };
      }
      return m;
    });
    setStorageItem(CONTACT_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase
            .from('contact_messages')
            .update({
              status: nextStatus,
              read: nextStatus === 'resolved' ? true : undefined
            })
            .eq('id', id);
        } catch (err) {
          console.warn('Supabase updateStatus error:', err);
        }
      })();
    }

    return updated;
  },

  markAsRead(id) {
    const messages = this.getMessages();
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setStorageItem(CONTACT_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('contact_messages').update({ read: true }).eq('id', id);
        } catch (err) {
          console.warn('Supabase markAsRead error:', err);
        }
      })();
    }

    return updated;
  },

  deleteMessage(id) {
    const messages = this.getMessages();
    const updated = messages.filter(m => m.id !== id);
    setStorageItem(CONTACT_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('contact_messages').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase deleteMessage error:', err);
        }
      })();
    }

    return updated;
  }
};
