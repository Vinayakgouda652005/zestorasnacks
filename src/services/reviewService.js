/**
 * ZESTORA Review Management Service
 * Integrates Supabase PostgreSQL reviews table + image upload to review-images bucket.
 */
import { INITIAL_REVIEWS } from '../data/products.js';
import { getStorageItem, setStorageItem } from './storage';
import { orderService } from './orderService';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const REVIEWS_KEY = 'zestora_reviews';

export const reviewService = {
  getAllReviewsMap() {
    const stored = getStorageItem(REVIEWS_KEY, null);
    if (!stored || typeof stored !== 'object') {
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

  getApprovedProductReviews(productId) {
    const map = this.getAllReviewsMap();
    const list = map[productId] || [];
    return list.filter(r => r.status === 'approved');
  },

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

  async fetchFromDatabase(productId = null) {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getAllReviewsMap();
    }

    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetch reviews error:', error);
        return this.getAllReviewsMap();
      }

      if (data && Array.isArray(data)) {
        const currentMap = this.getAllReviewsMap();
        const nextMap = { ...currentMap };

        data.forEach(r => {
          const pId = r.product_id;
          if (!nextMap[pId]) nextMap[pId] = [];

          const existingIndex = nextMap[pId].findIndex(x => x.id === r.id);
          const formatted = {
            id: r.id,
            productId: r.product_id,
            orderId: r.order_id,
            userId: r.user_id,
            customerName: r.customer_name,
            rating: r.rating,
            reviewDate: new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(r.created_at)),
            createdAt: new Date(r.created_at).getTime(),
            reviewText: r.review_text,
            verifiedBuyer: Boolean(r.verified_purchase),
            image: r.image_url,
            status: r.status || (r.approved ? 'approved' : 'pending')
          };

          if (existingIndex >= 0) {
            nextMap[pId][existingIndex] = formatted;
          } else {
            nextMap[pId].push(formatted);
          }
        });

        setStorageItem(REVIEWS_KEY, nextMap);
        return nextMap;
      }
    } catch (err) {
      console.warn('Error fetching reviews from Supabase:', err);
    }
    return this.getAllReviewsMap();
  },

  hasUserPurchasedProduct(userId, userEmail, productId) {
    const orders = orderService.getUserOrders(userId, userEmail);
    return orders.some(o => 
      o.items && o.items.some(item => item.product?.id === productId || item.product?.slug === productId)
    );
  },

  hasUserReceivedProduct(userId, userEmail, productId) {
    const orders = orderService.getUserOrders(userId, userEmail);
    return orders.some(o => 
      o.status?.toLowerCase() === 'delivered' &&
      o.items && o.items.some(item => item.product?.id === productId || item.product?.slug === productId)
    );
  },

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
      status: 'approved'
    };

    const map = this.getAllReviewsMap();
    const currentProdList = map[productId] || [];
    const updated = {
      ...map,
      [productId]: [newReview, ...currentProdList]
    };
    setStorageItem(REVIEWS_KEY, updated);

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('reviews').insert({
            product_id: productId,
            order_id: orderId || null,
            user_id: (userId && userId.length > 20) ? userId : null,
            customer_name: customerName.trim(),
            rating: Number(rating),
            review_text: reviewText.trim(),
            image_url: image || null,
            verified_purchase: true,
            approved: true,
            status: 'approved'
          });
        } catch (err) {
          console.warn('Supabase addReview sync error:', err);
        }
      })();
    }

    this.syncProductRating(productId);
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

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase
            .from('reviews')
            .update({
              status: nextStatus,
              approved: nextStatus === 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', reviewId);
        } catch (err) {
          console.warn('Supabase updateReviewStatus error:', err);
        }
      })();
    }

    this.syncProductRating(productId);
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

    // Sync to Supabase
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase.from('reviews').delete().eq('id', reviewId);
        } catch (err) {
          console.warn('Supabase deleteReview error:', err);
        }
      })();
    }

    this.syncProductRating(productId);
    return { success: true };
  },

  calculateProductRating(productId) {
    const approved = this.getApprovedProductReviews(productId);
    if (approved.length === 0) return { rating: 5.0, count: 0 };
    const sum = approved.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = Math.round((sum / approved.length) * 10) / 10;
    return { rating: avg, count: approved.length };
  },

  async syncProductRating(productId) {
    const { rating, count } = this.calculateProductRating(productId);
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({ rating, review_count: count, updated_at: new Date().toISOString() })
          .or(`id.eq.${productId},slug.eq.${productId}`);
      } catch (err) {
        console.warn('Failed to sync product rating in Supabase:', err);
      }
    }
  }
};
