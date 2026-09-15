import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    deliveryCharge,
    cartTotal,
    freeShippingThreshold,
    navigateTo
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const amountNeededForFree = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  const handleViewCartClick = () => {
    setIsCartDrawerOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#FBF8F2] h-full shadow-2xl z-10 flex flex-col border-l border-[#E8DDCD]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DDCD] flex items-center justify-between bg-[#F5EFEB]">
          <div>
            <h3 className="font-serif text-2xl text-[#193826]">Your Bag</h3>
            <p className="text-xs text-[#193826]/60">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          <button
            id="close-cart-drawer"
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-[#193826]/60 hover:text-[#193826] transition-colors"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Milestone Indicator */}
        <div className="bg-[#EFE8DE] px-5 py-3 border-b border-[#E8DDCD] text-xs">
          {amountNeededForFree > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[#193826]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#C5A869]" />
                  Add <strong className="text-[#193826]">₹{amountNeededForFree}</strong> more for Free Shipping
                </span>
                <span className="text-[11px] text-[#193826]/60">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-[#D8CABB] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#193826] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#193826] font-medium">
              <Truck className="w-4 h-4 text-[#255038]" />
              <span>You've unlocked <strong>FREE Express Shipping</strong>!</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#193826]/60 space-y-3">
              <p className="font-serif text-2xl text-[#193826]">Your bag is empty</p>
              <p className="text-xs max-w-xs text-[#193826]/70">
                Discover our sun-ripened Alphonso mangoes, Queen pineapple rings, and pink guava crisps.
              </p>
              <button
                id="empty-cart-shop-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="mt-4 px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-colors"
              >
                Shop Dehydrated Fruits
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex items-start gap-4 pb-4 border-b border-[#E8DDCD]/80"
              >
                <img
                  src={item.product?.images?.thumbnail || item.product?.images?.main || item.product?.image || '/assets/products/dried-mango.png'}
                  alt={item.product?.name || 'Product'}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover bg-[#F5EFEB] border border-[#E8DDCD] shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-serif text-base text-[#193826] font-medium leading-tight truncate">
                      {item.product.name}
                    </h4>
                    <button
                      id={`remove-item-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-[#193826]/40 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#193826]/60">{item.selectedWeight}</p>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8DDCD] bg-[#F5EFEB]">
                      <button
                        id={`qty-minus-${item.id}`}
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 text-[#193826]/70 hover:text-[#193826] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#193826] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        id={`qty-plus-${item.id}`}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 text-[#193826]/70 hover:text-[#193826] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif text-sm font-semibold text-[#193826]">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#F5EFEB] border-t border-[#E8DDCD] space-y-3">
            <div className="space-y-1.5 text-xs text-[#193826]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#193826]">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="text-[#255038] font-semibold">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8DDCD] text-base font-semibold text-[#193826]">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl">₹{cartTotal}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                id="drawer-checkout-btn"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="drawer-view-bag-btn"
                onClick={handleViewCartClick}
                className="w-full py-2.5 bg-transparent border border-[#193826]/30 text-[#193826] text-xs uppercase tracking-widest font-medium hover:bg-[#E8DDCD]/40 transition-colors text-center"
              >
                View Full Bag & Summary
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#193826]/60 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
              <span>Direct UPI & COD Available at Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
