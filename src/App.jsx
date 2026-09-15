/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { StoryPage } from './pages/StoryPage';
import { WhyZestoraPage } from './pages/WhyZestoraPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { FAQPage } from './pages/FAQPage';
import { PolicyPage } from './pages/PolicyPage';
import { AdminPage } from './pages/AdminPage';

import { Check } from 'lucide-react';

const PageRenderer = () => {
  const {
    currentPage,
    toastMessage,
    activeTrackingOrder,
    isTrackingModalOpen,
    closeOrderTracking
  } = useShop();

  const isAdminRoute = currentPage === 'admin' || currentPage === 'admin-login';

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'account':
        return <AccountPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'faq':
        return <FAQPage />;
      case 'privacy-policy':
        return <PolicyPage policyType="privacy" />;
      case 'terms':
        return <PolicyPage policyType="terms" />;
      case 'shipping-policy':
        return <PolicyPage policyType="shipping" />;
      case 'returns-policy':
        return <PolicyPage policyType="returns" />;
      case 'story':
        return <StoryPage />;
      case 'why-zestora':
        return <WhyZestoraPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
      case 'admin-login':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F2] text-[#193826] font-sans antialiased selection:bg-[#C5A869]/30 selection:text-[#193826]">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#193826] text-[#FBF8F2] border border-[#255038] px-4 py-3 shadow-xl flex items-center space-x-2.5 text-xs animate-fade-in rounded-[2px]"
        >
          <div className="w-4 h-4 rounded-full bg-[#C5A869] text-[#193826] flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Persistent Global Header (Hidden on Admin portal) */}
      {!isAdminRoute && <Header />}

      {/* Dynamic Viewport */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Global Interactive Elements */}
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <OrderTrackingModal
        order={activeTrackingOrder}
        isOpen={isTrackingModalOpen}
        onClose={closeOrderTracking}
      />

      {/* Persistent Editorial Footer (Hidden on Admin portal) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <PageRenderer />
    </ShopProvider>
  );
}
