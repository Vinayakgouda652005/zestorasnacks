import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import { notificationService } from '../services/notificationService';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { ReviewModal } from '../components/ReviewModal';
import {
  User,
  Package,
  MapPin,
  Heart,
  Bell,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Star
} from 'lucide-react';

export const AccountPage = () => {
  const {
    user,
    currentSubtab,
    setCurrentSubtab,
    navigateTo,
    handleLogout,
    handleUpdateProfile,
    userOrders,
    refreshOrders,
    userAddresses,
    refreshAddresses,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    userNotifications,
    refreshNotifications,
    showToast,
    requireAuth
  } = useShop();

  const [activeTab, setActiveTab] = useState(currentSubtab || 'profile');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState({
    isOpen: false,
    product: null,
    orderId: null
  });

  // Profile Edit Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Address Modal/Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  useEffect(() => {
    if (currentSubtab) {
      setActiveTab(currentSubtab);
    }
  }, [currentSubtab]);

  useEffect(() => {
    if (user) {
      setProfileName(user.fullName);
      setProfilePhone(user.phone);
    }
  }, [user]);

  // If not logged in, prompt user
  if (!user) {
    return (
      <div className="bg-[#FBF8F2] min-h-[75vh] flex items-center justify-center p-6 text-[#193826]">
        <div className="max-w-md w-full bg-[#FAF7F2] border border-[#E8DDCD] p-8 text-center space-y-4 rounded-[2px] shadow-sm">
          <div className="w-14 h-14 bg-[#193826]/10 rounded-full flex items-center justify-center mx-auto text-[#193826]">
            <User className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#C5A869] font-medium block">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl text-[#193826]">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[#193826]/70 leading-relaxed">
            Please sign in to view your order history, live parcel tracking, saved delivery addresses, and wishlist.
          </p>
          <div className="pt-2">
            <button
              onClick={() => requireAuth(() => navigateTo('account'), 'Please sign in to view your account.')}
              className="w-full py-3.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
            >
              Sign In or Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Form submit
  const handleSaveProfile = (e) => {
    e.preventDefault();
    handleUpdateProfile({
      fullName: profileName,
      phone: profilePhone
    });
    setIsEditingProfile(false);
  };

  // Open address editor
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      house: '',
      street: '',
      area: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
      landmark: '',
      isDefault: userAddresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      house: addr.house,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || '',
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.house || !addressForm.city || !addressForm.pincode) {
      showToast('Please fill all required address fields.');
      return;
    }

    if (editingAddressId) {
      addressService.updateAddress(user.id, editingAddressId, addressForm);
      showToast('Address updated successfully.');
    } else {
      addressService.addAddress(user.id, addressForm);
      showToast('New address saved.');
    }

    refreshAddresses();
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id) => {
    addressService.deleteAddress(user.id, id);
    refreshAddresses();
    showToast('Address deleted.');
  };

  const handleSetDefaultAddress = (id) => {
    addressService.setDefaultAddress(user.id, id);
    refreshAddresses();
    showToast('Default address updated.');
  };

  const openOrderTracking = (order) => {
    setSelectedOrderForTracking(order);
    setIsTrackingModalOpen(true);
  };

  // Wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Unread notifications count
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-10 lg:py-16 text-[#193826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Top Bar */}
        <div className="pb-8 mb-8 border-b border-[#E8DDCD] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A869] font-semibold">
              Member Dashboard
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#193826]">
              Namaste, {user.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs text-[#193826]/70 mt-1">
              {user.email} • Member of the Zestora Clean Snacking Club
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider text-red-700/80 hover:text-red-800 flex items-center gap-1.5 font-semibold py-2 px-3 border border-red-200/70 bg-red-50/50 hover:bg-red-50 transition-all rounded-[2px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-2 space-y-1 rounded-[2px]">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setCurrentSubtab('profile');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-[2px] transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'text-[#193826]/75 hover:bg-[#F5EFEB] hover:text-[#193826]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setCurrentSubtab('orders');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-[2px] transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'text-[#193826]/75 hover:bg-[#F5EFEB] hover:text-[#193826]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE8DE] text-[#193826]">
                  {userOrders.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('addresses');
                  setCurrentSubtab('addresses');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-[2px] transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'text-[#193826]/75 hover:bg-[#F5EFEB] hover:text-[#193826]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE8DE] text-[#193826]">
                  {userAddresses.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('wishlist');
                  setCurrentSubtab('wishlist');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-[2px] transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'text-[#193826]/75 hover:bg-[#F5EFEB] hover:text-[#193826]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>My Wishlist</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE8DE] text-[#193826]">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setCurrentSubtab('notifications');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-[2px] transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-[#193826] text-[#FBF8F2]'
                    : 'text-[#193826]/75 hover:bg-[#F5EFEB] hover:text-[#193826]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A869] text-[#193826] font-bold">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE8DE] text-[#193826]">
                    {userNotifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Support Callout Box */}
            <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] space-y-2 rounded-[2px]">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#193826] block">
                Dedicated Support
              </span>
              <p className="text-[11px] text-[#193826]/70 leading-relaxed">
                Need help with a shipment or bulk ordering? Contact our pantry team on WhatsApp.
              </p>
              <a
                href="https://wa.me/919880882476"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#193826] underline hover:text-[#C5A869] block pt-1"
              >
                +91 9880882476 (WhatsApp)
              </a>
            </div>
          </div>

          {/* Right Column: Tab Contents */}
          <div className="lg:col-span-9">
            
            {/* ================= TAB 1: PROFILE ================= */}
            {activeTab === 'profile' && (
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Customer Profile</h2>
                    <p className="text-xs text-[#193826]/70">Your personal contact and identification details</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-xs uppercase tracking-wider font-semibold text-[#193826] border border-[#E8DDCD] px-3.5 py-2 bg-[#FBF8F2] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5 rounded-[2px]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#193826]/60 font-medium">Full Name</span>
                      <p className="text-sm font-semibold text-[#193826]">{user.fullName}</p>
                    </div>

                    <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#193826]/60 font-medium">Email Address</span>
                      <p className="text-sm font-semibold text-[#193826]">{user.email}</p>
                      <span className="text-[10px] text-[#193826]/50">(Email cannot be changed directly)</span>
                    </div>

                    <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#193826]/60 font-medium">Phone Number</span>
                      <p className="text-sm font-semibold text-[#193826]">+91 {user.phone}</p>
                    </div>

                    <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#193826]/60 font-medium">Account Status</span>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active Zestora Member</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 max-w-lg">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] focus:outline-none focus:border-[#193826]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-6 py-2.5 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826]/80 hover:text-[#193826] bg-[#FFFFFF] transition-colors rounded-[2px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ================= TAB 2: MY ORDERS ================= */}
            {activeTab === 'orders' && (
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px] space-y-6">
                <div className="pb-4 border-b border-[#E8DDCD]">
                  <h2 className="font-serif text-2xl text-[#193826]">My Orders</h2>
                  <p className="text-xs text-[#193826]/70">
                    Track parcel delivery, view receipts, and monitor progress of your orders.
                  </p>
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-3 text-[#193826]/70">
                    <Package className="w-10 h-10 text-[#193826]/30 mx-auto" />
                    <h3 className="font-serif text-xl text-[#193826]">No orders placed yet</h3>
                    <p className="text-xs max-w-sm mx-auto">
                      Explore our naturally dehydrated Alphonso mango, Queen pineapple, and crunchy fruit pouches.
                    </p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all inline-flex items-center gap-2 rounded-[2px]"
                    >
                      <span>Explore Pantry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] space-y-4 hover:border-[#C5A869]/50 transition-all"
                      >
                        {/* Order Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DDCD] gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#193826]">{order.id}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-[#F5EFEB] border border-[#E8DDCD] rounded-full text-[#193826]/70">
                                {order.date}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#193826]/60 block">
                              Courier: <strong>{order.courierName || 'Delhivery Express'}</strong> • Est: {order.estimatedDelivery || '3-4 days'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Order Status Badge */}
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[2px] ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'shipped' || order.status === 'out_for_delivery'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'cancelled' || order.status === 'refunded'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status?.replace(/_/g, ' ')}
                            </span>

                            {/* Payment Status Badge */}
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-[2px] ${
                                order.paymentStatus === 'verified' || order.paymentStatus === 'cod_collected'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : order.paymentStatus === 'rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {order.paymentMethod === 'upi_qr'
                                ? `UPI: ${order.paymentStatus}`
                                : `COD: ${order.paymentStatus}`}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Snapshot & Review Trigger for Delivered Items */}
                        <div className="space-y-3">
                          {order.status?.toLowerCase() === 'delivered' && (
                            <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-[2px] flex items-center justify-between text-xs text-emerald-900">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>Delivered parcel. You can now write a verified review for your items.</span>
                              </div>
                            </div>
                          )}

                          <div className="divide-y divide-[#E8DDCD] border border-[#E8DDCD] rounded-[2px] bg-[#FAF7F2]/50">
                            {(order.items || []).map((item, idx) => {
                              const prodId = item.product?.id || item.product?.slug;
                              const isDelivered = order.status?.toLowerCase() === 'delivered';
                              const alreadyReviewed = isDelivered && reviewService.hasUserReviewedOrderProduct(
                                user?.id,
                                user?.email,
                                prodId,
                                order.id
                              );

                              return (
                                <div
                                  key={idx}
                                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF]"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#F7F3EC] border border-[#E8DDCD] p-1 rounded-[2px] shrink-0 flex items-center justify-center">
                                      <img
                                        src={item.product?.images?.thumbnail || item.product?.images?.main || '/assets/products/dried-mango.png'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div>
                                      <strong className="font-serif text-sm block text-[#193826]">
                                        {item.product?.name}
                                      </strong>
                                      <span className="text-[11px] text-[#193826]/70 block">
                                        {item.selectedWeight} • Qty: {item.quantity} • ₹{item.unitPrice * item.quantity}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Review Action (ONLY unlocked when order is DELIVERED) */}
                                  {isDelivered && (
                                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                      {alreadyReviewed ? (
                                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-semibold tracking-wider rounded-[2px] flex items-center gap-1">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                          <span>Reviewed</span>
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setReviewModalData({
                                            isOpen: true,
                                            product: item.product,
                                            orderId: order.id
                                          })}
                                          className="px-3 py-1.5 bg-[#193826] hover:bg-[#12291C] text-[#FBF8F2] text-[11px] uppercase tracking-wider font-semibold rounded-[2px] transition-all flex items-center gap-1.5 shadow-xs"
                                        >
                                          <Star className="w-3.5 h-3.5 text-[#C5A869] fill-[#C5A869]" />
                                          <span>Write a Review</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-[#193826]/60">Total Amount:</span>
                              <span className="font-serif text-lg font-bold text-[#193826]">
                                ₹{order.total}
                              </span>
                            </div>

                            <button
                              onClick={() => openOrderTracking(order)}
                              className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E8DDCD] text-[#193826] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#FAF7F2] transition-all flex items-center gap-1.5 rounded-[2px]"
                            >
                              <span>Track Journey</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: ADDRESSES ================= */}
            {activeTab === 'addresses' && (
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Saved Addresses</h2>
                    <p className="text-xs text-[#193826]/70">
                      Manage delivery destinations for faster checkout
                    </p>
                  </div>
                  <button
                    onClick={openNewAddressModal}
                    className="text-xs uppercase tracking-wider font-semibold text-[#FBF8F2] bg-[#193826] hover:bg-[#12291C] px-3.5 py-2 transition-colors flex items-center gap-1.5 rounded-[2px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {userAddresses.length === 0 ? (
                  <div className="py-12 text-center space-y-3 text-[#193826]/70">
                    <MapPin className="w-10 h-10 text-[#193826]/30 mx-auto" />
                    <h3 className="font-serif text-xl text-[#193826]">No addresses saved</h3>
                    <p className="text-xs max-w-sm mx-auto">
                      Save your home, apartment, or office address to make ordering seamless.
                    </p>
                    <button
                      onClick={openNewAddressModal}
                      className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
                    >
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 bg-[#FFFFFF] border rounded-[2px] space-y-3 relative transition-all ${
                          addr.isDefault ? 'border-[#193826] ring-1 ring-[#193826]/20' : 'border-[#E8DDCD]'
                        }`}
                      >
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#193826] text-[#FBF8F2] rounded-[2px] inline-block">
                            Default Address
                          </span>
                        )}

                        <div>
                          <h4 className="font-semibold text-sm text-[#193826]">{addr.fullName}</h4>
                          <p className="text-xs text-[#193826]/75 mt-1 leading-relaxed">
                            {addr.house}, {addr.street}<br />
                            {addr.area && `${addr.area}, `}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-[#193826]/60 mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-xs text-[#193826]/80 mt-1 font-medium">
                            Phone: +91 {addr.phone}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E8DDCD] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditAddressModal(addr)}
                              className="text-[#193826] hover:text-[#C5A869] font-medium flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-red-700 hover:text-red-900 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>

                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-[#193826]/70 hover:text-[#193826] underline"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 4: WISHLIST ================= */}
            {activeTab === 'wishlist' && (
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px] space-y-6">
                <div className="pb-4 border-b border-[#E8DDCD]">
                  <h2 className="font-serif text-2xl text-[#193826]">My Saved Wishlist</h2>
                  <p className="text-xs text-[#193826]/70">
                    Hand-curated favorites to add to your pantry bag anytime
                  </p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center space-y-3 text-[#193826]/70">
                    <Heart className="w-10 h-10 text-[#193826]/30 mx-auto" />
                    <h3 className="font-serif text-xl text-[#193826]">Your wishlist is empty</h3>
                    <p className="text-xs max-w-sm mx-auto">
                      Click the heart icon on any fruit product card to keep it saved for later snacking.
                    </p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
                    >
                      Browse All Fruits
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {wishlistProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#FFFFFF] border border-[#E8DDCD] p-4 flex flex-col justify-between rounded-[2px] group"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-square bg-[#FBF8F2] border border-[#E8DDCD] p-3 flex items-center justify-center">
                            <img
                              src={prod.images?.main || prod.images?.thumbnail}
                              alt={prod.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className="absolute top-2 right-2 p-1.5 bg-[#FFFFFF] rounded-full text-red-600 shadow-xs hover:bg-red-50 transition-colors"
                              title="Remove from Wishlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <h4
                              onClick={() => navigateTo('product-detail', prod.slug)}
                              className="font-serif text-base text-[#193826] hover:text-[#C5A869] cursor-pointer transition-colors leading-tight"
                            >
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-[#193826]/60 line-clamp-1 mt-0.5">
                              {prod.tagline}
                            </p>
                            <span className="font-serif text-sm font-bold text-[#193826] block mt-1">
                              ₹{prod.price}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8DDCD] mt-3">
                          <button
                            onClick={() => {
                              addToCart(prod, prod.defaultWeight, 1);
                              toggleWishlist(prod.id);
                            }}
                            className="w-full py-2 bg-[#193826] text-[#FBF8F2] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-1.5 rounded-[2px]"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 5: NOTIFICATIONS ================= */}
            {activeTab === 'notifications' && (
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-6 sm:p-8 rounded-[2px] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#193826]">Activity Notifications</h2>
                    <p className="text-xs text-[#193826]/70">
                      Real-time updates regarding order status, logistics dispatch, and payments
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notificationService.markAllAsRead(user.id);
                        refreshNotifications();
                        showToast('All marked as read');
                      }}
                      className="text-xs text-[#193826] underline hover:text-[#C5A869] font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {userNotifications.length === 0 ? (
                  <div className="py-12 text-center space-y-3 text-[#193826]/70">
                    <Bell className="w-10 h-10 text-[#193826]/30 mx-auto" />
                    <h3 className="font-serif text-xl text-[#193826]">No notifications yet</h3>
                    <p className="text-xs max-w-sm mx-auto">
                      You will receive notifications here when your orders are confirmed, packed, and dispatched.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border rounded-[2px] flex items-start justify-between gap-3 transition-colors ${
                          notif.read ? 'bg-[#FFFFFF] border-[#E8DDCD]' : 'bg-[#F5EFEB] border-[#C5A869]/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs text-[#193826]">{notif.title}</h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#C5A869]" />
                            )}
                          </div>
                          <p className="text-xs text-[#193826]/75 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-[#193826]/50 font-mono block pt-0.5">{notif.date}</span>
                        </div>

                        {notif.orderId && (
                          <button
                            onClick={() => {
                              const ord = orderService.getOrderById(notif.orderId);
                              if (ord) openOrderTracking(ord);
                            }}
                            className="text-[11px] uppercase tracking-wider font-semibold text-[#193826] hover:text-[#C5A869] shrink-0 underline"
                          >
                            View Order
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 rounded-[2px] max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl text-[#193826] mb-1">
              {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
            </h3>
            <p className="text-xs text-[#193826]/70 mb-5">
              Ensure contact number and pincode are accurate for seamless delivery.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Flat / House No. / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Sunshine Meadows"
                  value={addressForm.house}
                  onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Street / Road *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14th Cross, 100ft Road"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Area / Colony</label>
                  <input
                    type="text"
                    value={addressForm.area}
                    onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near BDA Complex"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] p-2 text-xs focus:outline-none focus:border-[#193826]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#193826]">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded text-[#193826]"
                  />
                  <span>Make this my default delivery address</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DDCD]">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Order Tracking Modal */}
      <OrderTrackingModal
        order={selectedOrderForTracking}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Review Modal triggered for Delivered orders */}
      <ReviewModal
        product={reviewModalData.product}
        orderId={reviewModalData.orderId}
        isOpen={reviewModalData.isOpen}
        onClose={() => {
          setReviewModalData({ isOpen: false, product: null, orderId: null });
          if (refreshOrders) refreshOrders();
        }}
      />
    </div>
  );
};
