import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Check, X, ChevronDown, ArrowRight, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export const WhyZestoraPage = () => {
  const { navigateTo } = useShop();

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Is there any added sugar or corn syrup in Zestora snacks?',
      a: 'None whatsoever. The sweetness you taste in our dried mango, pineapple, and bananas comes 100% from the fruit’s own naturally concentrated fructose and sucrose as water is gently removed.'
    },
    {
      q: 'Do you use sulfur dioxide or chemical preservatives to preserve color?',
      a: 'No. Many conventional brands treat dried fruits with sulfur dioxide gas (E220) to lock in an artificial neon hue. Zestora uses zero sulfites. Our fruit retains its natural, sun-cured golden tint without any synthetic additives.'
    },
    {
      q: 'Are the banana chips fried in oil?',
      a: 'No! Unlike traditional Kerala banana chips that are deep-fried in palm oil or coconut oil, Zestora banana chips are slow warm-air dehydrated. They have zero oil, zero cholesterol, and a crisp, light snap.'
    },
    {
      q: 'How long does a pouch stay fresh once opened?',
      a: 'Each pouch comes with a heavy-duty hermetic zip seal. Once opened, reseal the bag tightly and keep it in a cool, dry pantry. It will retain its crunch and texture for 30 to 45 days.'
    }
  ];

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-20 text-[#193826]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            The Clean Snacking Standard
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight">
            Why Zestora Stands Apart
          </h1>
          <p className="text-base sm:text-lg text-[#193826]/75 leading-relaxed">
            Understanding the difference between honest sun-drying and industrial fruit processing.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCD] shadow-sm mb-16 overflow-hidden">
          <div className="p-6 bg-[#F5EFEB] border-b border-[#E8DDCD]">
            <h2 className="font-serif text-2xl text-[#193826]">
              Honest Nutrition Matrix
            </h2>
            <p className="text-xs text-[#193826]/70">
              How Zestora compares to supermarket shelf alternatives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E8DDCD] bg-[#FBF8F2]">
                  <th className="p-4 font-semibold text-[#193826]/70 uppercase tracking-wider text-[11px]">Criteria</th>
                  <th className="p-4 font-bold text-[#193826] bg-[#E8DDCD]/40 uppercase tracking-wider text-[11px]">
                    ZESTORA
                  </th>
                  <th className="p-4 font-semibold text-[#193826]/60 uppercase tracking-wider text-[11px]">
                    Commercial Candied Fruits
                  </th>
                  <th className="p-4 font-semibold text-[#193826]/60 uppercase tracking-wider text-[11px]">
                    Deep-Fried Fruit Chips
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDCD]/70">
                <tr>
                  <td className="p-4 font-medium text-[#193826]">Ingredients</td>
                  <td className="p-4 bg-[#E8DDCD]/20 font-semibold text-[#255038] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#255038] shrink-0" />
                    100% Pure Fruit
                  </td>
                  <td className="p-4 text-[#193826]/70">Fruit + Sugar syrup + Citric acid</td>
                  <td className="p-4 text-[#193826]/70">Fruit + Palm oil + Salt</td>
                </tr>

                <tr>
                  <td className="p-4 font-medium text-[#193826]">Drying Method</td>
                  <td className="p-4 bg-[#E8DDCD]/20 font-semibold text-[#255038]">
                    Low-Temp Warm Air (Nutrient Safe)
                  </td>
                  <td className="p-4 text-[#193826]/70">High-heat baking</td>
                  <td className="p-4 text-[#193826]/70">Submerged deep frying</td>
                </tr>

                <tr>
                  <td className="p-4 font-medium text-[#193826]">Chemical Preservatives</td>
                  <td className="p-4 bg-[#E8DDCD]/20 font-semibold text-[#255038] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#255038] shrink-0" />
                    Zero (No Sulfites)
                  </td>
                  <td className="p-4 text-red-800/80 flex items-center gap-1">
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                    Sulfur dioxide (E220)
                  </td>
                  <td className="p-4 text-[#193826]/70">Antioxidants / TBHQ</td>
                </tr>

                <tr>
                  <td className="p-4 font-medium text-[#193826]">Added Cane Sugar</td>
                  <td className="p-4 bg-[#E8DDCD]/20 font-semibold text-[#255038]">
                    0 grams
                  </td>
                  <td className="p-4 text-[#193826]/70">30g to 55g per 100g</td>
                  <td className="p-4 text-[#193826]/70">5g to 15g per 100g</td>
                </tr>

                <tr>
                  <td className="p-4 font-medium text-[#193826]">Texture & Feel</td>
                  <td className="p-4 bg-[#E8DDCD]/20 font-semibold text-[#255038]">
                    Naturally Chewy / Crisp Snap
                  </td>
                  <td className="p-4 text-[#193826]/70">Sticky gummy candy feel</td>
                  <td className="p-4 text-[#193826]/70">Greasy oily mouthfeel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Pillars of Nutrition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 space-y-3">
            <HeartPulse className="w-6 h-6 text-[#C5A869]" />
            <h3 className="font-serif text-2xl text-[#193826]">Intact Dietary Fiber</h3>
            <p className="text-xs text-[#193826]/70 leading-relaxed">
              Because we don't press juice or discard the fruit flesh, every slice provides natural insoluble and soluble prebiotic fiber that promotes digestive wellness.
            </p>
          </div>

          <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 space-y-3">
            <Sparkles className="w-6 h-6 text-[#C5A869]" />
            <h3 className="font-serif text-2xl text-[#193826]">Sustained Energy</h3>
            <p className="text-xs text-[#193826]/70 leading-relaxed">
              Natural fruit sugars bound in complex plant matrices digest gradually, avoiding the sharp insulin spikes associated with processed candy bars or pastries.
            </p>
          </div>

          <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#C5A869]" />
            <h3 className="font-serif text-2xl text-[#193826]">Honest Traceability</h3>
            <p className="text-xs text-[#193826]/70 leading-relaxed">
              We know our farm partners by name and inspect each seasonal crop for soil health, ripeness, and natural sweetness before dehydration begins.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-16">
          <div className="space-y-1 pb-4 border-b border-[#E8DDCD]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-semibold">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl text-[#193826]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E8DDCD] border-b border-[#E8DDCD]">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-serif text-lg text-[#193826] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#193826]/60 transition-transform shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="pt-3 text-xs sm:text-sm text-[#193826]/75 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-[#12291C] text-[#FBF8F2] text-center space-y-4">
          <h3 className="font-serif text-3xl text-[#FBF8F2]">Experience Real Dehydrated Fruit</h3>
          <p className="text-xs sm:text-sm text-[#FBF8F2]/70 max-w-md mx-auto">
            Order your first harvest box today. Free express shipping on orders over ₹499.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-[#C5A869] text-[#12291C] text-xs uppercase tracking-widest font-bold hover:bg-[#D4B87A] transition-all inline-flex items-center gap-2"
            >
              <span>Explore The Pantry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
