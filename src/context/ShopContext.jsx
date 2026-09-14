import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products.js';

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 49;

const ShopContext = createContext(undefined);

export const ShopProvider = ({ children }) => {
  const [products] = useState(INITIAL_PRODUCTS);

  // Initialize route from URL hash or pathname
  const parseHashRoute = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const pathname = window.location.pathname.trim();
    const routeStr = hash || (pathname !== '/' ? pathname : '');

    if (!routeStr || routeStr === '/' || routeStr === 'home') return { page: 'home', slug: null };
    if (routeStr.startsWith('/product/')) {
      const slug = routeStr.replace('/product/', '').split('/')[0].split('?')[0].trim();
      return { page: 'product-detail', slug };
    }
    if (routeStr === '/shop' || routeStr === 'shop') return { page: 'shop', slug: null };
    if (routeStr === '/story' || routeStr === 'story' || routeStr === 'our-story') return { page: 'story', slug: null };
    if (routeStr === '/why-zestora' || routeStr === 'why-zestora') return { page: 'why-zestora', slug: null };
    if (routeStr === '/contact' || routeStr === 'contact') return { page: 'contact', slug: null };
    if (routeStr === '/cart' || routeStr === 'cart') return { page: 'cart', slug: null };
    if (routeStr === '/checkout' || routeStr === 'checkout') return { page: 'checkout', slug: null };
    if (routeStr === '/order-confirmation' || routeStr === 'order-confirmation') return { page: 'order-confirmation', slug: null };
    return { page: 'home', slug: null };
  };

  const initialRoute = parseHashRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [selectedProductSlug, setSelectedProductSlug] = useState(
    initialRoute.slug || 'dried-mango'
  );

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

  // Reviews persisted to localStorage
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Orders persisted to localStorage
  const [latestOrder, setLatestOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync hash changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHashRoute();
      setCurrentPage(route.page);
      if (route.slug) {
        setSelectedProductSlug(route.slug);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('zestora_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Save reviews changes
  useEffect(() => {
    try {
      localStorage.setItem('zestora_reviews', JSON.stringify(reviews));
    } catch {
      // Ignore storage errors
    }
  }, [reviews]);

  const navigateTo = (page, productSlug) => {
    setCurrentPage(page);
    if (productSlug) {
      setSelectedProductSlug(productSlug);
      window.location.hash = `/product/${productSlug}`;
    } else if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find(p => p.slug === selectedProductSlug) || products[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (product, weightLabel, quantity = 1, openDrawer = true) => {
    const selectedWeight = weightLabel || product.defaultWeight;
    const weightConfig = product.netWeights.find(w => w.label === selectedWeight) || product.netWeights[0];
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

  const getProductReviews = (productId) => {
    return reviews[productId] || [];
  };

  const addReview = (productId, name, rating, text) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: name,
      rating,
      reviewDate: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
      reviewText: text,
      verifiedBuyer: true
    };

    setReviews(prev => ({
      ...prev,
      [productId]: [newRev, ...(prev[productId] || [])]
    }));

    showToast('Thank you! Your review has been published.');
  };

  const createOrder = (customer, address, paymentMethod) => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: `ZST-${orderNumber}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge,
      total: cartTotal,
      customer,
      address,
      paymentMethod,
      status: 'confirmed'
    };

    setLatestOrder(newOrder);
    try {
      localStorage.setItem('zestora_latest_order', JSON.stringify(newOrder));
    } catch {
      // Ignore
    }

    clearCart();
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        selectedProductSlug,
        products,
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
        reviews,
        getProductReviews,
        addReview,
        latestOrder,
        createOrder,
        toastMessage,
        showToast
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
