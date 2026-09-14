import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShieldCheck,
  QrCode,
  Banknote,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Copy,
  Info
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, cartSubtotal, deliveryCharge, cartTotal, createOrder, navigateTo, showToast } = useShop();

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FBF8F2] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="font-serif text-3xl text-[#193826]">Your Bag is Empty</h2>
          <p className="text-xs text-[#193826]/70">Add some delicious fruit snacks before checking out.</p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold"
          >
            Go to Pantry
          </button>
        </div>
      </div>
    );
  }

  // Multi-step state: 1 (Customer Info) -> 2 (Address) -> 3 (Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [address, setAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi_qr');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [upiScreenshotName, setUpiScreenshotName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('vinayakgouda51@oksbi');
    setCopiedUpiId(true);
    showToast('UPI ID copied to clipboard');
    setTimeout(() => setCopiedUpiId(false), 2500);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone) {
      showToast('Please complete all contact fields.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.pincode) {
      showToast('Please complete the required address fields.');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalOrderSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi_qr' && !upiRefNumber.trim()) {
      showToast('Please enter the 12-digit UPI UTR / Transaction reference number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createOrder(customer, address, paymentMethod);
      setIsSubmitting(false);
      navigateTo('order-confirmation');
    }, 1200);
  };

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Step Indicators */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            Secure Order Processing
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
            Express Checkout
          </h1>

          {/* Stepper */}
          <div className="pt-4 flex items-center justify-center space-x-2 sm:space-x-4 text-xs font-medium">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-1.5 pb-1 transition-colors ${
                currentStep >= 1 ? 'text-[#193826] border-b-2 border-[#193826]' : 'text-[#193826]/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#193826] text-[#FBF8F2] text-[11px] flex items-center justify-center">
                1
              </span>
              <span>Contact</span>
            </button>
            <span className="text-[#193826]/30">›</span>

            <button
              onClick={() => {
                if (customer.fullName && customer.email) setCurrentStep(2);
              }}
              className={`flex items-center space-x-1.5 pb-1 transition-colors ${
                currentStep >= 2 ? 'text-[#193826] border-b-2 border-[#193826]' : 'text-[#193826]/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${
                currentStep >= 2 ? 'bg-[#193826] text-[#FBF8F2]' : 'bg-[#E8DDCD] text-[#193826]/60'
              }`}>
                2
              </span>
              <span>Delivery</span>
            </button>
            <span className="text-[#193826]/30">›</span>

            <button
              onClick={() => {
                if (customer.fullName && address.street) setCurrentStep(3);
              }}
              className={`flex items-center space-x-1.5 pb-1 transition-colors ${
                currentStep === 3 ? 'text-[#193826] border-b-2 border-[#193826]' : 'text-[#193826]/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${
                currentStep === 3 ? 'bg-[#193826] text-[#FBF8F2]' : 'bg-[#E8DDCD] text-[#193826]/60'
              }`}>
                3
              </span>
              <span>Payment</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 bg-[#F5EFEB] border border-[#E8DDCD] p-6 sm:p-8">
            
            {/* ==================================================
                STEP 1: CUSTOMER INFORMATION
                ================================================== */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="border-b border-[#E8DDCD] pb-4">
                  <h2 className="font-serif text-2xl text-[#193826]">Customer Information</h2>
                  <p className="text-xs text-[#193826]/70">Where should we send your receipt and tracking link?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customer-fullName" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="customer-fullName"
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-email" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                      Phone Number (For Delivery Updates) *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-[#E8DDCD] border border-r-0 border-[#E8DDCD] text-xs font-semibold text-[#193826]">
                        +91
                      </span>
                      <input
                        id="customer-phone"
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="step1-continue-btn"
                    type="submit"
                    className="w-full py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ==================================================
                STEP 2: DELIVERY ADDRESS
                ================================================== */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="border-b border-[#E8DDCD] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Delivery Address</h2>
                    <p className="text-xs text-[#193826]/70">Express dispatch to your doorstep across India.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#193826]/60 hover:text-[#193826] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address-street" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                      Street Address / House No. / Building *
                    </label>
                    <input
                      id="address-street"
                      type="text"
                      required
                      placeholder="e.g. 42, Palm Grove Residences, 8th Main"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                    />
                  </div>

                  <div>
                    <label htmlFor="address-apartment" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                      Apartment, Suite, Unit, Landmark (Optional)
                    </label>
                    <input
                      id="address-apartment"
                      type="text"
                      placeholder="e.g. Tower 2, Flat 401, Near Metro Station"
                      value={address.apartment}
                      onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                      className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address-city" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        City *
                      </label>
                      <input
                        id="address-city"
                        type="text"
                        required
                        placeholder="e.g. Bengaluru"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>

                    <div>
                      <label htmlFor="address-pincode" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        PIN Code *
                      </label>
                      <input
                        id="address-pincode"
                        type="text"
                        required
                        placeholder="e.g. 560038"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address-state" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        State *
                      </label>
                      <select
                        id="address-state"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                      >
                        {[
                          'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat',
                          'Haryana', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab',
                          'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
                        ].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="address-country" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        Country
                      </label>
                      <input
                        id="address-country"
                        type="text"
                        disabled
                        value="India"
                        className="w-full bg-[#E8DDCD]/50 border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-4 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826] hover:bg-[#FBF8F2]"
                  >
                    Back
                  </button>
                  <button
                    id="step2-continue-btn"
                    type="submit"
                    className="flex-1 py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ==================================================
                STEP 3: PAYMENT METHOD & UPI QR FLOW
                ================================================== */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalOrderSubmit} className="space-y-6">
                <div className="border-b border-[#E8DDCD] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Payment Method</h2>
                    <p className="text-xs text-[#193826]/70">Choose direct UPI scan or cash on delivery.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-[#193826]/60 hover:text-[#193826] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    id="select-payment-upi"
                    onClick={() => setPaymentMethod('upi_qr')}
                    className={`p-4 text-left border flex flex-col justify-between transition-all ${
                      paymentMethod === 'upi_qr'
                        ? 'border-[#193826] bg-[#FBF8F2] shadow-xs'
                        : 'border-[#E8DDCD] bg-[#F5EFEB] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#193826]" />
                      <span className="text-[10px] bg-[#193826] text-[#FBF8F2] px-2 py-0.5 font-medium">Recommended</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#193826]">UPI / QR Scan</p>
                      <p className="text-[11px] text-[#193826]/60">GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    id="select-payment-cod"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 text-left border flex flex-col justify-between transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#193826] bg-[#FBF8F2] shadow-xs'
                        : 'border-[#E8DDCD] bg-[#F5EFEB] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#193826]" />
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#193826]">Cash on Delivery</p>
                      <p className="text-[11px] text-[#193826]/60">Pay cash upon parcel delivery</p>
                    </div>
                  </button>
                </div>

                {/* UPI QR Code Container (Displaying the provided scanner asset) */}
                {paymentMethod === 'upi_qr' && (
                  <div className="bg-[#FBF8F2] border border-[#E8DDCD] p-6 space-y-5">
                    
                    {/* Instructions Banner */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#193826]">
                        <span className="w-2 h-2 rounded-full bg-[#255038]" />
                        <h4 className="font-serif text-lg text-[#193826] font-medium">Scan to Pay with Any UPI App</h4>
                      </div>
                      <p className="text-xs text-[#193826]/70 leading-relaxed">
                        Follow the simple steps below to complete your payment:
                      </p>
                    </div>

                    {/* Step-by-step instructions */}
                    <ol className="text-xs text-[#193826]/80 space-y-1.5 list-decimal list-inside bg-[#F5EFEB] p-3.5 border border-[#E8DDCD]">
                      <li>Open any UPI app: Google Pay, PhonePe, Paytm, BHIM, CRED, or Bank App.</li>
                      <li>Scan the official Zestora QR code shown below.</li>
                      <li>
                        Enter the exact order amount: <strong className="text-[#193826] font-bold text-sm">₹{cartTotal}</strong>
                      </li>
                      <li>Enter your 12-digit UPI Reference Number / UTR below to confirm.</li>
                    </ol>

                    {/* QR Code Presentation */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#FFFFFF] border border-[#E8DDCD] rounded-sm shadow-xs">
                      {/* Using the Scanner.jpeg asset */}
                      <img
                        src="/Scanner.jpeg"
                        alt="ZESTORA Official UPI Payment QR Code"
                        className="w-64 sm:w-72 object-contain border border-[#E8DDCD]"
                      />
                      
                      {/* Manual UPI ID Fallback */}
                      <div className="mt-3 pt-3 border-t border-[#E8DDCD] w-full flex items-center justify-between text-xs px-2">
                        <div>
                          <span className="text-[#193826]/50 text-[10px] block">UPI ID:</span>
                          <span className="font-mono font-medium text-[#193826]">vinayakgouda51@oksbi</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#193826] hover:text-[#C5A869] border border-[#E8DDCD] px-2 py-1 bg-[#FBF8F2]"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUpiId ? 'Copied!' : 'Copy ID'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Important Disclaimer Note (Strictly adhering to prompt rules) */}
                    <div className="bg-[#FFF8E7] border border-[#C5A869]/50 p-3 text-xs text-[#193826] flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="block font-semibold">Payment Verification Protocol:</strong>
                        <span>
                          Please submit your UPI Reference Number / Transaction ID below so our logistics team can verify and dispatch your snack box. We do not claim instant automated payment verification without human audit.
                        </span>
                      </div>
                    </div>

                    {/* Reference / UTR Number Input */}
                    <div>
                      <label htmlFor="upi-utr-number" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        12-Digit UPI Transaction ID / UTR Number *
                      </label>
                      <input
                        id="upi-utr-number"
                        type="text"
                        required
                        maxLength={16}
                        placeholder="e.g. 423871928374"
                        value={upiRefNumber}
                        onChange={(e) => setUpiRefNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-4 py-3 text-sm font-mono text-[#193826] tracking-wider focus:outline-none focus:border-[#193826]"
                      />
                      <p className="text-[11px] text-[#193826]/60 mt-1">
                        Found in your UPI app payment receipt after successful transfer.
                      </p>
                    </div>

                    {/* Optional Screenshot Attachment */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#193826] mb-1">
                        Attach Payment Screenshot (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUpiScreenshotName(file.name);
                        }}
                        className="text-xs text-[#193826]/70 file:mr-3 file:py-2 file:px-3 file:border file:border-[#E8DDCD] file:text-xs file:bg-[#F5EFEB] file:text-[#193826] hover:file:bg-[#E8DDCD]"
                      />
                      {upiScreenshotName && (
                        <span className="text-[11px] text-[#255038] mt-1 block">
                          Attached: {upiScreenshotName}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* COD Details Container */}
                {paymentMethod === 'cod' && (
                  <div className="bg-[#FBF8F2] border border-[#E8DDCD] p-6 space-y-3">
                    <h4 className="font-serif text-lg text-[#193826]">Cash on Delivery Terms</h4>
                    <p className="text-xs text-[#193826]/75 leading-relaxed">
                      Please keep exact cash of <strong>₹{cartTotal}</strong> ready at the time of delivery. You will receive an SMS confirmation and courier tracking dispatch alert once your dehydrated fruit box is packed.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#255038] font-medium pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Zero extra COD convenience surcharge</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-4 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826] hover:bg-[#FBF8F2]"
                  >
                    Back
                  </button>

                  <button
                    id="place-order-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? 'Processing Order...' : `Place Order • ₹${cartTotal}`}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 sm:p-8 space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
                <h3 className="font-serif text-2xl text-[#193826]">Order Summary</h3>
                <span className="text-xs text-[#193826]/60">{cart.length} items</span>
              </div>

              {/* Items preview */}
              <div className="divide-y divide-[#E8DDCD] max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.product.images.thumbnail}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border border-[#E8DDCD] shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-medium text-[#193826] truncate">{item.product.name}</p>
                        <p className="text-[#193826]/50 text-[11px]">{item.selectedWeight} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#193826] whitespace-nowrap">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-[#E8DDCD] space-y-2 text-xs text-[#193826]/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#193826]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#255038] font-semibold">FREE (Over ₹499)</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Handling</span>
                  <span className="text-[#193826]/60">Included</span>
                </div>

                <div className="pt-4 border-t border-[#E8DDCD] flex justify-between items-baseline font-semibold text-[#193826]">
                  <span className="font-serif text-lg">Total Payable</span>
                  <span className="font-serif text-2xl">₹{cartTotal}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 text-[11px] text-[#193826]/70 space-y-2 border-t border-[#E8DDCD]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
                  <span>Secure 256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#255038]" />
                  <span>Dispatches from Bangalore via Express Logistics</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
