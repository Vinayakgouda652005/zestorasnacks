import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    deliveryCharge,
    cartTotal,
    freeShippingThreshold,
    navigateTo
  } = useShop();

  const amountNeededForFree = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 py-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-medium">
            Your Bag is Empty
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
            No snacks yet.
          </h1>
          <p className="text-xs sm:text-sm text-[#193826]/70 leading-relaxed max-w-sm mx-auto">
            Explore our sun-ripened Alphonso mangoes, Queen pineapple rings, and pink guava crisps.
          </p>
          <div className="pt-4">
            <button
              id="empty-cart-go-shop-btn"
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all inline-flex items-center gap-2"
            >
              <span>Explore The Pantry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-[#E8DDCD] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-semibold">
              Order Review
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
              Your Shopping Bag
            </h1>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-wider text-[#193826]/70 hover:text-[#193826] flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="mb-8 p-4 bg-[#F5EFEB] border border-[#E8DDCD] text-xs">
          {amountNeededForFree > 0 ? (
            <div className="space-y-2 max-w-lg">
              <div className="flex justify-between items-center text-[#193826]">
                <span className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-[#C5A869]" />
                  Add ₹{amountNeededForFree} more for Free Express Delivery
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
              <span>You qualify for <strong>FREE Express Shipping</strong> across India!</span>
            </div>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cart Table List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="divide-y divide-[#E8DDCD] border-y border-[#E8DDCD]">
              {cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-page-item-${item.id}`}
                  className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Image & Title */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images.thumbnail}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-[#F5EFEB] border border-[#E8DDCD] shrink-0"
                    />
                    <div className="space-y-1">
                      <h3
                        onClick={() => navigateTo('product-detail', item.product.slug)}
                        className="font-serif text-lg sm:text-xl text-[#193826] hover:text-[#C5A869] cursor-pointer transition-colors"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#193826]/60">Weight: {item.selectedWeight}</p>
                      <p className="text-xs font-semibold text-[#193826]">
                        ₹{item.unitPrice} per pouch
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity controls & total */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8DDCD] bg-[#F5EFEB]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-[#193826]/70 hover:text-[#193826]"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#193826] min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-[#193826]/70 hover:text-[#193826]"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-serif text-lg font-bold text-[#193826]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-[#193826]/40 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                onClick={clearCart}
                className="text-[#193826]/50 hover:text-red-700 underline transition-colors"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="font-serif text-2xl text-[#193826] pb-4 border-b border-[#E8DDCD]">
                Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#193826]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#193826]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#255038] font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (Inclusive)</span>
                  <span className="text-[#193826]/60">₹0 extra</span>
                </div>

                <div className="pt-4 border-t border-[#E8DDCD] flex justify-between items-baseline text-base font-semibold text-[#193826]">
                  <span className="font-serif text-xl">Order Total</span>
                  <span className="font-serif text-2xl text-[#193826]">₹{cartTotal}</span>
                </div>
              </div>

              <button
                id="cart-page-checkout-btn"
                onClick={() => navigateTo('checkout')}
                className="w-full py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-[#193826]/60 space-y-2 border-t border-[#E8DDCD]/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
                  <span>Secure UPI QR Payment & Cash on Delivery</span>
                </div>
                <p>Packaged in tamper-proof, food-safe resealable zip bags.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
