import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const ShopPage = () => {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  const categories = [
    { label: 'All Fruits', value: 'all' },
    { label: 'Single Fruit Slices', value: 'single' },
    { label: 'Crispy Chips', value: 'chips' },
    { label: 'Tasting Gift Boxes', value: 'bundle' },
  ];

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            Pure Sunshine in Every Pouch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#193826]">
            The Zestora Pantry
          </h1>
          <p className="text-sm sm:text-base text-[#193826]/70 leading-relaxed max-w-xl mx-auto">
            100% naturally dehydrated fruits. No palm oil, no preservatives, and zero artificial flavors. Crafted for clean, restorative snacking.
          </p>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                id={`filter-${cat.value}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-xs uppercase tracking-wider px-3.5 py-2 transition-all whitespace-nowrap font-medium ${
                  selectedCategory === cat.value
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'bg-[#FBF8F2] text-[#193826]/75 hover:text-[#193826] border border-[#E8DDCD]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-xs text-[#193826]/60">
              Showing <strong>{sortedProducts.length}</strong> items
            </span>

            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#193826]/60" />
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FBF8F2] border border-[#E8DDCD] text-xs px-2.5 py-1.5 text-[#193826] focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Trust Note Strip */}
        <div className="mt-16 p-8 bg-[#F5EFEB] border border-[#E8DDCD] flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C5A869] shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-[#193826]">Dispatched Within 24h</p>
              <p className="text-[#193826]/60">Express logistics to your doorstep</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#E8DDCD] hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="text-lg font-serif font-bold text-[#193826]">₹499+</span>
            <div className="text-xs">
              <p className="font-semibold text-[#193826]">Free Express Shipping</p>
              <p className="text-[#193826]/60">All India standard & express delivery</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#E8DDCD] hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="text-lg font-serif font-bold text-[#193826]">100%</span>
            <div className="text-xs">
              <p className="font-semibold text-[#193826]">Authentic Fruit Guarantee</p>
              <p className="text-[#193826]/60">Zero artificial colors or preservatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
