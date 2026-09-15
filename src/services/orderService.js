/**
 * ZESTORA Order Management & Tracking Service
 */
import { getStorageItem, setStorageItem } from './storage';
import { notificationService } from './notificationService';

const ORDERS_KEY = 'zestora_orders';

export const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Pending', description: 'Order received and awaiting confirmation' },
  { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed & queued for packing' },
  { key: 'processing', label: 'Processing', description: 'Handpicking sun-ripened fruit pouches' },
  { key: 'packed', label: 'Packed', description: 'Sealed in tamper-evident food-safe packaging' },
  { key: 'shipped', label: 'Shipped', description: 'Handed over to express logistics partner' },
  { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Courier rider is out for delivery in your city' },
  { key: 'delivered', label: 'Delivered', description: 'Delivered to your doorstep' }
];

const DEFAULT_ORDERS = [
  {
    id: 'ZST-10001',
    userId: 'usr_priya_101',
    date: '12 Sep 2024, 02:30 PM',
    createdAt: '2024-09-12T09:00:00.000Z',
    customer: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9880882476'
    },
    items: [
      {
        id: 'prod-mango-40g',
        product: {
          id: 'prod-mango',
          name: 'Dried Mango',
          slug: 'dried-mango',
          price: 199,
          images: { thumbnail: '/assets/products/dried-mango.png' }
        },
        selectedWeight: '40g',
        unitPrice: 199,
        quantity: 2
      },
      {
        id: 'prod-guava-40g',
        product: {
          id: 'prod-guava',
          name: 'Dried Guava',
          slug: 'dried-guava',
          price: 199,
          images: { thumbnail: '/assets/products/dried-guava.png' }
        },
        selectedWeight: '40g',
        unitPrice: 199,
        quantity: 1
      }
    ],
    subtotal: 597,
    deliveryCharge: 0,
    total: 597,
    paymentMethod: 'upi_qr',
    paymentStatus: 'verified',
    upiRefNumber: '423871928374',
    status: 'shipped',
    courierName: 'Delhivery Express',
    trackingNumber: 'DEL9928174201',
    trackingUrl: 'https://www.delhivery.com/track/package/DEL9928174201',
    estimatedDelivery: '15 Sep 2024',
    timeline: [
      { status: 'placed', date: '12 Sep 2024, 02:30 PM', label: 'Order Placed' },
      { status: 'confirmed', date: '12 Sep 2024, 03:00 PM', label: 'Payment Verified & Confirmed' },
      { status: 'processing', date: '12 Sep 2024, 04:30 PM', label: 'Pantry Batch Picked' },
      { status: 'packed', date: '13 Sep 2024, 10:15 AM', label: 'Sealed & Quality Checked' },
      { status: 'shipped', date: '13 Sep 2024, 02:00 PM', label: 'Dispatched via Delhivery Express' }
    ],
    address: {
      fullName: 'Priya Sharma',
      phone: '9880882476',
      house: 'Flat 402, Sunshine Meadows',
      street: '14th Cross, Indiranagar',
      area: 'Indiranagar Stage 2',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    }
  },
  {
    id: 'ZST-10002',
    userId: 'usr_priya_101',
    date: '02 Sep 2024, 11:15 AM',
    createdAt: '2024-09-02T05:45:00.000Z',
    customer: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9880882476'
    },
    items: [
      {
        id: 'prod-pineapple-40g',
        product: {
          id: 'prod-pineapple',
          name: 'Dried Pineapple',
          slug: 'dried-pineapple',
          price: 199,
          images: { thumbnail: '/assets/products/dried-pineapple.png' }
        },
        selectedWeight: '40g',
        unitPrice: 199,
        quantity: 1
      },
      {
        id: 'prod-banana-40g',
        product: {
          id: 'prod-banana',
          name: 'Dried Banana Chips',
          slug: 'dried-banana',
          price: 149,
          images: { thumbnail: '/assets/products/dried-banana.png' }
        },
        selectedWeight: '40g',
        unitPrice: 149,
        quantity: 2
      }
    ],
    subtotal: 497,
    deliveryCharge: 49,
    total: 546,
    paymentMethod: 'cod',
    paymentStatus: 'cod_collected',
    status: 'delivered',
    courierName: 'BlueDart Air',
    trackingNumber: 'BLU773829104',
    trackingUrl: 'https://www.bluedart.com/tracking',
    estimatedDelivery: '05 Sep 2024',
    timeline: [
      { status: 'placed', date: '02 Sep 2024, 11:15 AM', label: 'Order Placed' },
      { status: 'confirmed', date: '02 Sep 2024, 11:45 AM', label: 'Order Confirmed (COD)' },
      { status: 'processing', date: '02 Sep 2024, 01:00 PM', label: 'Packed & Processed' },
      { status: 'packed', date: '02 Sep 2024, 03:00 PM', label: 'Sealed for Dispatch' },
      { status: 'shipped', date: '03 Sep 2024, 09:30 AM', label: 'In Transit via BlueDart' },
      { status: 'out_for_delivery', date: '05 Sep 2024, 08:30 AM', label: 'Out for Delivery' },
      { status: 'delivered', date: '05 Sep 2024, 01:20 PM', label: 'Delivered to Customer' }
    ],
    address: {
      fullName: 'Priya Sharma',
      phone: '9880882476',
      house: 'Flat 402, Sunshine Meadows',
      street: '14th Cross, Indiranagar',
      area: 'Indiranagar Stage 2',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India'
    }
  }
];

