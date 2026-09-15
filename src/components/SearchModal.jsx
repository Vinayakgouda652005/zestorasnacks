import React, { useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, products, navigateTo } = useShop();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const queryClean = searchQuery.trim().toLowerCase();
  const filteredProducts = queryClean
    ? products
        .filter((p) => p.isActive !== false)
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(queryClean) ||
            p.tagline?.toLowerCase().includes(queryClean) ||
            p.description?.toLowerCase().includes(queryClean) ||
            (Array.isArray(p.tastingNotes) && p.tastingNotes.some((t) => t.toLowerCase().includes(queryClean)))
        )
    : [];

  const popularSearches = ['Mango', 'Pineapple', 'Guava', 'Banana', 'Bundles'];

  const handleSelectProduct = (slug) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigateTo('product-detail', slug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FBF8F2] border border-[#E8DDCD] w-full max-w-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-[#E8DDCD] bg-[#F5EFEB]">
          <Search className="w-5 h-5 text-[#193826]/60 mr-3 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search mango, pineapple, guava, banana..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#193826] text-base placeholder-[#193826]/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#193826]/40 hover:text-[#193826] mr-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="close-search-modal"
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#193826]/60 hover:text-[#193826] text-xs uppercase tracking-wider font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-3 bg-[#FBF8F2] border-b border-[#E8DDCD]/60 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[#193826]/50 whitespace-nowrap">Suggested:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-2.5 py-1 bg-[#F5EFEB] hover:bg-[#E8DDCD] text-[#193826] transition-colors border border-[#E8DDCD] whitespace-nowrap"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-6 space-y-4">
          {queryClean === '' ? (
            <div className="text-center py-8 text-[#193826]/60 space-y-2">
              <p className="text-sm font-medium">Type a fruit name or snack type to search.</p>
              <p className="text-xs text-[#193826]/40">Try searching for "Alphonso", "Crispy", or "Queen Pineapple".</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#193826]/60 font-medium">
                Matching Snacks ({filteredProducts.length})
              </p>
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  id={`search-result-${prod.slug}`}
                  onClick={() => handleSelectProduct(prod.slug)}
                  className="group flex items-center justify-between p-3.5 bg-[#F5EFEB]/50 hover:bg-[#F5EFEB] border border-[#E8DDCD]/80 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={prod.images?.thumbnail || prod.images?.main || prod.image || '/assets/products/dried-mango.png'}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover border border-[#E8DDCD]"
                    />
                    <div>
                      <h4 className="font-serif text-lg text-[#193826] group-hover:text-[#C5A869] transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-[#193826]/60">{prod.tagline}</p>
                      <span className="text-xs font-semibold text-[#193826] mt-0.5 inline-block">
                        ₹{prod.price}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#193826]/40 group-hover:text-[#193826] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#193826]/70 space-y-2">
              <p className="font-serif text-2xl text-[#193826]">No products found.</p>
              <p className="text-xs text-[#193826]/60">
                We couldn't find any dehydrated fruit matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('Mango')}
                className="mt-3 text-xs uppercase tracking-widest text-[#C5A869] font-semibold underline hover:text-[#193826]"
              >
                Browse Dried Mango Instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
