import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart } from 'lucide-react';


export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart } = useShop();

  const handleCardClick = () => {
    navigateTo('product-detail', product.slug);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.defaultWeight, 1, true);
  };

  return (
    <article
      id={`product-card-${product.slug}`}
      onClick={handleCardClick}
      className="group cursor-pointer bg-[#FFFFFF] border border-[#E8DDCD] hover:border-[#193826]/40 transition-all duration-300 flex flex-col overflow-hidden rounded-[2px]"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-[#F7F3EC] overflow-hidden">
        <img
          src={product.images.thumbnail}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div className="space-y-1">
          {/* Product Name */}
          <h3 className="font-sans font-bold text-sm text-[#193826] group-hover:text-[#255038] transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-[#193826]/70 leading-normal">
            {product.tagline}
          </p>

          {/* Star rating & count */}
          <div className="flex items-center space-x-1 pt-1 text-xs">
            <div className="flex items-center text-[#E8A317]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#E8A317] text-[#E8A317]" />
              ))}
            </div>
            <span className="text-[#193826]/60 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="pt-2">
            <span className="font-bold text-base text-[#193826]">
              ₹{product.price}
            </span>
          </div>
        </div>

        {/* Full-width Add to Cart button matching reference screenshot */}
        <button
          id={`card-add-btn-${product.slug}`}
          type="button"
          onClick={handleQuickAdd}
          className="w-full mt-3 py-2 bg-[#193826] text-[#FBF8F2] text-xs font-semibold rounded-[2px] hover:bg-[#12291C] transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
};
