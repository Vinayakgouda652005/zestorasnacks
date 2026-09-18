/**
 * ZESTORA Wishlist Service
 * Integrates Supabase PostgreSQL wishlists table with local caching.
 */
import { getStorageItem, setStorageItem } from './storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const WISHLIST_KEY = 'zestora_wishlist';

export const wishlistService = {
  getWishlist() {
    const list = getStorageItem(WISHLIST_KEY, []);
    return Array.isArray(list) ? list : [];
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(productId);
  },

  async fetchUserWishlist(userId) {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase || !userId) {
      return this.getWishlist();
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);

      if (!error && data) {
        const ids = data.map(item => item.product_id);
        setStorageItem(WISHLIST_KEY, ids);
        return ids;
      }
    } catch (err) {
      console.warn('Supabase fetchUserWishlist error:', err);
    }
    return this.getWishlist();
  },

  toggleWishlist(productId, userId = null) {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    let updated;
    if (exists) {
      updated = list.filter(id => id !== productId);
    } else {
      updated = [...list, productId];
    }
    setStorageItem(WISHLIST_KEY, updated);

    // Sync with Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase && userId) {
      (async () => {
        try {
          if (exists) {
            await supabase
              .from('wishlists')
              .delete()
              .eq('user_id', userId)
              .eq('product_id', productId);
          } else {
            await supabase
              .from('wishlists')
              .insert({ user_id: userId, product_id: productId });
          }
        } catch (err) {
          console.warn('Supabase wishlist toggle sync error:', err);
        }
      })();
    }

    return { inWishlist: !exists, items: updated };
  },

  removeFromWishlist(productId, userId = null) {
    const list = this.getWishlist();
    const updated = list.filter(id => id !== productId);
    setStorageItem(WISHLIST_KEY, updated);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase && userId) {
      (async () => {
        try {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
        } catch (err) {
          console.warn('Supabase removeFromWishlist error:', err);
        }
      })();
    }

    return updated;
  },

  clearWishlist() {
    setStorageItem(WISHLIST_KEY, []);
    return [];
  }
};
