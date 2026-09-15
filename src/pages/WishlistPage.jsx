import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const WishlistPage = () => {
  const {
    wishlist,
    products,
    addToCart,
    navigateTo,
    showToast
  } = useShop();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex items-center justify-center p-6 text-[#193826]">
        <div className="max-w-md w-full text-center space-y-4 py-16">
          <div className="w-14 h-14 bg-[#193826]/10 rounded-full flex items-center justify-center mx-auto text-[#193826]">
            <Heart className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-medium">
            Your Wishlist is Empty
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
            No fruits saved yet.
          </h1>
          <p className="text-xs sm:text-sm text-[#193826]/70 leading-relaxed max-w-sm mx-auto">
            Browse our sun-dried Alphonso mangoes, Queen pineapple rings, and crispy pink guava slices.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all inline-flex items-center gap-2 rounded-[2px]"
            >
              <span>Explore Pantry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(prod => {
      addToCart(prod, prod.defaultWeight, 1, false);
    });
    showToast(`Added ${wishlistProducts.length} items to your shopping bag!`);
    navigateTo('cart');
  };

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-10 lg:py-16 text-[#193826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-8 mb-8 border-b border-[#E8DDCD] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-semibold">
              Curated Favorites
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
              Your Saved Wishlist ({wishlistProducts.length})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs uppercase tracking-wider text-[#193826]/70 hover:text-[#193826] flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all flex items-center gap-1.5 rounded-[2px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Bag</span>
            </button>
          </div>
        </div>

        {/* Wishlist Grid using standard Zestora ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </div>
  );
};
