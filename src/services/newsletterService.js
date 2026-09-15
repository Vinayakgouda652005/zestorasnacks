/**
 * ZESTORA Newsletter Subscription Service
 */
import { getStorageItem, setStorageItem } from './storage';

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
  /**
   * Get all subscribers formatted as objects
   */
  getAll() {
    const list = getStorageItem(NEWSLETTER_KEY, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      setStorageItem(NEWSLETTER_KEY, DEFAULT_SUBSCRIBERS);
      return DEFAULT_SUBSCRIBERS;
    }

    // Normalize any legacy string entries into object structure
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

  /**
   * Compatibility alias for getSubscribers
   */
  getSubscribers() {
    return this.getAll();
  },

  /**
   * Subscribe an email address with optional source tracking
   */
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
    return { success: true, message: 'Thank you for subscribing to Zestora community!' };
  },

  /**
   * Unsubscribe by email
   */
  unsubscribe(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const subscribers = this.getAll();
    const updated = subscribers.filter(sub => {
      const subEmail = typeof sub === 'string' ? sub.toLowerCase() : sub.email?.toLowerCase();
      return subEmail !== cleanEmail;
    });
    setStorageItem(NEWSLETTER_KEY, updated);
    return updated;
  },

  /**
   * Export all subscribers as a CSV string
   */
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
