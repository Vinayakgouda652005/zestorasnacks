import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Truck,
  ChevronDown,
  Heart,
  Bell,
  CheckCircle2,
  Package,
  LogOut,
  MapPin,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';

export const Header = () => {
  const {
    currentPage,
    navigateTo,
    cartCount,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    user,
    logout,
    openAuthModal,
    wishlist,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openOrderTracking
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Shop', route: 'shop' },
    { label: 'Our Story', route: 'story' },
    { label: 'Why Zestora', route: 'why-zestora' },
    { label: 'FAQs', route: 'faq' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside aria-label="Announcement" className="bg-[#183424] text-[#FBF8F2] text-[11px] sm:text-xs py-2 px-4 tracking-normal border-b border-[#255038]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="w-full text-center flex items-center justify-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-[#FBF8F2]/90 shrink-0" />
            <span className="font-medium">Free Express Delivery on Orders Above ₹499 | Pure Sun-Dried Fruits</span>
          </div>
          <div className="hidden sm:flex absolute right-0 items-center space-x-1 text-[#FBF8F2]/80 hover:text-white cursor-pointer select-none">
            <span>India (INR)</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </div>
        </div>
      </aside>

      {/* Main Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FFFFFF]/98 backdrop-blur-md shadow-xs border-b border-[#E8DDCD]'
            : 'bg-[#FFFFFF] border-b border-[#E8DDCD]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between">
          
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Left: Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer group flex items-center select-none"
          >
            <Logo className="h-9 sm:h-10 w-auto transition-transform group-hover:scale-[1.02]" />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-7">
            {navLinks.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => navigateTo(item.route)}
                  className={`text-xs tracking-normal font-sans transition-colors relative py-1 ${
                    isActive ? 'text-[#193826] font-semibold' : 'text-[#193826]/80 hover:text-[#193826]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#193826]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Wishlist, Notifications, Account, Bag */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Search Button */}
            <button
              id="header-search-btn"
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors"
              aria-label="Search Products"
              title="Search Snacks"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            {/* Wishlist Heart Icon */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => navigateTo('wishlist')}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors relative"
              aria-label="View Saved Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A869] text-[#193826] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifMenuRef}>
              <button
                id="header-notifications-btn"
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors relative"
                aria-label="Notifications"
                title="Activity Notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.75]" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full" />
                )}
              </button>

              {/* Notifications Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#E8DDCD] flex items-center justify-between">
                    <span className="font-serif font-bold text-[#193826]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] uppercase tracking-wider text-[#C5A869] hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E8DDCD]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[#193826]/60 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.orderId) {
                              openOrderTracking(notif.orderId);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-[#FFFFFF] cursor-pointer transition-colors ${
                            !notif.read ? 'bg-[#F4ECE1]/60 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs text-[#193826] leading-snug">{notif.message}</span>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 bg-[#C5A869] rounded-full shrink-0 mt-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#193826]/50 block mt-1">
                            {new Date(notif.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Profile / Login Button */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  id="header-user-menu-btn"
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors flex items-center gap-1"
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#193826] text-[#FBF8F2] flex items-center justify-center text-[11px] font-bold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#193826]/70 hidden sm:block" />
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  type="button"
                  onClick={() => openAuthModal()}
                  className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors"
                  aria-label="Log In"
                  title="Sign In / Register"
                >
                  <User className="w-4 h-4 stroke-[1.75]" />
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-[#E8DDCD]">
                    <p className="font-serif text-sm font-bold text-[#193826] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-[#193826]/60 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#C5A869] text-[#193826] text-[9px] uppercase tracking-wider font-bold rounded-[2px]">
                        Store Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('account');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#193826] hover:bg-[#FFFFFF] flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-[#193826]/70" />
                      <span>My Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('wishlist');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#193826] hover:bg-[#FFFFFF] flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#193826]/70" />
                      <span>Saved Wishlist ({wishlist.length})</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigateTo('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[#193826] font-semibold hover:bg-[#FFFFFF] flex items-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#C5A869]" />
                        <span>Admin Console</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#E8DDCD]">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag Icon */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors relative flex items-center"
              aria-label="Shopping Bag"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
              <span className="ml-1 bg-[#193826] text-[#FBF8F2] text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-4">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl z-50 flex flex-col p-6 border-r border-[#E8DDCD] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
              <div
                onClick={() => {
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className="cursor-pointer flex items-center"
              >
                <Logo className="h-8 sm:h-9 w-auto" />
              </div>
              <button
                id="close-mobile-menu"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#193826]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Auth Banner in Mobile Menu */}
            <div className="py-4 border-b border-[#E8DDCD]">
              {user ? (
                <div className="space-y-1">
                  <p className="font-serif font-bold text-sm text-[#193826]">{user.fullName}</p>
                  <p className="text-xs text-[#193826]/60">{user.email}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigateTo('account');
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-[#C5A869] font-semibold underline"
                    >
                      Manage Account
                    </button>
                    <span className="text-[#193826]/40">•</span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold rounded-[2px]"
                >
                  Sign In / Register
                </button>
              )}
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-3 py-6">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  id={`mobile-nav-${item.route}`}
                  onClick={() => {
                    navigateTo(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-base py-1.5 transition-colors ${
                    currentPage === item.route
                      ? 'text-[#193826] font-semibold border-l-2 border-[#193826] pl-3'
                      : 'text-[#193826]/80 hover:text-[#193826] pl-3'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                id="mobile-nav-wishlist"
                onClick={() => {
                  navigateTo('wishlist');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base py-1.5 text-[#193826]/80 hover:text-[#193826] pl-3 flex items-center justify-between"
              >
                <span>Saved Wishlist</span>
                <span className="bg-[#C5A869] text-[#193826] text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              </button>

              <button
                id="mobile-nav-cart"
                onClick={() => {
                  navigateTo('cart');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base py-1.5 text-[#193826]/80 hover:text-[#193826] pl-3 flex items-center justify-between"
              >
                <span>Shopping Bag</span>
                <span className="bg-[#193826] text-[#FBF8F2] text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    navigateTo('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-base py-1.5 text-[#193826] font-bold pl-3 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#C5A869]" />
                  <span>Admin Operations Console</span>
                </button>
              )}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#E8DDCD] text-xs text-[#193826]/70 space-y-1.5">
              <p className="font-semibold text-[#193826]">Customer Care</p>
              <p>
                Email:{' '}
                <a href="mailto:zestorasnacks@gmail.com" className="hover:underline text-[#193826]">
                  zestorasnacks@gmail.com
                </a>
              </p>
              <p>
                WhatsApp / Call:{' '}
                <a
                  href="https://wa.me/919880882476"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-[#193826]"
                >
                  +91 9880882476
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
