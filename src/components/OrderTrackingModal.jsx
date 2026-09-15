import React from 'react';
import { ORDER_STATUS_STEPS } from '../services/orderService';
import { X, CheckCircle, Clock, Truck, Package, ShieldCheck, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

export const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const isCancelled = order.status === 'cancelled';
  const isRefunded = order.status === 'refunded';

  // Find index of current status
  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);

  // Map timeline events by key for quick lookup
  const timelineMap = {};
  (order.timeline || []).forEach(t => {
    timelineMap[t.status] = t;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-2xl w-full my-6 p-6 sm:p-8 shadow-2xl z-10 rounded-[2px] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826] p-1.5 transition-colors"
          aria-label="Close Tracking Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pb-5 border-b border-[#E8DDCD]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-medium">
              Live Order Journey
            </span>
            <span className="text-xs px-2.5 py-0.5 bg-[#193826] text-[#FBF8F2] font-mono font-medium rounded-full">
              {order.id}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#193826]">
            Order Tracking & Details
          </h2>
          <p className="text-xs text-[#193826]/70">
            Placed on {order.date} • Estimated Delivery: <strong>{order.estimatedDelivery || '3-4 business days'}</strong>
          </p>
        </div>

        {/* Cancelled / Refunded Alert */}
        {(isCancelled || isRefunded) && (
          <div className="my-5 p-4 bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-semibold capitalize">Order {order.status}</strong>
              <p>This order has been marked as {order.status}. For any clarifications or instant support, contact customer care.</p>
            </div>
          </div>
        )}

        {/* Courier & Waybill Strip */}
        {!isCancelled && !isRefunded && (
          <div className="my-5 p-4 bg-[#F5EFEB] border border-[#E8DDCD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#193826]/10 flex items-center justify-center text-[#193826]">
                <Truck className="w-5 h-5 text-[#193826]" />
              </div>
              <div>
                <span className="text-[#193826]/60 text-[11px] block">Logistics Partner</span>
                <strong className="text-[#193826] text-sm font-semibold">{order.courierName || 'Delhivery Express'}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[#193826]/60 text-[11px] block">Waybill / Tracking No.</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[#193826] bg-[#EFE8DE] px-2 py-0.5 rounded-[2px]">
                  {order.trackingNumber || 'ZST-IN-PENDING'}
                </span>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C5A869] hover:text-[#193826] transition-colors p-1"
                    title="Track on Courier Partner Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Visual Stepper Timeline */}
        <div className="my-6">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#193826] mb-4">
            Milestone Progress
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DDCD]">
            {ORDER_STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;
              const timelineEvent = timelineMap[step.key];

              return (
                <div key={step.key} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                      isPast
                        ? 'bg-[#193826] text-[#FBF8F2]'
                        : isCurrent
                        ? 'bg-[#C5A869] text-[#193826] ring-4 ring-[#C5A869]/20'
                        : 'bg-[#E8DDCD] text-[#193826]/40'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <h4
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isCurrent
                            ? 'text-[#193826] font-bold'
                            : isPast
                            ? 'text-[#193826]'
                            : 'text-[#193826]/40'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-[#193826]/60 leading-tight">
                        {step.description}
                      </p>
                    </div>

                    {timelineEvent && (
                      <span className="text-[11px] text-[#193826]/75 font-mono sm:text-right shrink-0">
                        {timelineEvent.date}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Items Breakdown */}
        <div className="border-t border-[#E8DDCD] pt-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#193826]">
            Purchased Fruits ({order.items?.length || 0})
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFFFFF] border border-[#E8DDCD] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.product?.images?.thumbnail || item.product?.images?.main || '/assets/products/dried-mango.png'}
                      alt={item.product?.name || 'Zestora Fruit'}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm text-[#193826] leading-tight">
                      {item.product?.name}
                    </h5>
                    <span className="text-[11px] text-[#193826]/60">
                      Pouch: {item.selectedWeight} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#193826]">
                    ₹{(item.unitPrice || 0) * (item.quantity || 1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-[#193826]/80">
            {/* Delivery Address */}
            <div className="p-3 bg-[#FFFFFF] border border-[#E8DDCD] space-y-1 rounded-[2px]">
              <div className="flex items-center gap-1.5 font-semibold text-[#193826]">
                <MapPin className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Shipping Destination</span>
              </div>
              <p className="text-[11px] text-[#193826]/70 leading-relaxed">
                {order.address?.fullName}<br />
                {order.address?.house}, {order.address?.street}<br />
                {order.address?.city}, {order.address?.state} - {order.address?.pincode}<br />
                Phone: {order.address?.phone || order.customer?.phone}
              </p>
            </div>

            {/* Payment Info */}
            <div className="p-3 bg-[#FFFFFF] border border-[#E8DDCD] space-y-1.5 rounded-[2px]">
              <div className="flex items-center gap-1.5 font-semibold text-[#193826]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Payment & Invoicing</span>
              </div>
              <div className="text-[11px] space-y-1 text-[#193826]/70">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold text-[#193826] uppercase">
                    {order.paymentMethod === 'upi_qr' ? 'UPI QR Payment' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span
                    className={`font-semibold px-1.5 py-0.2 rounded-[2px] text-[10px] ${
                      order.paymentStatus === 'verified' || order.paymentStatus === 'cod_collected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.paymentStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.paymentStatus?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                {order.upiRefNumber && (
                  <div className="flex justify-between">
                    <span>UTR Ref:</span>
                    <span className="font-mono text-[#193826]">{order.upiRefNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-[#E8DDCD] font-bold text-xs text-[#193826]">
                  <span>Total Paid:</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-[#E8DDCD] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
