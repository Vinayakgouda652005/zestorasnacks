import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, Sparkles, RefreshCw } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'products',
    label: 'Our Fruit Products',
    icon: Sparkles,
    questions: [
      {
        q: 'Are Zestora dehydrated fruits 100% natural?',
        a: 'Yes, absolutely. We use sun-ripened fruits sourced directly from verified Indian orchards. Our fruits contain zero preservatives, zero sulfur dioxide, no artificial food colors, and no refined sugars or corn syrups.'
      },
      {
        q: 'Are there any added sugars or artificial sweeteners?',
        a: 'None whatsoever. The sweetness you taste is purely from the concentrated natural fructose of ripe Alphonso mangoes, Queen pineapples, and pink guavas.'
      },
      {
        q: 'Are Zestora snacks vegan and gluten-free?',
        a: 'Yes, all our single-fruit pouches and crispy fruit chips are naturally vegan, gluten-free, dairy-free, and plant-based, prepared in a certified food-safe facility.'
      },
      {
        q: 'What is the shelf life of the fruit pouches?',
        a: 'Our products have a shelf life of 9 months from the packaging date. Because we dehydrate them to optimal moisture levels and seal them in multi-barrier pouches with an oxygen scavenger, they retain their freshness naturally without chemical additives.'
      },
      {
        q: 'How should I store Zestora dehydrated snacks once opened?',
        a: 'Keep the pouch resealed tightly using the built-in zip lock and store in a cool, dry place away from direct sunlight. Once opened, we recommend consuming within 14–20 days for peak crispness and chew.'
      }
    ]
  },
  {
    id: 'process',
    label: 'Dehydration Process',
    icon: RefreshCw,
    questions: [
      {
        q: 'How are Zestora fruits dehydrated?',
        a: 'We use gentle, controlled low-temperature hot-air dehydration. Unlike high-heat frying or chemical sulfur drying, low-temperature dehydration slowly removes water while locking in 92%+ of vitamins, dietary fiber, antioxidants, and original aromas.'
      },
      {
        q: 'Is this the same as freeze-dried fruit?',
        a: 'Freeze drying uses extreme cold sublimation which yields a brittle, styrofoam-like texture. Our low-temperature dehydration preserves the satisfying chewiness of fresh tropical fruits like Alphonso mango, while our chips retain a natural crisp snap.'
      }
    ]
  },
  {
    id: 'orders',
    label: 'Orders & Payments',
    icon: ShieldCheck,
    questions: [
      {
        q: 'How does the UPI QR code payment work?',
        a: 'During checkout, you are presented with our official Zestora UPI QR code (and UPI ID zestorasnacks@okaxis). Scan it using any UPI app (GPay, PhonePe, Paytm, BHIM, CRED), enter the exact total, and input the 12-digit UTR transaction reference number for instant confirmation.'
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes! We offer Cash on Delivery across most pin codes in India for orders up to ₹2,500. A standard delivery fee applies for orders below ₹499.'
      },
      {
        q: 'Do I need to create an account to browse and buy?',
        a: 'You can explore our entire pantry, read reviews, and add items to your bag without an account. An account is only required when completing your checkout so we can link your shipping address and enable order tracking.'
      }
    ]
  },
  {
    id: 'shipping',
    label: 'Shipping & Delivery',
    icon: Truck,
    questions: [
      {
        q: 'What are the delivery charges and thresholds?',
        a: 'We offer FREE Express Shipping on all orders above ₹499 across India. For orders under ₹499, a flat standard shipping fee of ₹49 is charged.'
      },
      {
        q: 'How long will it take for my order to arrive?',
        a: 'Orders placed before 2:00 PM IST are dispatched on the same business day. Delivery typically takes 2–3 business days for metro cities (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai) and 4–6 business days for the rest of India.'
      },
      {
        q: 'How can I track my parcel?',
        a: 'As soon as your parcel is dispatched, you will receive an SMS and email notification with your Delhivery or BlueDart tracking link. You can also view live milestone progress under My Account > My Orders.'
      }
    ]
  },
  {
    id: 'returns',
    label: 'Returns & Replacements',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is your return or replacement policy?',
        a: 'Because our products are edible snacks, we cannot accept returns of opened packs. However, if your order arrives damaged, unsealed, or incorrect, simply send a photo within 48 hours to zestorasnacks@gmail.com or WhatsApp +91 9880882476, and we will dispatch a free replacement or full refund immediately.'
      }
    ]
  }
];

export const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('products');
  const [openQuestionIndex, setOpenQuestionIndex] = useState(0);

  const currentCategoryData = FAQ_CATEGORIES.find(c => c.id === activeCategory) || FAQ_CATEGORIES[0];

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-20 text-[#193826]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#193826]">
            Pantry Knowledge & Help
          </h1>
          <p className="text-sm sm:text-base text-[#193826]/70 leading-relaxed">
            Everything you need to know about our low-temperature dehydration craft, natural ingredients, delivery timelines, and UPI payments.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E8DDCD]">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenQuestionIndex(0);
                }}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shrink-0 rounded-[2px] ${
                  isActive
                    ? 'bg-[#193826] text-[#FBF8F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#193826]/70 hover:text-[#193826] border border-[#E8DDCD]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3">
          {currentCategoryData.questions.map((item, idx) => {
            const isOpen = openQuestionIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenQuestionIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif text-lg sm:text-xl text-[#193826] font-medium leading-snug">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A869] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#193826]/80 leading-relaxed border-t border-[#E8DDCD]/50">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions? */}
        <div className="mt-14 p-8 bg-[#F5EFEB] border border-[#E8DDCD] text-center space-y-4 rounded-[2px]">
          <h3 className="font-serif text-2xl text-[#193826]">
            Still have questions about our fruits?
          </h3>
          <p className="text-xs sm:text-sm text-[#193826]/70 max-w-md mx-auto">
            Our team is always happy to talk about fruit sourcing, nutritional guidelines, and bespoke corporate gifting hampers.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:zestorasnacks@gmail.com"
              className="px-6 py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
            >
              Email Customer Care
            </a>
            <a
              href="https://wa.me/919880882476"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#FFFFFF] border border-[#E8DDCD] text-[#193826] text-xs uppercase tracking-wider font-semibold hover:bg-[#FAF7F2] transition-all rounded-[2px]"
            >
              WhatsApp Us (+91 9880882476)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
