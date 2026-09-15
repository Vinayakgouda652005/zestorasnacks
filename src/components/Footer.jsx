import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { newsletterService } from '../services/newsletterService';
import { Instagram, Heart, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const { navigateTo, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      newsletterService.subscribe(email.trim(), 'Storefront Footer');
      setSubscribed(true);
      setEmail('');
      showToast('Subscribed to Zestora Pantry updates!');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#FAF7F2] text-[#193826] pt-14 pb-8 border-t border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#E8DDCD]">
          
          {/* Col 1: Brand Info & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div
              className="cursor-pointer inline-block"
              onClick={() => navigateTo('home')}
            >
              <Logo className="h-10 sm:h-11 w-auto" />
            </div>

            <p className="text-xs sm:text-sm text-[#193826]/75 leading-relaxed max-w-sm">
              Wholesome snacks for a healthier, happier tomorrow. 100% natural, sun-dried tropical fruits from Indian orchards.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-[#193826]/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-[#193826]/30 flex items-center justify-center hover:border-[#193826] hover:bg-[#193826] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/919880882476"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-[#193826]/30 flex items-center justify-center hover:border-[#193826] hover:bg-[#193826] hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#193826] mb-3 uppercase tracking-wider font-sans">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#193826]/80 font-sans">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('story')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('why-zestora')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Why Zestora
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Help & Policies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-[#193826] mb-3 uppercase tracking-wider font-sans">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#193826]/80 font-sans">
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping-policy')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('returns-policy')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Returns & Refunds Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('privacy-policy')}
                  className="hover:text-[#193826] hover:underline transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Join Our Community (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#193826] uppercase tracking-wider font-sans">
              Join Our Community
            </h4>
            <p className="text-xs text-[#193826]/75 leading-relaxed font-sans">
              Get exclusive VIP offers, seasonal harvests, and healthy snacking updates.
            </p>

            {subscribed ? (
              <div className="bg-[#183424]/10 border border-[#183424]/20 p-2.5 text-xs text-[#193826] flex items-center space-x-2 rounded-[2px]">
                <CheckCircle2 className="w-4 h-4 text-[#183424] shrink-0" />
                <span>Thank you for subscribing to Zestora!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-stretch mt-3 max-w-sm">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-white border border-[#E8DDCD] border-r-0 text-[#193826] placeholder-[#193826]/45 text-xs px-3 py-2 rounded-l-[2px] focus:outline-none focus:border-[#193826]"
                />
                <button
                  id="footer-subscribe-btn"
                  type="submit"
                  className="px-4 py-2 bg-[#193826] text-white text-xs font-medium rounded-r-[2px] hover:bg-[#12291C] transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#193826]/65 gap-2">
          <div className="flex items-center gap-3">
            <p>© 2024 Zestora. All rights reserved.</p>
            <span className="text-[#193826]/30">•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-[#193826] underline flex items-center gap-1 text-[11px]"
            >
              <Lock className="w-3 h-3 text-[#C5A869]" />
              <span>Admin Portal</span>
            </button>
          </div>

          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-[#D26466] text-[#D26466] inline" />
            <span>for a healthier tomorrow.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
