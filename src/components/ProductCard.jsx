import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, Heart } from 'lucide-react';


export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart, isInWishlist, toggleWishlist } = useShop();

  const handleCardClick = () => {
    navigateTo('product-detail', product.slug);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.defaultWeight || product.weights?.[0]?.weight || '40g', 1, true);
  };

  const inWishlist = isInWishlist ? isInWishlist(product.id) : false;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist(product.id);
    }
  };

  const productImage = product.images?.thumbnail || product.images?.main || product.image || '/assets/products/dried-mango.png';

  return (
    <article
      id={`product-card-${product.slug || product.id}`}
      onClick={handleCardClick}
      className="group cursor-pointer bg-[#FFFFFF] border border-[#E8DDCD] hover:border-[#193826]/40 transition-all duration-300 flex flex-col overflow-hidden rounded-[2px]"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-[#F7F3EC] overflow-hidden">
        <img
          src={productImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Wishlist Heart Icon Button in Top-Right Corner */}
        <button
          id={`wishlist-btn-${product.slug || product.id}`}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#193826] shadow-xs backdrop-blur-xs flex items-center justify-center transition-all duration-200 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-[#193826]/70 hover:text-[#193826]'
            }`}
          />
        </button>
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
            <span className="text-[#193826]/60 text-[11px]">({product.reviewCount ?? 0})</span>
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
