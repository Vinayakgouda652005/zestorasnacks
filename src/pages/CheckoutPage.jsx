import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { addressService } from '../services/addressService';
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
  Info,
  MapPin,
  User,
  Plus
} from 'lucide-react';

export const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    cartTotal,
    createOrder,
    navigateTo,
    showToast,
    user,
    userAddresses,
    refreshAddresses,
    requireAuth
  } = useShop();

  // Multi-step state: 1 (Customer Info) -> 2 (Address) -> 3 (Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [customer, setCustomer] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Saved Address selection
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    if (userAddresses && userAddresses.length > 0) {
      const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
      return defaultAddr.id;
    }
    return 'new';
  });

  const [address, setAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    country: 'India'
  });

  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi_qr');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [upiScreenshotName, setUpiScreenshotName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);

  // Synchronize when user logs in or address selection changes
  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (userAddresses && userAddresses.length > 0 && selectedAddressId !== 'new') {
      const found = userAddresses.find(a => a.id === selectedAddressId);
      if (found) {
        setAddress({
          street: `${found.house}, ${found.street}`,
          apartment: found.landmark || found.area || '',
          city: found.city,
          state: found.state,
          pincode: found.pincode,
          country: 'India'
        });
      }
    }
  }, [selectedAddressId, userAddresses]);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FBF8F2] flex items-center justify-center p-6 text-[#193826]">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="font-serif text-3xl text-[#193826]">Your Bag is Empty</h2>
          <p className="text-xs text-[#193826]/70">Add some delicious fruit snacks before checking out.</p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold rounded-[2px]"
          >
            Go to Pantry
          </button>
        </div>
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('vinayakgouda51@oksbi');
    setCopiedUpiId(true);
    showToast('UPI ID copied to clipboard');
    setTimeout(() => setCopiedUpiId(false), 2500);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!user) {
      requireAuth(() => setCurrentStep(2), 'Please sign in to proceed with your delivery details.');
      return;
    }
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
    if (!user) {
      requireAuth(() => {}, 'Please sign in to confirm and place your order.');
      return;
    }

    if (paymentMethod === 'upi_qr' && !upiRefNumber.trim()) {
      showToast('Please enter the 12-digit UPI UTR / Transaction reference number.');
      return;
    }

    setIsSubmitting(true);

    // If new address was entered and user checked save to account
    if (selectedAddressId === 'new' && saveAddressToAccount && user) {
      addressService.addAddress(user.id, {
        fullName: customer.fullName,
        phone: customer.phone,
        house: address.apartment || 'Address',
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      });
      refreshAddresses();
    }

    setTimeout(() => {
      createOrder(customer, address, paymentMethod, upiRefNumber, upiScreenshotName);
      setIsSubmitting(false);
      navigateTo('order-confirmation');
    }, 1000);
  };

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-10 lg:py-16 text-[#193826]">
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
          <div className="lg:col-span-7 bg-[#F5EFEB] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px]">
            
            {/* ==================================================
                STEP 1: CUSTOMER INFORMATION & AUTHENTICATION
                ================================================== */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="border-b border-[#E8DDCD] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Customer Information</h2>
                    <p className="text-xs text-[#193826]/70">Where should we send your receipt and tracking link?</p>
                  </div>
                  {user && (
                    <div className="text-right">
                      <span className="text-[11px] text-[#193826]/60 block">Signed in as</span>
                      <strong className="text-xs text-[#193826]">{user.fullName}</strong>
                    </div>
                  )}
                </div>

                {/* If Not Logged In: Fast-track Card */}
                {!user && (
                  <div className="p-4 bg-[#FFFFFF] border border-[#C5A869]/60 rounded-[2px] space-y-2">
                    <div className="flex items-center gap-2 text-[#193826]">
                      <User className="w-4 h-4 text-[#C5A869]" />
                      <h4 className="font-semibold text-xs">Customer Account Required for Checkout</h4>
                    </div>
                    <p className="text-xs text-[#193826]/75 leading-relaxed">
                      To provide live parcel tracking, saved delivery addresses, and payment confirmation receipts, please sign in or create an account.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => requireAuth(() => setCurrentStep(2), 'Sign in to fast-track your checkout.')}
                        className="px-4 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  </div>
                )}

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
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="step1-continue-btn"
                    type="submit"
                    className="w-full py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 rounded-[2px]"
                  >
                    <span>Continue to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ==================================================
                STEP 2: DELIVERY ADDRESS (SAVED ADDRESSES SUPPORT)
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
                    className="text-xs text-[#193826]/60 hover:text-[#193826] flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {/* Saved Addresses List (If user has saved addresses) */}
                {user && userAddresses.length > 0 && (
                  <div className="space-y-3 pb-3 border-b border-[#E8DDCD]">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#193826] block">
                      Choose from Saved Addresses
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`p-3.5 bg-[#FFFFFF] border rounded-[2px] cursor-pointer block transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-[#193826] ring-1 ring-[#193826]/30 shadow-xs'
                              : 'border-[#E8DDCD] opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="savedAddress"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-0.5 text-[#193826]"
                            />
                            <div className="text-xs">
                              <strong className="text-[#193826] block">{addr.fullName}</strong>
                              <p className="text-[11px] text-[#193826]/70 leading-tight mt-0.5">
                                {addr.house}, {addr.street}<br />
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              {addr.isDefault && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-[#193826] text-[#FBF8F2] rounded-[2px] inline-block mt-1">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}

                      <label
                        className={`p-3.5 bg-[#FFFFFF] border rounded-[2px] cursor-pointer flex items-center gap-2 transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-[#193826] ring-1 ring-[#193826]/30 shadow-xs'
                            : 'border-[#E8DDCD] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === 'new'}
                          onChange={() => setSelectedAddressId('new')}
                          className="text-[#193826]"
                        />
                        <div className="text-xs">
                          <strong className="text-[#193826] block">Enter a New Address</strong>
                          <span className="text-[11px] text-[#193826]/60">Ship to a different destination</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form fields (Always active or editable when entering address) */}
                {(selectedAddressId === 'new' || !user || userAddresses.length === 0) ? (
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
                          maxLength={6}
                          placeholder="e.g. 560038"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
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

                    {user && (
                      <div className="pt-1">
                        <label className="flex items-center gap-2 text-xs text-[#193826] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveAddressToAccount}
                            onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                            className="rounded text-[#193826]"
                          />
                          <span>Save this delivery address to my account</span>
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCD] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#193826]">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Deliver to Selected Address:</span>
                    </div>
                    <p className="text-xs text-[#193826]/80 leading-relaxed">
                      {address.street}<br />
                      {address.apartment && `${address.apartment}, `}{address.city}, {address.state} - <strong>{address.pincode}</strong>
                    </p>
                  </div>
                )}

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
                    className="flex-1 py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 rounded-[2px]"
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
                    className="text-xs text-[#193826]/60 hover:text-[#193826] flex items-center gap-1 font-medium"
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
                    className={`p-4 text-left border flex flex-col justify-between transition-all rounded-[2px] ${
                      paymentMethod === 'upi_qr'
                        ? 'border-[#193826] bg-[#FBF8F2] shadow-xs'
                        : 'border-[#E8DDCD] bg-[#F5EFEB] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#193826]" />
                      <span className="text-[10px] bg-[#193826] text-[#FBF8F2] px-2 py-0.5 font-medium rounded-[2px]">Recommended</span>
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
                    className={`p-4 text-left border flex flex-col justify-between transition-all rounded-[2px] ${
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

                {/* UPI QR Code Container */}
                {paymentMethod === 'upi_qr' && (
                  <div className="bg-[#FBF8F2] border border-[#E8DDCD] p-6 space-y-5 rounded-[2px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#193826]">
                        <span className="w-2 h-2 rounded-full bg-[#255038]" />
                        <h4 className="font-serif text-lg text-[#193826] font-medium">Scan to Pay with Any UPI App</h4>
                      </div>
                      <p className="text-xs text-[#193826]/70 leading-relaxed">
                        Follow the simple steps below to complete your payment:
                      </p>
                    </div>

                    <ol className="text-xs text-[#193826]/80 space-y-1.5 list-decimal list-inside bg-[#F5EFEB] p-3.5 border border-[#E8DDCD] rounded-[2px]">
                      <li>Open any UPI app: Google Pay, PhonePe, Paytm, BHIM, CRED, or Bank App.</li>
                      <li>Scan the official Zestora QR code shown below.</li>
                      <li>
                        Enter the exact order amount: <strong className="text-[#193826] font-bold text-sm">₹{cartTotal}</strong>
                      </li>
                      <li>Enter your 12-digit UPI Reference Number / UTR below to confirm.</li>
                    </ol>

                    {/* QR Code Presentation */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#FFFFFF] border border-[#E8DDCD] rounded-sm shadow-xs">
                      <img
                        src="/Scanner.jpeg"
                        alt="ZESTORA Official UPI Payment QR Code"
                        className="w-64 sm:w-72 object-contain border border-[#E8DDCD]"
                      />
                      
                      {/* Manual UPI ID Fallback */}
                      <div className="mt-3 pt-3 border-t border-[#E8DDCD] w-full flex items-center justify-between text-xs px-2">
                        <div>
                          <span className="text-[#193826]/60 block text-[11px]">Or pay directly to UPI ID:</span>
                          <span className="font-mono font-semibold text-[#193826]">vinayakgouda51@oksbi</span>
                        </div>
                        <button
                          type="button"
                          id="copy-upi-id-btn"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 bg-[#F5EFEB] border border-[#E8DDCD] text-xs font-medium text-[#193826] hover:bg-[#E8DDCD] transition-colors flex items-center gap-1 rounded-[2px]"
                        >
                          {copiedUpiId ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#255038]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* UTR Reference Number Input */}
                    <div className="pt-2 space-y-3">
                      <div>
                        <label htmlFor="upi-utr-input" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                          12-Digit UPI Transaction / UTR Reference Number *
                        </label>
                        <input
                          id="upi-utr-input"
                          type="text"
                          required
                          maxLength={16}
                          placeholder="e.g. 423819283741"
                          value={upiRefNumber}
                          onChange={(e) => setUpiRefNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-4 py-3 text-sm font-mono text-[#193826] tracking-wider focus:outline-none focus:border-[#193826]"
                        />
                        <p className="text-[11px] text-[#193826]/60 mt-1">
                          Found on the payment success screen under "UPI Transaction ID" or "UTR".
                        </p>
                      </div>

                      {/* Optional Screenshot Upload */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                          Payment Screenshot (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUpiScreenshotName(e.target.files?.[0]?.name || '')}
                          className="w-full text-xs text-[#193826] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#193826] file:text-[#FBF8F2] hover:file:bg-[#12291C] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Notice */}
                {paymentMethod === 'cod' && (
                  <div className="bg-[#FBF8F2] border border-[#E8DDCD] p-6 space-y-3 rounded-[2px]">
                    <div className="flex items-center gap-2 text-[#193826]">
                      <Banknote className="w-5 h-5 text-[#255038]" />
                      <h4 className="font-serif text-lg font-medium">Cash on Delivery (COD)</h4>
                    </div>
                    <p className="text-xs text-[#193826]/75 leading-relaxed">
                      Pay <strong className="text-[#193826]">₹{cartTotal}</strong> in cash upon parcel handover. Please keep exact change ready to assist the courier executive.
                    </p>
                    <div className="text-[11px] text-[#193826]/60 bg-[#F5EFEB] p-3 border border-[#E8DDCD] rounded-[2px]">
                      Our team may call your contact number (+91 {customer.phone}) prior to dispatch to verify courier serviceability.
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
                    id="submit-order-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 disabled:opacity-50 rounded-[2px]"
                  >
                    {isSubmitting ? (
                      <span>Verifying & Placing Order...</span>
                    ) : (
                      <>
                        <span>Place Order (₹{cartTotal})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 sm:p-8 space-y-6 rounded-[2px]">
              <div className="border-b border-[#E8DDCD] pb-4 flex justify-between items-baseline">
                <h3 className="font-serif text-2xl text-[#193826]">Order Summary</h3>
                <span className="text-xs text-[#193826]/60">({cart.length} items)</span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-[#FFFFFF] border border-[#E8DDCD] p-1 flex items-center justify-center shrink-0">
                        <img
                          src={item.product?.images?.thumbnail || item.product?.images?.main}
                          alt={item.product?.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-medium text-[#193826] block">{item.product?.name}</span>
                        <span className="text-[11px] text-[#193826]/60">
                          {item.selectedWeight} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#193826]">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-[#E8DDCD] space-y-2.5 text-xs text-[#193826]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#193826]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#255038] font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST Taxes</span>
                  <span className="text-[#193826]/60">Included (₹0 extra)</span>
                </div>

                <div className="pt-4 border-t border-[#E8DDCD] flex justify-between items-baseline text-base font-semibold text-[#193826]">
                  <span className="font-serif text-xl">Total Amount</span>
                  <span className="font-serif text-2xl text-[#193826]">₹{cartTotal}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#E8DDCD] space-y-2 text-[11px] text-[#193826]/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A869]" />
                  <span>100% Genuine, Sun-Ripened Dehydrated Fruits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C5A869]" />
                  <span>Dispatched in Food-Safe Resealable Zip Bags</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
