import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { wishlistService } from '../services/wishlistService';
import { addressService } from '../services/addressService';
import { reviewService } from '../services/reviewService';
import { notificationService } from '../services/notificationService';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  seedInitialDataToSupabase,
  getSupabase
} from '../lib/supabase';

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 49;

const ShopContext = createContext(undefined);

export const ShopProvider = ({ children }) => {
  // Load products from productService (which supports admin additions/edits)
  const [products, setProducts] = useState(() => productService.getProducts());

  // Parse hash or pathname route
  const parseHashRoute = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const pathname = window.location.pathname.trim();
    const routeStr = hash || (pathname !== '/' ? pathname : '');

    if (!routeStr || routeStr === '/' || routeStr === 'home') return { page: 'home', slug: null, subtab: null };
    if (routeStr.startsWith('/product/')) {
      const slug = routeStr.replace('/product/', '').split('/')[0].split('?')[0].trim();
      return { page: 'product-detail', slug, subtab: null };
    }
    if (routeStr === '/shop' || routeStr === 'shop') return { page: 'shop', slug: null, subtab: null };
    if (routeStr === '/story' || routeStr === 'story' || routeStr === 'our-story') return { page: 'story', slug: null, subtab: null };
    if (routeStr === '/why-zestora' || routeStr === 'why-zestora') return { page: 'why-zestora', slug: null, subtab: null };
    if (routeStr === '/contact' || routeStr === 'contact') return { page: 'contact', slug: null, subtab: null };
    if (routeStr === '/cart' || routeStr === 'cart') return { page: 'cart', slug: null, subtab: null };
    if (routeStr === '/checkout' || routeStr === 'checkout') return { page: 'checkout', slug: null, subtab: null };
    if (routeStr === '/order-confirmation' || routeStr === 'order-confirmation') return { page: 'order-confirmation', slug: null, subtab: null };
    
    // New pages
    if (routeStr === '/account' || routeStr === 'account' || routeStr === '/profile' || routeStr === 'profile') {
      return { page: 'account', slug: null, subtab: 'profile' };
    }
    if (routeStr === '/orders' || routeStr === 'orders' || routeStr === '/my-orders') {
      return { page: 'account', slug: null, subtab: 'orders' };
    }
    if (routeStr === '/wishlist' || routeStr === 'wishlist') return { page: 'wishlist', slug: null, subtab: null };
    if (routeStr === '/faq' || routeStr === 'faq' || routeStr === '/faqs') return { page: 'faq', slug: null, subtab: null };
    if (routeStr === '/privacy-policy' || routeStr === 'privacy-policy') return { page: 'privacy-policy', slug: null, subtab: null };
    if (routeStr === '/terms' || routeStr === 'terms' || routeStr === '/terms-and-conditions') return { page: 'terms', slug: null, subtab: null };
    if (routeStr === '/shipping-policy' || routeStr === 'shipping-policy') return { page: 'shipping-policy', slug: null, subtab: null };
    if (routeStr === '/returns-policy' || routeStr === 'returns-policy' || routeStr === '/refund-policy') return { page: 'returns-policy', slug: null, subtab: null };

    // Admin routes
    if (routeStr.startsWith('/admin') || routeStr.startsWith('admin')) {
      if (routeStr === '/admin/login' || routeStr === 'admin/login') {
        return { page: 'admin-login', slug: null, subtab: null };
      }
      const parts = routeStr.replace('/admin', '').replace('admin', '').replace(/^\//, '').split('/');
      const subtab = parts[0] || 'overview';
      return { page: 'admin', slug: null, subtab };
    }

    return { page: 'home', slug: null, subtab: null };
  };

  const initialRoute = parseHashRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [currentSubtab, setCurrentSubtab] = useState(initialRoute.subtab);
  const [selectedProductSlug, setSelectedProductSlug] = useState(
    initialRoute.slug || 'dried-mango'
  );

  // Selected product lookup
  const selectedProduct = products.find(p => p.slug === selectedProductSlug || p.id === selectedProductSlug) || products[0] || null;

  // AUTH STATE
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [adminUser, setAdminUser] = useState(() => authService.getAdminUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [authModalMessage, setAuthModalMessage] = useState(null);
  const [pendingAuthAction, setPendingAuthAction] = useState(null);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => wishlistService.getWishlist());

  // Addresses state
  const [userAddresses, setUserAddresses] = useState(() => 
    user ? addressService.getUserAddresses(user.id) : []
  );

  // User notifications
  const [userNotifications, setUserNotifications] = useState(() =>
    user ? notificationService.getUserNotifications(user.id) : []
  );

  // Reviews state (mapping of productId -> array of approved reviews)
  const [reviewsMap, setReviewsMap] = useState(() => reviewService.getAllReviewsMap());

  // Latest order
  const [latestOrder, setLatestOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Order Tracking Modal State
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const openOrderTracking = (orderIdOrOrder) => {
    if (typeof orderIdOrOrder === 'object' && orderIdOrOrder !== null) {
      setActiveTrackingOrder(orderIdOrOrder);
      setIsTrackingModalOpen(true);
    } else if (typeof orderIdOrOrder === 'string') {
      const found = orderService.getById(orderIdOrOrder);
      if (found) {
        setActiveTrackingOrder(found);
        setIsTrackingModalOpen(true);
      } else {
        showToast(`Order ${orderIdOrOrder} not found.`);
      }
    }
  };

  const closeOrderTracking = () => {
    setIsTrackingModalOpen(false);
    setActiveTrackingOrder(null);
  };

  const openAuthModal = (mode = 'login', message = null) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const markNotificationAsRead = (id) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsAsRead = () => {
    notificationService.markAllAsRead(user?.id);
    refreshNotifications();
  };

  // User orders
  const [userOrders, setUserOrders] = useState(() =>
    user ? orderService.getUserOrders(user.id, user.email) : []
  );

  // Refresh methods
  const refreshProducts = useCallback(() => {
    setProducts(productService.getProducts());
  }, []);

  const addProduct = useCallback((productData) => {
    const res = productService.addProduct(productData);
    if (res.success && res.products) {
      setProducts(res.products);
    }
    return res;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    const res = productService.updateProduct(id, updates);
    if (res.success && res.products) {
      setProducts(res.products);
    }
    return res;
  }, []);

  const deleteProduct = useCallback((productId) => {
    const res = productService.deleteProduct(productId);
    if (res.success) {
      setProducts(res.products);

      // 1. Safely remove deleted product from cart
      setCart(prev => {
        const cleaned = prev.filter(item =>
          item.product?.id !== productId &&
          item.product?.slug !== productId &&
          !item.id?.startsWith(`${productId}-`)
        );
        try {
          localStorage.setItem('zestora_cart', JSON.stringify(cleaned));
        } catch {
          // ignore
        }
        return cleaned;
      });

      // 2. Safely remove from wishlist
      wishlistService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(id => id !== productId));

      // 3. Fallback selectedProductSlug if needed
      const remainingActive = res.products.filter(p => p.isActive !== false);
      setSelectedProductSlug(prev => {
        if (prev === productId || !remainingActive.some(p => p.slug === prev || p.id === prev)) {
          return remainingActive.length > 0 ? remainingActive[0].slug : '';
        }
        return prev;
      });
    }
    return res;
  }, []);

  const refreshWishlist = useCallback(() => {
    setWishlist(wishlistService.getWishlist());
  }, []);

  const refreshAddresses = useCallback(() => {
    if (user) {
      setUserAddresses(addressService.getUserAddresses(user.id));
    } else {
      setUserAddresses([]);
    }
  }, [user]);

  const refreshOrders = useCallback(() => {
    if (user) {
      setUserOrders(orderService.getUserOrders(user.id, user.email));
    } else {
      setUserOrders([]);
    }
  }, [user]);

  const refreshNotifications = useCallback(() => {
    if (user) {
      setUserNotifications(notificationService.getUserNotifications(user.id));
    } else {
      setUserNotifications([]);
    }
  }, [user]);

  const refreshReviews = useCallback(() => {
    setReviewsMap(reviewService.getAllReviewsMap());
  }, []);

  // Update dependencies when user changes
  useEffect(() => {
    if (user) {
      setUserAddresses(addressService.getUserAddresses(user.id));
      setUserOrders(orderService.getUserOrders(user.id, user.email));
      setUserNotifications(notificationService.getUserNotifications(user.id));

      if (isSupabaseConfigured()) {
        addressService.fetchUserAddresses(user.id).then(addrs => {
          if (addrs) setUserAddresses(addrs);
        });
        orderService.fetchFromDatabase(user.id).then(userOrds => {
          if (userOrds) setUserOrders(userOrds);
        });
        wishlistService.fetchUserWishlist(user.id).then(w => {
          if (w) setWishlist(w);
        });
        notificationService.fetchUserNotifications(user.id).then(n => {
          if (n) setUserNotifications(n);
        });
      }
    } else {
      setUserAddresses([]);
      setUserOrders([]);
      setUserNotifications([]);
    }
  }, [user]);

  // Initial Supabase database synchronization & auth state listening
  useEffect(() => {
    if (isSupabaseConfigured()) {
      productService.fetchFromDatabase().then(fetched => {
        if (fetched && fetched.length > 0) {
          setProducts(fetched);
        }
      });
      reviewService.fetchFromDatabase().then(revs => {
        if (revs) {
          setReviewsMap(revs);
        }
      });
    }

    const unsubscribe = authService.subscribeToAuthChanges((updatedUser) => {
      if (updatedUser) {
        setUser(updatedUser);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sync hash changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHashRoute();
      setCurrentPage(route.page);
      setCurrentSubtab(route.subtab);
      if (route.slug) {
        setSelectedProductSlug(route.slug);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to cross-tab/window storage changes to keep products in sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e || e.key === 'zestora_products' || !e.key) {
        refreshProducts();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProducts]);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('zestora_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  const navigateTo = (page, param) => {
    setCurrentPage(page);
    if (page === 'product-detail' && param) {
      setSelectedProductSlug(param);
      window.location.hash = `/product/${param}`;
    } else if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'admin') {
      const sub = param || currentSubtab || 'overview';
      setCurrentSubtab(sub);
      window.location.hash = `/admin/${sub}`;
    } else if (page === 'account' && param) {
      setCurrentSubtab(param);
      window.location.hash = `/account?tab=${param}`;
    } else {
      window.location.hash = `/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  // Auth gatekeeper
  const requireAuth = (actionCallback, message = 'Please sign in to proceed.') => {
    if (user) {
      actionCallback();
    } else {
      setPendingAuthAction(() => actionCallback);
      setAuthModalMessage(message);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      showToast(`Welcome back, ${res.user.fullName}!`);
      if (pendingAuthAction) {
        const action = pendingAuthAction;
        setPendingAuthAction(null);
        setTimeout(() => action(), 100);
      }
    }
    return res;
  };

  const handleSignup = async (userData) => {
    const res = await authService.signup(userData);
    if (res.success) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      showToast(`Welcome to Zestora, ${res.user.fullName}!`);
      if (pendingAuthAction) {
        const action = pendingAuthAction;
        setPendingAuthAction(null);
        setTimeout(() => action(), 100);
      }
    }
    return res;
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    showToast('You have been logged out.');
    if (currentPage === 'account') {
      navigateTo('home');
    }
  };

  const handleUpdateProfile = async (updates) => {
    const res = await authService.updateProfile(updates);
    if (res.success) {
      setUser(res.user);
      showToast('Profile details updated successfully.');
    }
    return res;
  };

  // Admin Auth
  const handleAdminLogin = async (email, password) => {
    const res = await authService.adminLogin(email, password);
    if (res.success) {
      setAdminUser(res.admin);
      showToast('Admin access granted.');
      navigateTo('admin', 'overview');
    }
    return res;
  };

  const handleAdminLogout = async () => {
    await authService.adminLogout();
    setAdminUser(null);
    showToast('Admin logged out.');
    navigateTo('home');
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    const res = wishlistService.toggleWishlist(productId, user?.id);
    refreshWishlist();
    showToast(res.inWishlist ? 'Saved to your wishlist' : 'Removed from wishlist');
    return res;
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Cart Actions
  const addToCart = (product, weightLabel, quantity = 1, openDrawer = true) => {
    const selectedWeight = weightLabel || product.defaultWeight;
    const weightConfig = (product.netWeights || []).find(w => w.label === selectedWeight) || product.netWeights?.[0];
    const unitPrice = Math.round(product.price * (weightConfig ? weightConfig.priceMultiplier : 1));
    const itemKey = `${product.id}-${selectedWeight}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            selectedWeight,
            unitPrice,
            quantity
          }
        ];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${selectedWeight}) to bag`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(item => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('zestora_cart');
    } catch {
      // Ignore
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryCharge = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const cartTotal = cartSubtotal + deliveryCharge;

  // Reviews helpers
  const getProductReviews = (productId) => {
    return (reviewsMap[productId] || []).filter(r => r.status === 'approved');
  };

  const addReview = (productId, name, rating, text, image = null, orderId = null) => {
    const res = reviewService.addReview({
      productId,
      customerName: name,
      userId: user?.id,
      userEmail: user?.email,
      rating,
      reviewText: text,
      image,
      orderId
    });

    if (res.success) {
      refreshReviews();
      refreshProducts();
      showToast('Thank you! Your review has been submitted.');
    }
    return res;
  };

  // Order Placement
  const createOrder = (customer, address, paymentMethod, upiRefNumber = '', upiScreenshotName = '') => {
    // Take an immutable snapshot of items and product data so deleted catalog products never affect historical orders
    const itemSnapshots = cart.map(item => ({
      id: item.id,
      selectedWeight: item.selectedWeight,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      product: {
        id: item.product?.id,
        name: item.product?.name,
        slug: item.product?.slug,
        price: item.product?.price,
        image: item.product?.image || item.product?.images?.main || item.product?.images?.thumbnail || '/assets/products/dried-mango.png',
        images: {
          main: item.product?.images?.main || item.product?.image || '/assets/products/dried-mango.png',
          thumbnail: item.product?.images?.thumbnail || item.product?.images?.main || item.product?.image || '/assets/products/dried-mango.png'
        }
      }
    }));

    const newOrder = orderService.createOrder({
      items: itemSnapshots,
      subtotal: cartSubtotal,
      deliveryCharge,
      total: cartTotal,
      customer,
      address,
      paymentMethod,
      upiRefNumber,
      upiScreenshotName,
      userId: user?.id || null
    });

    setLatestOrder(newOrder);
    try {
      localStorage.setItem('zestora_latest_order', JSON.stringify(newOrder));
    } catch {
      // Ignore
    }

    clearCart();
    refreshOrders();
    refreshNotifications();
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        currentSubtab,
        setCurrentSubtab,
        selectedProductSlug,
        products,
        activeProducts: products.filter(p => p.isActive !== false),
        selectedProduct,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        reviews: reviewsMap,
        getProductReviews,
        addReview,
        latestOrder,
        createOrder,
        toastMessage,
        showToast,
        // Auth state
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalMessage,
        setAuthModalMessage,
        openAuthModal,
        requireAuth,
        handleLogin,
        login: handleLogin,
        handleSignup,
        signup: handleSignup,
        register: handleSignup,
        handleLogout,
        logout: handleLogout,
        handleUpdateProfile,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
        // Addresses
        userAddresses,
        refreshAddresses,
        // Orders
        userOrders,
        refreshOrders,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        activeTrackingOrder,
        openOrderTracking,
        closeOrderTracking,
        // Notifications
        userNotifications,
        notifications: userNotifications,
        refreshNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        // Admin & Products
        adminUser,
        handleAdminLogin,
        handleAdminLogout,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshReviews,
        // Supabase Database Status & Tools
        isSupabaseConfigured,
        testSupabaseConnection,
        seedInitialDataToSupabase
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
