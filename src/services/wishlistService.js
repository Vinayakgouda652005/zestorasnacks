/**
 * ZESTORA Wishlist Service
 */
import { getStorageItem, setStorageItem } from './storage';

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

  toggleWishlist(productId) {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    let updated;
    if (exists) {
      updated = list.filter(id => id !== productId);
    } else {
      updated = [...list, productId];
    }
    setStorageItem(WISHLIST_KEY, updated);
    return { inWishlist: !exists, items: updated };
  },

  removeFromWishlist(productId) {
    const list = this.getWishlist();
    const updated = list.filter(id => id !== productId);
    setStorageItem(WISHLIST_KEY, updated);
    return updated;
  },

  clearWishlist() {
    setStorageItem(WISHLIST_KEY, []);
    return [];
  }
};
