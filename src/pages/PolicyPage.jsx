import React, { useState, useEffect } from 'react';
import { Shield, FileText, Truck, RefreshCw } from 'lucide-react';

const POLICIES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How Zestora protects and manages your personal information',
    icon: Shield,
    lastUpdated: '10 September 2024',
    sections: [
      {
        heading: '1. Information We Collect',
        content: 'When you place an order or register on Zestora, we collect details including your name, shipping address, email address, contact phone number, and UPI payment transaction reference numbers. We do not store your raw banking passwords or UPI MPIN.'
      },
      {
        heading: '2. How We Use Your Information',
        content: 'Your information is utilized solely to process and dispatch fruit orders, update you regarding delivery waybills via SMS/email, verify UPI payment transactions, and provide customer support. We never sell, rent, or lease your personal contact details to third-party advertisers.'
      },
      {
        heading: '3. Data Storage & Security',
        content: 'We adhere to stringent digital security standards to prevent unauthorized access or disclosure of personal data. Information is retained only as long as necessary to fulfill statutory tax, billing, and order logistics obligations.'
      },
      {
        heading: '4. Contact for Privacy Inquiries',
        content: 'For any queries regarding your saved data or to request account deletion, please contact our data officer at zestorasnacks@gmail.com.'
      }
    ]
  },
  'terms': {
    title: 'Terms & Conditions',
    subtitle: 'Standard agreements for purchasing from Zestora',
    icon: FileText,
    lastUpdated: '10 September 2024',
    sections: [
      {
        heading: '1. Product Nature & Representation',
        content: 'Zestora supplies 100% natural, dehydrated fruit slices and crisps. Because our fruits are completely free from artificial colorants, minor seasonal variations in natural fruit hue, sweetness, and thickness may occur across agricultural batches.'
      },
      {
        heading: '2. Pricing & Payments',
        content: 'All product prices listed on Zestora are inclusive of applicable GST taxes. Orders placed via UPI QR require entry of the valid 12-digit UTR number for verification. Cash on Delivery is subject to regional pincode serviceability.'
      },
      {
        heading: '3. Order Acceptance & Cancellations',
        content: 'Orders may be cancelled prior to warehouse dispatch by contacting customer care. Once an order is handed over to Delhivery or BlueDart express logistics, cancellation is no longer possible.'
      },
      {
        heading: '4. Governing Law & Jurisdiction',
        content: 'These terms and conditions are governed by the laws of India, with jurisdiction in the courts of Bengaluru, Karnataka.'
      }
    ]
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    subtitle: 'Timelines, express partners, and regional coverage across India',
    icon: Truck,
    lastUpdated: '10 September 2024',
    sections: [
      {
        heading: '1. Dispatch Timelines',
        content: 'Orders placed on weekdays before 2:00 PM IST are processed and dispatched on the same business day. Orders placed on Sunday or national holidays will be dispatched on the next working morning.'
      },
      {
        heading: '2. Express Delivery Duration',
        content: 'Metro cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata): 2 to 4 business days. Non-metro & tier 2/3 locations: 4 to 6 business days. Remote locations: Up to 7 business days.'
      },
      {
        heading: '3. Shipping Rates & Free Delivery',
        content: 'We provide FREE Express Shipping on all orders of ₹499 and above. For orders below ₹499, a flat standard logistics fee of ₹49 is added at checkout.'
      },
      {
        heading: '4. Tracking & Delivery Notifications',
        content: 'Once your parcel is handed to our courier partner (Delhivery / BlueDart), you will receive automated tracking waybills and milestone SMS updates.'
      }
    ]
  },
  'returns-policy': {
    title: 'Returns & Refund Policy',
    subtitle: 'Our 100% freshness guarantee and resolution procedure',
    icon: RefreshCw,
    lastUpdated: '10 September 2024',
    sections: [
      {
        heading: '1. Perishable Food Safety Guideline',
        content: 'Because Zestora products are food items crafted with zero preservatives, opened pouches cannot be accepted for return due to hygiene and food safety regulations.'
      },
      {
        heading: '2. Damaged, Defective, or Incorrect Deliveries',
        content: 'If your parcel arrives with damaged packaging, broken seals, or missing items, please report it within 48 hours of delivery by sharing photos on WhatsApp (+91 9880882476) or email (zestorasnacks@gmail.com).'
      },
      {
        heading: '3. Replacement & Refund Execution',
        content: 'Upon verification of the issue, we will immediately initiate either a replacement parcel dispatch with priority express shipping at zero extra cost, or a full refund directly to your original UPI payment account within 3-5 business days.'
      },
      {
        heading: '4. Non-Delivery Due to Incorrect Address',
        content: 'Please ensure full address details and 10-digit phone numbers are entered correctly. Parcels returned to origin due to repeated customer unavailability or incorrect address may incur re-dispatch fees.'
      }
    ]
  }
};

export const PolicyPage = ({ initialSlug = 'privacy-policy' }) => {
  const [activePolicy, setActivePolicy] = useState(initialSlug);

  useEffect(() => {
    if (initialSlug && POLICIES[initialSlug]) {
      setActivePolicy(initialSlug);
    }
  }, [initialSlug]);

  const current = POLICIES[activePolicy] || POLICIES['privacy-policy'];
  const Icon = current.icon;

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-20 text-[#193826]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Policy Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E8DDCD]">
          {Object.keys(POLICIES).map((key) => {
            const p = POLICIES[key];
            const PIcon = p.icon;
            const isActive = activePolicy === key;
            return (
              <button
                key={key}
                onClick={() => setActivePolicy(key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shrink-0 rounded-[2px] ${
                  isActive
                    ? 'bg-[#193826] text-[#FBF8F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#193826]/70 hover:text-[#193826] border border-[#E8DDCD]'
                }`}
              >
                <PIcon className="w-3.5 h-3.5" />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Article Container */}
        <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-10 rounded-[2px] space-y-8">
          <div className="border-b border-[#E8DDCD] pb-6 space-y-2">
            <div className="flex items-center gap-2 text-[#C5A869]">
              <Icon className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Official Policy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
              {current.title}
            </h1>
            <p className="text-sm text-[#193826]/70 leading-relaxed">
              {current.subtitle}
            </p>
            <span className="text-[11px] text-[#193826]/50 block pt-1">
              Last Updated: {current.lastUpdated}
            </span>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6 text-xs sm:text-sm text-[#193826]/80 leading-relaxed">
            {current.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="font-serif text-lg sm:text-xl text-[#193826] font-semibold">
                  {sec.heading}
                </h2>
                <p>{sec.content}</p>
              </div>
            ))}
          </div>

          {/* Support Strip */}
          <div className="pt-6 border-t border-[#E8DDCD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#193826]/70">
            <span>Questions regarding this document?</span>
            <a
              href="mailto:zestorasnacks@gmail.com"
              className="font-semibold text-[#193826] underline hover:text-[#C5A869]"
            >
              zestorasnacks@gmail.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
