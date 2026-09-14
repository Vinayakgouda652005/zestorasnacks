import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Leaf, Sun, ShieldCheck } from 'lucide-react';

export const StoryPage = () => {
  const { navigateTo } = useShop();

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-20 text-[#193826]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            Our Origins & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight">
            Reclaiming the Honest Taste of Ripe Fruit
          </h1>
          <p className="text-base sm:text-lg text-[#193826]/75 font-normal leading-relaxed">
            Born from a simple realization: you shouldn't have to choose between convenience and real, unadulterated nourishment.
          </p>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative aspect-[16/9] overflow-hidden border border-[#E8DDCD] mb-16 bg-[#F5EFEB]">
          <img
            src="https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=1600&q=85"
            alt="Orchard harvest in the morning sun"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Narrative Article Sections */}
        <div className="space-y-14 text-[#193826]/80 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
          
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#193826]">
              The Problem with Modern Dried Fruit
            </h2>
            <p>
              Walk down any conventional grocery aisle, flip over a package of dried mango or pineapple, and you will almost certainly find high-fructose corn syrup, artificial yellow food dyes, and sulfur dioxide added as a bleaching preservative.
            </p>
            <p>
              What should have been nature's purest confectionery is turned into rubbery candy soaked in liquid sugar. We started <strong>ZESTORA</strong> because we believed in a better way: honoring the natural harvest without altering or masking its brilliance.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-[#E8DDCD]">
            <div className="space-y-2">
              <Sun className="w-6 h-6 text-[#C5A869]" />
              <h3 className="font-serif text-xl text-[#193826]">Low-Temperature Warm Air</h3>
              <p className="text-xs text-[#193826]/70 leading-relaxed">
                We remove water through slow, controlled air circulation, maintaining active nutrients, natural aroma, and fibers.
              </p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#C5A869]" />
              <h3 className="font-serif text-xl text-[#193826]">Zero Artificial Additives</h3>
              <p className="text-xs text-[#193826]/70 leading-relaxed">
                No sulfur dioxide, no added refined sugar, no palm oil. If it didn't grow on the branch, it doesn't go in our pouch.
              </p>
            </div>
            <div className="space-y-2">
              <Leaf className="w-6 h-6 text-[#C5A869]" />
              <h3 className="font-serif text-xl text-[#193826]">Harvest Waste Reduction</h3>
              <p className="text-xs text-[#193826]/70 leading-relaxed">
                By dehydrating fresh seasonal gluts directly in growing belts, we rescue tonnes of peak-ripe fruit from post-harvest spoilage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#193826]">
              From Heritage Orchards to Your Desk
            </h2>
            <p>
              Our Alphonso mangoes are sourced from coastal groves in Ratnagiri; our Queen pineapples come from the nutrient-rich red soil of the Northeast; our pink guavas are handpicked from Karnataka orchards, and our Nendran bananas hail from Kerala farms.
            </p>
            <p>
              Every bite is crafted to accompany your busy daily rhythm — whether tucked into a backpack for a morning mountain hike, kept in your work drawer for a 4 PM slump, or shared across the family table as an evening treat.
            </p>
          </div>

          {/* CTA Box */}
          <div className="mt-16 p-8 bg-[#F5EFEB] border border-[#E8DDCD] text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C5A869] font-semibold">
              Taste the Difference
            </span>
            <h3 className="font-serif text-3xl text-[#193826]">
              Ready to explore our harvest?
            </h3>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="px-8 py-3.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all inline-flex items-center gap-2"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
