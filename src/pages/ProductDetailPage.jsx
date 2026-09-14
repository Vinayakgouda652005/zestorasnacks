import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewModal } from '../components/ReviewModal';
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Leaf,
  FlaskConical,
  ShieldBan,
  Heart
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { selectedProduct, products, addToCart, navigateTo, getProductReviews } = useShop();

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl text-[#193826]">Product Not Found</h2>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 bg-[#193826] text-[#FAF7F2] text-xs font-semibold rounded-[2px]"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const galleryImages = selectedProduct.images.gallery || [selectedProduct.images.main];
  const currentImage = galleryImages[selectedImageIndex] || selectedProduct.images.main;

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Accordion state (+ / −)
  const [openAccordions, setOpenAccordions] = useState({
    ingredients: false,
    nutrition: false,
    shipping: false
  });

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Reviews for this specific product
  const productReviews = getProductReviews(selectedProduct.id);

  // Carousel controls for gallery thumbnails
  const prevThumb = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };
  const nextThumb = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  // Toggle accordion
  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add to Bag handler
  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedProduct.defaultWeight, quantity, true);
  };

  // "You Might Also Like" products (exactly 3 items excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-6 sm:py-8 text-[#193826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb: Home > Shop > Dried Mango */}
        <nav className="flex items-center space-x-2 text-xs text-[#193826]/70 mb-6 font-sans">
          <button onClick={() => navigateTo('home')} className="hover:text-[#193826] transition-colors">
            Home
          </button>
          <span className="text-[#193826]/40">&gt;</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-[#193826] transition-colors">
            Shop
          </button>
          <span className="text-[#193826]/40">&gt;</span>
          <span className="text-[#193826] font-semibold">{selectedProduct.name}</span>
        </nav>

        {/* ==================================================
            MAIN PRODUCT DETAIL TWO-COLUMN LAYOUT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-14 border-b border-[#E8DDCD]">
          
          {/* LEFT COLUMN: Large product image + Horizontal thumbnail gallery with prev/next */}
          <div className="lg:col-span-6 space-y-4">
            {/* Prominent Large Product Image */}
            <div className="w-full aspect-[4/3.8] bg-[#F7F3EC] border border-[#E8DDCD] overflow-hidden rounded-[2px] flex items-center justify-center shadow-xs">
              <img
                src={currentImage}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>

            {/* Horizontal thumbnail gallery with previous / next controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={prevThumb}
                className="w-8 h-8 rounded-full border border-[#E8DDCD] bg-white flex items-center justify-center text-[#193826] hover:bg-[#F5EFEB] transition-colors shrink-0 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {galleryImages.map((img, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-[2px] overflow-hidden border-2 transition-all shrink-0 bg-[#F7F3EC] cursor-pointer ${
                        isSelected ? 'border-[#193826]' : 'border-[#E8DDCD] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${selectedProduct.name} thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={nextThumb}
                className="w-8 h-8 rounded-full border border-[#E8DDCD] bg-white flex items-center justify-center text-[#193826] hover:bg-[#F5EFEB] transition-colors shrink-0 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Information, Purchase Controls, Compact Benefits, Description, Accordions */}
          <div className="lg:col-span-6 flex flex-col justify-start space-y-5">
            
            {/* Dried Mango & Tagline */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-[#193826] leading-tight font-normal">
                {selectedProduct.name}
              </h1>
              <p className="text-sm sm:text-base text-[#193826]/75 mt-1 font-sans">
                {selectedProduct.tagline}
              </p>
            </div>

            {/* Star rating & review count */}
            <div className="flex items-center space-x-1.5 text-xs text-[#193826]">
              <div className="flex items-center text-[#E8A317]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E8A317] text-[#E8A317]" />
                ))}
              </div>
              <span className="text-[#193826]/70 text-xs">
                ({selectedProduct.reviewCount} reviews)
              </span>
            </div>

            {/* Price & Weight: ₹199 (40g) */}
            <div className="space-y-0.5 pt-1">
              <div className="font-sans font-bold text-3xl sm:text-4xl text-[#193826]">
                ₹{selectedProduct.price}
              </div>
              <div className="text-xs font-medium text-[#193826]/70">
                {selectedProduct.defaultWeight}
              </div>
            </div>

            {/* Quantity selector: − 1 + & Dark green Add to Cart button */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[#E8DDCD] bg-white h-11 rounded-[2px]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 h-full text-[#193826] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-[#193826] min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 h-full text-[#193826] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                id="pdp-add-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-11 bg-[#193826] text-[#FFFFFF] text-xs sm:text-sm font-semibold hover:bg-[#12291C] transition-colors rounded-[2px] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* PRODUCT BENEFITS: Four compact benefit items with simple thin outline icons */}
            <div className="grid grid-cols-4 gap-2 py-4 border-y border-[#E8DDCD]/80 text-center">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-9 h-9 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                  <Leaf className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#193826] leading-tight">
                  100% Natural
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-9 h-9 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                  <FlaskConical className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#193826] leading-tight">
                  No Artificial Colors
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-9 h-9 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                  <ShieldBan className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#193826] leading-tight">
                  No Added Preservatives
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-9 h-9 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                  <Heart className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#193826] leading-tight">
                  Wholesome Snacking
                </span>
              </div>
            </div>

            {/* DESCRIPTION: Short product description below benefits */}
            <p className="text-xs sm:text-sm text-[#193826]/80 leading-relaxed font-sans">
              {selectedProduct.description}
            </p>

            {/* ACCORDION ROWS: Ingredients, Nutritional Information, Shipping & Returns */}
            <div className="divide-y divide-[#E8DDCD] border-y border-[#E8DDCD]">
              {/* 1. Ingredients */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="font-sans font-medium text-sm text-[#193826] group-hover:text-[#255038] transition-colors">
                    Ingredients
                  </span>
                  <span className="text-base font-medium text-[#193826]">
                    {openAccordions.ingredients ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.ingredients && (
                  <div className="pt-2 text-xs text-[#193826]/80 leading-relaxed">
                    <p>{selectedProduct.ingredients}</p>
                  </div>
                )}
              </div>

              {/* 2. Nutritional Information */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('nutrition')}
                  className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="font-sans font-medium text-sm text-[#193826] group-hover:text-[#255038] transition-colors">
                    Nutritional Information
                  </span>
                  <span className="text-base font-medium text-[#193826]">
                    {openAccordions.nutrition ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.nutrition && (
                  <div className="pt-2 text-xs text-[#193826]/80 space-y-1.5 bg-white p-3.5 border border-[#E8DDCD] mt-2">
                    <div className="flex justify-between py-1 border-b border-[#E8DDCD]/60">
                      <span className="text-[#193826]/70">Serving Size</span>
                      <strong className="font-semibold text-[#193826]">{selectedProduct.nutritionInfo.servingSize}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DDCD]/60">
                      <span className="text-[#193826]/70">Calories</span>
                      <strong className="font-semibold text-[#193826]">{selectedProduct.nutritionInfo.calories}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DDCD]/60">
                      <span className="text-[#193826]/70">Carbohydrates</span>
                      <strong className="font-semibold text-[#193826]">{selectedProduct.nutritionInfo.carbohydrates}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DDCD]/60">
                      <span className="text-[#193826]/70">Dietary Fiber</span>
                      <strong className="font-semibold text-[#193826]">{selectedProduct.nutritionInfo.dietaryFiber}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#193826]/70">Natural Sugars</span>
                      <strong className="font-semibold text-[#193826]">{selectedProduct.nutritionInfo.naturalSugars}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Returns */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="font-sans font-medium text-sm text-[#193826] group-hover:text-[#255038] transition-colors">
                    Shipping & Returns
                  </span>
                  <span className="text-base font-medium text-[#193826]">
                    {openAccordions.shipping ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.shipping && (
                  <div className="pt-2 text-xs text-[#193826]/80 leading-relaxed space-y-1">
                    <p>{selectedProduct.shipping}</p>
                    <p className="text-[#193826]/60">Returns accepted within 7 days of delivery for unopened pouches in original condition.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================
            PRODUCT IMAGE STORY SECTION
            Immediately below the main product section: LARGE full-width image section.
            Left side:
            Real Mangoes.
            Real Goodness.
            Text:
            "No shortcuts. No artificial flavours. Just pure, naturally dried mangoes packed with care."
            Right side:
            Large premium dried mango photography.
            ================================================== */}
        <section className="py-14 sm:py-16 border-b border-[#E8DDCD]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#193826] leading-tight">
                {selectedProduct.slug === 'dried-banana'
                  ? 'Real Bananas.'
                  : selectedProduct.slug === 'dried-pineapple'
                  ? 'Real Pineapples.'
                  : selectedProduct.slug === 'dried-guava'
                  ? 'Real Guavas.'
                  : 'Real Mangoes.'}<br />
                Real Goodness.
              </h2>
              <p className="text-sm sm:text-base text-[#193826]/80 leading-relaxed font-sans max-w-md">
                {selectedProduct.slug === 'dried-mango'
                  ? 'No shortcuts. No artificial flavours. Just pure, naturally dried mangoes packed with care.'
                  : `No shortcuts. No artificial flavours. Just pure, naturally dried ${selectedProduct.name.toLowerCase().replace('chips', '').trim()} packed with care.`}
              </p>
            </div>

            {/* Right side large premium photography */}
            <div className="lg:col-span-7">
              <div className="w-full h-72 sm:h-84 lg:h-96 bg-[#F7F3EC] border border-[#E8DDCD] overflow-hidden rounded-[2px] shadow-xs">
                <img
                  src={
                    selectedProduct.slug === 'dried-mango'
                      ? 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=1200&q=80'
                      : selectedProduct.slug === 'dried-pineapple'
                      ? 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1200&q=80'
                      : selectedProduct.slug === 'dried-guava'
                      ? 'https://images.unsplash.com/photo-1536511135899-73d83d168509?auto=format&fit=crop&w=1200&q=80'
                      : 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={`${selectedProduct.name} Goodness`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================
            YOU MIGHT ALSO LIKE
            Below the story section:
            You Might Also Like
            View All Products →
            Show exactly THREE product cards:
            Dried Pineapple - ₹199
            Dried Guava - ₹199
            Dried Banana Chips - ₹149
            ================================================== */}
        <section className="py-14 border-b border-[#E8DDCD]">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E8DDCD]/80">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#193826]">
              You Might Also Like
            </h2>

            <button
              id="pdp-view-all-btn"
              onClick={() => navigateTo('shop')}
              className="text-xs font-semibold text-[#193826] hover:text-[#255038] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Products</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* ==================================================
            LOVED BY MANY (Product Reviews Section)
            Mandated: Strictly appears ONLY on Product Detail Page!
            Heading: Loved by Many
            Subtitle: Real stories. Real smiles.
            Right side: Write a Review button
            Below: Three review cards belonging to the current product
            ================================================== */}
        <section className="py-14 sm:py-16" id="loved-by-many-reviews">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E8DDCD]/80 gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#193826]">
                Loved by Many
              </h2>
              <p className="text-xs sm:text-sm text-[#193826]/70 mt-1">
                Real stories. Real smiles.
              </p>
            </div>

            <button
              id="write-review-btn"
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 bg-transparent border border-[#193826] text-[#193826] text-xs font-semibold hover:bg-[#193826] hover:text-white transition-colors rounded-[2px] cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          {/* Three Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {productReviews.slice(0, 3).map((rev) => {
              const initial = rev.customerName.charAt(0).toUpperCase();
              return (
                <div
                  key={rev.id}
                  className="bg-white border border-[#E8DDCD] p-5 sm:p-6 flex flex-col justify-between space-y-4 rounded-[2px] shadow-2xs"
                >
                  <div className="space-y-3">
                    {/* Customer initials/avatar, Name, Date */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#EAE2D5] text-[#193826] font-bold text-xs flex items-center justify-center shrink-0">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-[#193826]">
                          {rev.customerName}
                        </h4>
                        <span className="text-[10px] text-[#193826]/50">
                          {rev.reviewDate}
                        </span>
                      </div>
                    </div>

                    {/* Star rating */}
                    <div className="flex items-center text-[#E8A317]">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating ? 'fill-[#E8A317] text-[#E8A317]' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-[#193826]/80 leading-relaxed italic">
                      "{rev.reviewText}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Review Write Modal */}
      <ReviewModal
        product={selectedProduct}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
