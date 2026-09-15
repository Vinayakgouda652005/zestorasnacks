/**
 * ZESTORA Review Management Service
 */
import { INITIAL_REVIEWS } from '../data/products.js';
import { getStorageItem, setStorageItem } from './storage';
import { orderService } from './orderService';

const REVIEWS_KEY = 'zestora_reviews';

export const reviewService = {
  getAllReviewsMap() {
    const stored = getStorageItem(REVIEWS_KEY, null);
    if (!stored || typeof stored !== 'object') {
      // Add default status: 'approved' to initial reviews
      const normalized = {};
      Object.keys(INITIAL_REVIEWS).forEach(prodId => {
        normalized[prodId] = INITIAL_REVIEWS[prodId].map(r => ({
          ...r,
          status: 'approved'
        }));
      });
      setStorageItem(REVIEWS_KEY, normalized);
      return normalized;
    }
    return stored;
  },

  // Returns approved reviews for customer product page
  getApprovedProductReviews(productId) {
    const map = this.getAllReviewsMap();
    const list = map[productId] || [];
    return list.filter(r => r.status === 'approved');
  },

  // Returns all reviews for admin panel moderation
  getAllReviewsList() {
    const map = this.getAllReviewsMap();
    const list = [];
    Object.keys(map).forEach(productId => {
      (map[productId] || []).forEach(rev => {
        list.push({ ...rev, productId });
      });
    });
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },

  // Check if a user has actually purchased this product in their order history
  hasUserPurchasedProduct(userId, userEmail, productId) {
    const orders = orderService.getUserOrders(userId, userEmail);
    return orders.some(o => 
      o.items && o.items.some(item => item.product?.id === productId || item.product?.slug === productId)
    );
  },

  // Check if a user has received the product (order is in DELIVERED status)
  hasUserReceivedProduct(userId, userEmail, productId) {
    const orders = orderService.getUserOrders(userId, userEmail);
    return orders.some(o => 
      o.status?.toLowerCase() === 'delivered' &&
      o.items && o.items.some(item => item.product?.id === productId || item.product?.slug === productId)
    );
  },

  // Check if a user can review this product (must have a delivered order containing this product)
  isEligibleToReview(userId, userEmail, productId, orderId = null) {
    if (!userId && !userEmail) return false;
    
    if (orderId) {
      const order = orderService.getById(orderId);
      if (!order) return false;
      const isUserOrder = (userId && order.userId === userId) || (userEmail && order.customer?.email?.toLowerCase() === userEmail?.toLowerCase());
      if (!isUserOrder) return false;
      if (order.status?.toLowerCase() !== 'delivered') return false;
      return Boolean(order.items?.some(item => item.product?.id === productId || item.product?.slug === productId));
    }
    
    return this.hasUserReceivedProduct(userId, userEmail, productId);
  },

  // Check if a user already submitted a review for a specific product and optional orderId
  hasUserReviewedOrderProduct(userId, userEmail, productId, orderId) {
    const map = this.getAllReviewsMap();
    const list = map[productId] || [];
    return list.some(r => {
      const matchUser = (r.userId && userId && r.userId === userId) || (r.userEmail && userEmail && r.userEmail === userEmail);
      if (!matchUser) return false;
      if (orderId && r.orderId) return r.orderId === orderId;
      return true;
    });
  },

  addReview({ productId, customerName, userId, userEmail, rating, reviewText, image = null, orderId = null }) {
    if (!customerName || !reviewText || !rating) {
      return { success: false, error: 'Name, rating, and review text are required.' };
    }

    // Only customers who have received the product in a delivered order can review
    const isDelivered = this.isEligibleToReview(userId, userEmail, productId, orderId);
    if (!isDelivered) {
      return { success: false, error: 'You can only review products that have been delivered to you.' };
    }

    if (this.hasUserReviewedOrderProduct(userId, userEmail, productId, orderId)) {
      return { success: false, error: 'You have already reviewed this product.' };
    }

    const newReview = {
      id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      productId,
      orderId: orderId || null,
      userId: userId || null,
      userEmail: userEmail || null,
      customerName: customerName.trim(),
      rating: Number(rating),
      reviewDate: new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
      createdAt: Date.now(),
      reviewText: reviewText.trim(),
      verifiedBuyer: true,
      image: image || null,
      status: 'approved' // Automatically visible while remaining moderatable in Admin
    };

    const map = this.getAllReviewsMap();
    const currentProdList = map[productId] || [];
    const updated = {
      ...map,
      [productId]: [newReview, ...currentProdList]
    };

    setStorageItem(REVIEWS_KEY, updated);
    return { success: true, review: newReview };
  },

  updateReviewStatus(productId, reviewId, nextStatus) {
    const map = this.getAllReviewsMap();
    const list = map[productId] || [];
    const updatedList = list.map(r => r.id === reviewId ? { ...r, status: nextStatus } : r);
    const updatedMap = {
      ...map,
      [productId]: updatedList
    };
    setStorageItem(REVIEWS_KEY, updatedMap);
    return { success: true };
  },

  deleteReview(productId, reviewId) {
    const map = this.getAllReviewsMap();
    const list = map[productId] || [];
    const updatedList = list.filter(r => r.id !== reviewId);
    const updatedMap = {
      ...map,
      [productId]: updatedList
    };
    setStorageItem(REVIEWS_KEY, updatedMap);
    return { success: true };
  }
};
