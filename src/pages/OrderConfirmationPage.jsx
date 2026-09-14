import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, Truck, Package, Printer, ArrowRight, Clock } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { latestOrder, navigateTo } = useShop();

  if (!latestOrder) {
    return (
      <div className="min-h-[60vh] bg-[#FBF8F2] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="font-serif text-3xl text-[#193826]">No Active Order Found</h2>
          <p className="text-xs text-[#193826]/70">Explore our delicious snack selection to place an order.</p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold"
          >
            Explore Snacks
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Card */}
        <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-8 sm:p-10 text-center space-y-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#193826] text-[#FBF8F2] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8 text-[#C5A869]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
              Thank You for Snacking Natural
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
              Order Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-[#193826]/75">
              Order reference: <strong className="text-[#193826] font-mono">{latestOrder.id}</strong> • Placed on {latestOrder.date}
            </p>
          </div>

          <p className="text-xs text-[#193826]/70 max-w-md mx-auto leading-relaxed">
            We've sent a detailed confirmation receipt to <strong>{latestOrder.customer.email}</strong>. Our packing crew is carefully assembling your dehydrated fruit pouch collection.
          </p>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#193826]/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#255038]" />
              Dispatched in 24 hrs
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#255038]" />
              Delivery in 2-4 business days
            </span>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCD] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
            <h2 className="font-serif text-2xl text-[#193826]">Receipt & Logistics</h2>
            <button
              onClick={handlePrint}
              className="text-xs text-[#193826]/70 hover:text-[#193826] flex items-center gap-1.5 border border-[#E8DDCD] px-3 py-1.5 bg-[#FBF8F2]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Customer & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#193826]/80 pb-6 border-b border-[#E8DDCD]">
            <div>
              <h4 className="uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Recipient Details
              </h4>
              <p className="font-medium text-[#193826]">{latestOrder.customer.fullName}</p>
              <p>{latestOrder.customer.email}</p>
              <p>+91 {latestOrder.customer.phone}</p>
            </div>

            <div>
              <h4 className="uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Shipping Destination
              </h4>
              <p>{latestOrder.address.street}</p>
              {latestOrder.address.apartment && <p>{latestOrder.address.apartment}</p>}
              <p>{latestOrder.address.city}, {latestOrder.address.state} - {latestOrder.address.pincode}</p>
              <p>{latestOrder.address.country}</p>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="text-xs text-[#193826]/80 pb-6 border-b border-[#E8DDCD]">
            <h4 className="uppercase tracking-wider font-semibold text-[#193826] mb-1">
              Payment Method
            </h4>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#193826]">
                {latestOrder.paymentMethod === 'upi_qr'
                  ? 'UPI QR Transfer (Verified via UTR)'
                  : 'Cash on Delivery (Pay upon arrival)'}
              </span>
              <span className="text-[10px] bg-[#E8DDCD] text-[#193826] px-2 py-0.5 font-medium">
                Confirmed
              </span>
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-wider font-semibold text-[#193826] text-xs">
              Items Ordered
            </h4>
            <div className="divide-y divide-[#E8DDCD]">
              {latestOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.images.thumbnail}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover border border-[#E8DDCD]"
                    />
                    <div>
                      <p className="font-medium text-[#193826]">{item.product.name}</p>
                      <p className="text-[#193826]/60 text-[11px]">{item.selectedWeight} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#193826]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#E8DDCD] space-y-1.5 text-xs text-[#193826]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#193826]">₹{latestOrder.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>{latestOrder.deliveryCharge === 0 ? 'FREE' : `₹${latestOrder.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E8DDCD] font-semibold text-[#193826] text-base">
              <span className="font-serif text-lg">Total Paid</span>
              <span className="font-serif text-xl">₹{latestOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            id="continue-shopping-from-confirmation"
            onClick={() => navigateTo('shop')}
            className="px-8 py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
