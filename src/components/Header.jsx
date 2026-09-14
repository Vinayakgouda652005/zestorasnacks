import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Search, User, Menu, X, Truck, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

export const Header = () => {
  const { currentPage, navigateTo, cartCount, setIsCartDrawerOpen, setIsSearchOpen } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Shop', route: 'shop' },
    { label: 'Our Story', route: 'story' },
    { label: 'Why Zestora', route: 'why-zestora' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar matching screenshot */}
      <aside aria-label="Announcement" className="bg-[#183424] text-[#FBF8F2] text-[11px] sm:text-xs py-2 px-4 tracking-normal border-b border-[#255038]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Centered announcement message with truck icon */}
          <div className="w-full text-center flex items-center justify-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-[#FBF8F2]/90 shrink-0" />
            <span className="font-medium">Free Delivery on Orders Above ₹499 | Pure Fruits. No Compromise.</span>
          </div>
          {/* Country selector positioned on far right */}
          <div className="hidden sm:flex absolute right-0 items-center space-x-1 text-[#FBF8F2]/80 hover:text-white cursor-pointer select-none">
            <span>India (INR)</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </div>
        </div>
      </aside>

      {/* Main Sticky Navigation Header matching screenshot */}
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

          {/* Left: Brand Logo matching attached brand asset */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer group flex items-center select-none"
          >
            <Logo className="h-9 sm:h-10 w-auto transition-transform group-hover:scale-[1.02]" />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
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

          {/* Right: Search, Account, Bag Icons */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <button
              id="header-search-btn"
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors"
              aria-label="Search Products"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              id="header-account-btn"
              type="button"
              onClick={() => setAccountModalOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              id="header-cart-btn"
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-1.5 text-[#193826] hover:text-[#C5A869] transition-colors relative flex items-center"
              aria-label="Shopping Bag"
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
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl z-50 flex flex-col p-6 border-r border-[#E8DDCD]">
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

            <nav className="flex flex-col space-y-4 py-6">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  id={`mobile-nav-${item.route}`}
                  onClick={() => {
                    navigateTo(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-base py-2 transition-colors ${
                    currentPage === item.route
                      ? 'text-[#193826] font-semibold border-l-2 border-[#193826] pl-3'
                      : 'text-[#193826]/80 hover:text-[#193826] pl-3'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                id="mobile-nav-cart"
                onClick={() => {
                  navigateTo('cart');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base py-2 text-[#193826]/80 hover:text-[#193826] pl-3 flex items-center justify-between"
              >
                <span>Shopping Bag</span>
                <span className="bg-[#193826] text-[#FBF8F2] text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </button>
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

      {/* Account Info Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setAccountModalOpen(false)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] max-w-md w-full p-6 shadow-2xl z-10">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8DDCD]">
              <div>
                <h3 className="font-serif text-xl text-[#193826]">Zestora Account</h3>
                <p className="text-xs text-[#193826]/70">Pure Fruits. No Compromise.</p>
              </div>
              <button
                id="close-account-modal"
                onClick={() => setAccountModalOpen(false)}
                className="p-1 text-[#193826]/60 hover:text-[#193826]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-5 space-y-3 text-xs text-[#193826]/80">
              <p>Welcome to ZESTORA. Direct UPI ordering is enabled with zero signup hassle.</p>
              <div className="bg-[#F5EFEB] p-3 border border-[#E8DDCD] text-xs space-y-1">
                <p className="font-semibold text-[#193826]">Direct UPI Ordering:</p>
                <p>Scan our verified QR code at checkout with any UPI app.</p>
              </div>
            </div>
            <button
              id="view-orders-btn"
              onClick={() => {
                setAccountModalOpen(false);
                navigateTo('shop');
              }}
              className="w-full py-3 bg-[#193826] text-[#FBF8F2] text-xs font-semibold hover:bg-[#12291C] transition-colors rounded-[2px]"
            >
              Explore Snack Collection
            </button>
          </div>
        </div>
      )}
    </>
  );
};
