/**
 * ZESTORA Notifications Service
 * Integrates Supabase PostgreSQL notifications table with local caching.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const NOTIFICATIONS_KEY = 'zestora_notifications';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'usr_priya_101',
    title: 'Order Dispatched!',
    message: 'Order #ZST-10001 has been dispatched via Delhivery Express. Expected by 15 Sep.',
    orderId: 'ZST-10001',
    type: 'order_status',
    read: false,
    date: '13 Sep 2024, 02:00 PM'
  },
  {
    id: 'notif_2',
    userId: 'usr_priya_101',
    title: 'UPI Payment Verified',
    message: 'Your payment for Order #ZST-10001 (₹597) was verified successfully.',
    orderId: 'ZST-10001',
    type: 'payment',
    read: true,
    date: '12 Sep 2024, 03:00 PM'
  }
];

export const notificationService = {
  getAll() {
    const list = getStorageItem(NOTIFICATIONS_KEY, null);
    if (!list || !Array.isArray(list)) {
      setStorageItem(NOTIFICATIONS_KEY, DEFAULT_NOTIFICATIONS);
      return DEFAULT_NOTIFICATIONS;
    }
    return list;
  },

  getUserNotifications(userId) {
    if (!userId) return [];
    const all = this.getAll();
    return all.filter(n => n.userId === userId);
  },

  async fetchUserNotifications(userId) {
    if (!userId) return [];
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getUserNotifications(userId);
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted = data.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          orderId: n.order_id,
          type: n.type,
          read: Boolean(n.read),
          date: new Date(n.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

        const all = this.getAll();
        const others = all.filter(n => n.userId !== userId);
        const nextAll = [...formatted, ...others];
        setStorageItem(NOTIFICATIONS_KEY, nextAll);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase fetchUserNotifications error:', err);
    }
    return this.getUserNotifications(userId);
  },

  addNotification({ userId, title, message, orderId, type = 'general' }) {
    if (!userId) return null;
    const all = this.getAll();
    const newNotif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      orderId: orderId || null,
      type,
      read: false,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const updated = [newNotif, ...all];
    setStorageItem(NOTIFICATIONS_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase && userId.length > 20) {
      (async () => {
        try {
          await supabase.from('notifications').insert({
            user_id: userId,
            title,
            message,
            order_id: orderId || null,
            type,
            read: false
          });
        } catch (err) {
          console.warn('Supabase addNotification error:', err);
        }
      })();
    }

    return newNotif;
  },

  markAsRead(id) {
    const all = this.getAll();
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    setStorageItem(NOTIFICATIONS_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('notifications').update({ read: true }).eq('id', id);
        } catch (err) {
          console.warn('Supabase markAsRead error:', err);
        }
      })();
    }

    return updated;
  },

  markAllAsRead(userId) {
    const all = this.getAll();
    const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
    setStorageItem(NOTIFICATIONS_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase && userId) {
      (async () => {
        try {
          await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
        } catch (err) {
          console.warn('Supabase markAllAsRead error:', err);
        }
      })();
    }

    return updated;
  }
};
