/**
 * ZESTORA Newsletter Subscription Service
 * Integrates Supabase PostgreSQL newsletter_subscribers table with local caching.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const NEWSLETTER_KEY = 'zestora_newsletter';

const DEFAULT_SUBSCRIBERS = [
  {
    email: 'priya.sharma@example.com',
    date: '04 Sep 2024',
    source: 'Storefront Footer',
    createdAt: '2024-09-04T08:30:00.000Z'
  },
  {
    email: 'arjun.mehta@outlook.com',
    date: '08 Sep 2024',
    source: 'Storefront Footer',
    createdAt: '2024-09-08T14:15:00.000Z'
  },
  {
    email: 'sneha.patel@gmail.com',
    date: '12 Sep 2024',
    source: 'Checkout VIP Opt-in',
    createdAt: '2024-09-12T19:40:00.000Z'
  }
];

export const newsletterService = {
  getAll() {
    const list = getStorageItem(NEWSLETTER_KEY, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      setStorageItem(NEWSLETTER_KEY, DEFAULT_SUBSCRIBERS);
      return DEFAULT_SUBSCRIBERS;
    }

    return list.map(item => {
      if (typeof item === 'string') {
        return {
          email: item,
          date: 'Recent',
          source: 'Storefront Footer',
          createdAt: new Date().toISOString()
        };
      }
      return item;
    });
  },

  getSubscribers() {
    return this.getAll();
  },

  async fetchFromDatabase() {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getAll();
    }

    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted = data.map(s => ({
          email: s.email,
          date: new Date(s.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          source: s.source || 'Storefront Footer',
          createdAt: s.created_at
        }));
        setStorageItem(NEWSLETTER_KEY, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase fetch newsletter subscribers error:', err);
    }
    return this.getAll();
  },

  subscribe(email, source = 'Storefront Footer') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const subscribers = this.getAll();
    if (subscribers.some(sub => (typeof sub === 'string' ? sub.toLowerCase() : sub.email?.toLowerCase()) === cleanEmail)) {
      return { success: false, error: 'You are already subscribed to the Zestora newsletter.' };
    }

    const newSubscriber = {
      email: cleanEmail,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      source: source || 'Storefront Footer',
      createdAt: new Date().toISOString()
    };

    const updated = [newSubscriber, ...subscribers];
    setStorageItem(NEWSLETTER_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('newsletter_subscribers').upsert({
            email: cleanEmail,
            source: source || 'Storefront Footer',
            active: true
          });
        } catch (err) {
          console.warn('Supabase newsletter subscribe error:', err);
        }
      })();
    }

    return { success: true, message: 'Thank you for subscribing to Zestora community!' };
  },

  unsubscribe(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const subscribers = this.getAll();
    const updated = subscribers.filter(sub => {
      const subEmail = typeof sub === 'string' ? sub.toLowerCase() : sub.email?.toLowerCase();
      return subEmail !== cleanEmail;
    });
    setStorageItem(NEWSLETTER_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase
            .from('newsletter_subscribers')
            .update({ active: false })
            .eq('email', cleanEmail);
        } catch (err) {
          console.warn('Supabase newsletter unsubscribe error:', err);
        }
      })();
    }

    return updated;
  },

  exportCSV() {
    const subscribers = this.getAll();
    const headers = ['Email', 'Subscription Date', 'Source'];
    const rows = subscribers.map(sub => [
      `"${sub.email}"`,
      `"${sub.date || ''}"`,
      `"${sub.source || 'Storefront Footer'}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