export const orderService = {
  getAll() {
    const orders = getStorageItem(ORDERS_KEY, null);
    if (!orders || !Array.isArray(orders)) {
      setStorageItem(ORDERS_KEY, DEFAULT_ORDERS);
      return DEFAULT_ORDERS;
    }
    return orders;
  },

  getUserOrders(userId, email) {
    const all = this.getAll();
    if (!userId && !email) return [];
    return all.filter(o => 
      (userId && o.userId === userId) ||
      (email && o.customer?.email?.toLowerCase() === email.toLowerCase())
    );
  },

  getOrderById(id) {
    const all = this.getAll();
    return all.find(o => o.id === id);
  },

  getById(id) {
    return this.getOrderById(id);
  },

  createOrder({ items, subtotal, deliveryCharge, total, customer, address, paymentMethod, upiRefNumber, upiScreenshotName, userId }) {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder = {
      id: `ZST-${orderNumber}`,
      userId: userId || null,
      date: dateStr,
      createdAt: new Date().toISOString(),
      customer,
      address,
      items,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi_qr' ? 'pending' : 'cod_pending',
      upiRefNumber: upiRefNumber || '',
      upiScreenshotName: upiScreenshotName || '',
      status: 'confirmed',
      courierName: 'Delhivery Express',
      trackingNumber: `ZST${orderNumber}IN`,
      trackingUrl: `https://www.delhivery.com/track/package/ZST${orderNumber}IN`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      timeline: [
        { status: 'placed', date: dateStr, label: 'Order Placed' },
        { status: 'confirmed', date: dateStr, label: paymentMethod === 'upi_qr' ? 'Order Placed (UPI Awaiting Verification)' : 'Order Confirmed (Cash on Delivery)' }
      ]
    };

    const all = this.getAll();
    const updated = [newOrder, ...all];
    setStorageItem(ORDERS_KEY, updated);

    // Also notify customer
    notificationService.addNotification({
      userId,
      title: 'Order Confirmed!',
      message: `Your order ${newOrder.id} of ₹${total} has been confirmed.`,
      orderId: newOrder.id,
      type: 'order_status'
    });

    return newOrder;
  },

  updateStatus(orderId, nextStatus, note, trackingInfo) {
    const all = this.getAll();
    const target = all.find(o => o.id === orderId);
    if (!target) return { success: false, error: 'Order not found' };

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusStep = ORDER_STATUS_STEPS.find(s => s.key === nextStatus);
    const label = note || (statusStep ? statusStep.label : nextStatus.replace(/_/g, ' ').toUpperCase());

    const courier = trackingInfo?.courier || trackingInfo?.courierName || target.courierName || 'Delhivery Express';
    const trackingNumber = trackingInfo?.trackingNumber || target.trackingNumber || '';
    const trackingUrl = trackingInfo?.trackingUrl || target.trackingUrl || '';

    const updated = all.map(o => {
      if (o.id === orderId) {
        const timeline = o.timeline || [];
        const newTimeline = [...timeline, { status: nextStatus, date: dateStr, label }];
        return {
          ...o,
          status: nextStatus,
          courierName: courier,
          trackingNumber,
          trackingUrl,
          tracking: {
            courier,
            trackingNumber,
            trackingUrl
          },
          timeline: newTimeline
        };
      }
      return o;
    });

    setStorageItem(ORDERS_KEY, updated);

    // Notify customer
    if (target.userId) {
      notificationService.addNotification({
        userId: target.userId,
        title: `Order Status Updated: ${label}`,
        message: `Your order ${orderId} status has been updated to ${nextStatus}.`,
        orderId,
        type: 'order_status'
      });
    }

    return { success: true, order: updated.find(o => o.id === orderId) };
  },

  updateOrderStatus(orderId, nextStatus) {
    const all = this.getAll();
    const target = all.find(o => o.id === orderId);
    if (!target) return { success: false, error: 'Order not found' };

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusStep = ORDER_STATUS_STEPS.find(s => s.key === nextStatus);
    const label = statusStep ? statusStep.label : nextStatus.replace(/_/g, ' ').toUpperCase();

    const updated = all.map(o => {
      if (o.id === orderId) {
        const timeline = o.timeline || [];
        // Append to timeline if not already there
        const newTimeline = [...timeline, { status: nextStatus, date: dateStr, label }];
        return {
          ...o,
          status: nextStatus,
          timeline: newTimeline
        };
      }
      return o;
    });

    setStorageItem(ORDERS_KEY, updated);

    // Notify customer
    if (target.userId) {
      notificationService.addNotification({
        userId: target.userId,
        title: `Order Status Updated: ${label}`,
        message: `Your order ${orderId} is now ${label.toLowerCase()}.`,
        orderId,
        type: 'order_status'
      });
    }

    return { success: true, order: updated.find(o => o.id === orderId) };
  },

  updatePaymentStatus(orderId, paymentStatus) {
    const all = this.getAll();
    const target = all.find(o => o.id === orderId);
    if (!target) return { success: false, error: 'Order not found' };

    const updated = all.map(o => {
      if (o.id === orderId) {
        return { ...o, paymentStatus };
      }
      return o;
    });

    setStorageItem(ORDERS_KEY, updated);

    // Notify customer
    if (target.userId) {
      const msg = paymentStatus === 'verified'
        ? `UPI payment for order ${orderId} has been verified.`
        : paymentStatus === 'rejected'
        ? `Payment reference for order ${orderId} could not be verified. Please contact support.`
        : `Payment status updated to ${paymentStatus}.`;

      notificationService.addNotification({
        userId: target.userId,
        title: paymentStatus === 'verified' ? 'Payment Verified!' : 'Payment Status Update',
        message: msg,
        orderId,
        type: 'payment'
      });
    }

    return { success: true, order: updated.find(o => o.id === orderId) };
  },

  updateTracking(orderId, { courierName, trackingNumber, trackingUrl, estimatedDelivery }) {
    const all = this.getAll();
    const updated = all.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          courierName: courierName !== undefined ? courierName : o.courierName,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
          trackingUrl: trackingUrl !== undefined ? trackingUrl : o.trackingUrl,
          estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : o.estimatedDelivery
        };
      }
      return o;
    });

    setStorageItem(ORDERS_KEY, updated);
    return { success: true };
  }
};
