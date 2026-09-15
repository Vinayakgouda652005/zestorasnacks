import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { adminService } from '../services/adminService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { contactService } from '../services/contactService';
import { newsletterService } from '../services/newsletterService';
import { authService } from '../services/authService';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  Star,
  Mail,
  Newspaper,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  X,
  RefreshCw,
  LogOut,
  Lock,
  Upload,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

export const AdminPage = () => {
  const { user, login, logout, showToast, navigateTo, products, refreshProducts, addProduct, updateProduct, deleteProduct } = useShop();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(() => adminService.getDashboardStats());
  const [orders, setOrders] = useState(() => orderService.getAll());
  const [customers, setCustomers] = useState(() => adminService.getCustomersWithStats());
  const [reviews, setReviews] = useState(() => reviewService.getAllReviewsList());
  const [messages, setMessages] = useState(() => contactService.getMessages());
  const [subscribers, setSubscribers] = useState(() => newsletterService.getAll());

  // Search & Filters
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status update modal / form
  const [orderStatusForm, setOrderStatusForm] = useState({
    status: '',
    courier: 'Delhivery Express',
    trackingNumber: '',
    trackingUrl: ''
  });

  // Product edit/add modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Delete product confirmation modal state
  const [productToDelete, setProductToDelete] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    price: 199,
    originalPrice: 249,
    category: 'single',
    stock: 50,
    lowStockThreshold: 10,
    ingredients: '100% Pure Natural Fruit. Zero added sugar or preservatives.',
    image: '',
    images: {
      main: '',
      thumbnail: '',
      gallery: []
    }
  });

  // Admin Login Credentials state for non-admin user
  const [adminEmail, setAdminEmail] = useState('admin@zestora.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState('');

  const refreshAllData = () => {
    setStats(adminService.getDashboardStats());
    setOrders(orderService.getAll());
    setCustomers(adminService.getCustomersWithStats());
    setReviews(reviewService.getAllReviewsList());
    setMessages(contactService.getMessages());
    setSubscribers(newsletterService.getAll());
    refreshProducts();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Quick Admin Login
  const handleAdminLogin = (e) => {
    e?.preventDefault();
    setAdminError('');
    const res = login(adminEmail, adminPassword);
    if (!res.success) {
      // If user doesn't exist, create admin and login
      const regRes = authService.register({
        fullName: 'Zestora Store Administrator',
        email: adminEmail,
        password: adminPassword,
        phone: '9880882476',
        role: 'admin'
      });
      if (regRes.success) {
        login(adminEmail, adminPassword);
        showToast('Logged in as Zestora Administrator');
      } else {
        setAdminError(res.error || 'Invalid credentials');
      }
    } else {
      showToast('Welcome to Zestora Administration Console');
    }
  };

  // If user is not admin, show Admin Authentication Gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-4 text-[#193826]">
        <div className="max-w-md w-full bg-[#FAF7F2] border border-[#E8DDCD] p-8 rounded-[2px] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#193826] text-[#C5A869] rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A869] font-semibold">
              Admin Portal
            </span>
            <h1 className="font-serif text-3xl text-[#193826]">
              Zestora Operations
            </h1>
            <p className="text-xs text-[#193826]/70 leading-relaxed">
              Sign in with administrative privileges to manage fruit products, live orders, customer reviews, and inventory.
            </p>
          </div>

          {adminError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-[2px]">
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px] focus:outline-none focus:border-[#193826]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px] focus:outline-none focus:border-[#193826]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px]"
            >
              Sign In to Admin Console
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8DDCD] text-center">
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs text-[#193826]/60 hover:text-[#193826] underline"
            >
              Return to Public Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Order Status Update
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    orderService.updateStatus(orderId, newStatus, `Status updated to ${newStatus} by admin`, {
      courier: orderStatusForm.courier,
      trackingNumber: orderStatusForm.trackingNumber || `DEL${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingUrl: orderStatusForm.trackingUrl || `https://www.delhivery.com/track/package/DEL${Math.floor(10000000 + Math.random() * 90000000)}`
    });
    showToast(`Order ${orderId} status updated to ${newStatus}`);
    refreshAllData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(orderService.getById(orderId));
    }
  };

  // Helper to resize and convert uploaded image file to lightweight Data URL
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Only JPG, PNG, and WEBP image files are allowed.'));
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Scale to max 600x600 for sharp retina display while keeping storage < 35KB
          const MAX_SIZE = 600;
          let { width, height } = img;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Always compress to JPEG at 0.78 quality to guarantee tiny footprint (<35KB) and avoid quota issues
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    setIsUploadingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      setProductForm(prev => {
        const currentGallery = prev.images?.gallery || [];
        const updatedGallery = currentGallery.length > 0 
          ? [dataUrl, ...currentGallery.slice(1)] 
          : [dataUrl];
        return {
          ...prev,
          image: dataUrl,
          images: {
            ...prev.images,
            main: dataUrl,
            thumbnail: dataUrl,
            gallery: updatedGallery
          }
        };
      });
      showToast('Product image uploaded successfully.');
    } catch (err) {
      const msg = err.message || 'Error uploading image.';
      setImageError(msg);
      showToast(msg);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveMainImage = () => {
    setImageError('');
    setProductForm(prev => ({
      ...prev,
      image: '',
      images: {
        ...prev.images,
        main: '',
        thumbnail: '',
        gallery: prev.images?.gallery?.slice(1) || []
      }
    }));
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const urls = [];
      for (const f of files) {
        const u = await processImageFile(f);
        urls.push(u);
      }
      setProductForm(prev => {
        const currentGallery = prev.images?.gallery || (prev.image ? [prev.image] : []);
        const newGallery = [...currentGallery, ...urls].slice(0, 6);
        return {
          ...prev,
          images: {
            ...prev.images,
            gallery: newGallery
          }
        };
      });
      showToast(`Added ${files.length} gallery image(s).`);
    } catch {
      showToast('Error uploading additional images.');
    } finally {
      setIsUploadingImage(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setProductForm(prev => {
      const currentGallery = prev.images?.gallery || [];
      const updated = currentGallery.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: {
          ...prev.images,
          gallery: updated
        }
      };
    });
  };

  // Handle Product Save (Create or Update)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    setImageError('');

    if (!productForm.name || !productForm.name.trim()) {
      showToast('Product name is required.');
      return;
    }

    const currentImage = productForm.image || productForm.images?.main;
    if (!currentImage) {
      setImageError('Please upload a product image.');
      showToast('Please upload a product image.');
      return;
    }

    if (!productForm.price || Number(productForm.price) <= 0) {
      showToast('Please enter a valid product price.');
      return;
    }

    const mainImg = currentImage;
    const thumbImg = productForm.images?.thumbnail || mainImg;
    const galleryImgs = Array.isArray(productForm.images?.gallery) && productForm.images.gallery.length > 0
      ? productForm.images.gallery
      : [mainImg];

    const payload = {
      ...productForm,
      name: productForm.name.trim(),
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Math.round(Number(productForm.price) * 1.25),
      stock: Number(productForm.stock) !== undefined && productForm.stock !== '' ? Number(productForm.stock) : 50,
      lowStockThreshold: Number(productForm.lowStockThreshold) || 10,
      image: mainImg,
      images: {
        main: mainImg,
        thumbnail: thumbImg,
        gallery: galleryImgs
      }
    };

    if (editingProduct) {
      if (updateProduct) {
        updateProduct(editingProduct.id, payload);
      } else {
        productService.updateProduct(editingProduct.id, payload);
      }
      showToast(`Product "${productForm.name}" updated successfully.`);
    } else {
      if (addProduct) {
        addProduct(payload);
      } else {
        productService.addProduct(payload);
      }
      showToast(`Product "${productForm.name}" added to catalog.`);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    refreshAllData();
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setImageError('');
    const mainImg = prod.image || prod.images?.main || prod.images?.thumbnail || '';
    const galleryImgs = Array.isArray(prod.images?.gallery) && prod.images.gallery.length > 0
      ? prod.images.gallery
      : (mainImg ? [mainImg] : []);

    setProductForm({
      name: prod.name || '',
      slug: prod.slug || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      price: prod.price || 199,
      originalPrice: prod.originalPrice || Math.round((prod.price || 199) * 1.25),
      category: prod.category || 'single',
      stock: prod.stock !== undefined ? prod.stock : 50,
      lowStockThreshold: prod.lowStockThreshold || 10,
      ingredients: prod.ingredients || '100% Pure Natural Fruit. Zero preservatives.',
      image: mainImg,
      images: {
        main: mainImg,
        thumbnail: prod.images?.thumbnail || mainImg,
        gallery: galleryImgs
      }
    });
    setIsProductModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setImageError('');
    setProductForm({
      name: '',
      slug: '',
      tagline: 'Naturally Sweet & Crunchy.',
      description: 'Slow dehydrated fruit with zero added sugar and zero preservatives.',
      price: 199,
      originalPrice: 249,
      category: 'single',
      stock: 50,
      lowStockThreshold: 10,
      ingredients: '100% Pure Fruit.',
      image: '',
      images: {
        main: '',
        thumbnail: '',
        gallery: []
      }
    });
    setIsProductModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const prodName = productToDelete.name;
    deleteProduct(productToDelete.id);
    showToast(`Product "${prodName}" deleted.`);
    setProductToDelete(null);
    refreshAllData();
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const statusNormalized = (o.status || '').toLowerCase();
    const filterNormalized = orderFilter.toLowerCase();
    const matchesFilter = filterNormalized === 'all' ||
      (filterNormalized === 'pending'
        ? (statusNormalized === 'pending' || statusNormalized === 'placed')
        : statusNormalized === filterNormalized);
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      (o.customer?.fullName || '').toLowerCase().includes(q) ||
      (o.customer?.phone || '').includes(q) ||
      (o.customer?.email || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#FBF8F2] min-h-screen text-[#193826]">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#193826] text-[#FBF8F2] border-b border-[#12291C] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-xl tracking-wider font-bold text-[#FBF8F2]">
              ZESTORA
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] bg-[#C5A869] text-[#193826] px-2 py-0.5 font-bold rounded-[2px]">
              Admin Operations
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => navigateTo('shop')}
              className="text-[#FBF8F2]/70 hover:text-[#FBF8F2] flex items-center gap-1 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <span className="text-[#FBF8F2]/30">|</span>

            <div className="flex items-center space-x-2">
              <span className="text-[#FBF8F2]/80">{user.fullName}</span>
              <button
                onClick={() => {
                  logout();
                  navigateTo('shop');
                }}
                className="p-1.5 bg-[#12291C] hover:bg-red-900/60 rounded-[2px] text-[#FBF8F2]/80 hover:text-red-200 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E8DDCD]">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
            { id: 'newsletter', label: `Subscribers (${subscribers.length})`, icon: Newspaper }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shrink-0 rounded-[2px] ${
                  isActive
                    ? 'bg-[#193826] text-[#FBF8F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#193826]/70 hover:text-[#193826] border border-[#E8DDCD]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================
            TAB 1: OVERVIEW DASHBOARD
            ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Stat Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px]">
                <div className="flex items-center justify-between text-xs text-[#193826]/70 mb-2">
                  <span className="uppercase tracking-wider font-semibold">Total Revenue</span>
                  <TrendingUp className="w-4 h-4 text-[#255038]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#193826]">
                  ₹{stats.totalSales.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#255038] font-medium block mt-1">
                  From {stats.totalOrders} customer orders
                </span>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px]">
                <div className="flex items-center justify-between text-xs text-[#193826]/70 mb-2">
                  <span className="uppercase tracking-wider font-semibold">Pending Fulfillment</span>
                  <Clock className="w-4 h-4 text-[#C5A869]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#193826]">
                  {stats.pendingOrders}
                </div>
                <span className="text-[11px] text-[#193826]/60 block mt-1">
                  Awaiting courier dispatch
                </span>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px]">
                <div className="flex items-center justify-between text-xs text-[#193826]/70 mb-2">
                  <span className="uppercase tracking-wider font-semibold">Total Customers</span>
                  <Users className="w-4 h-4 text-[#193826]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#193826]">
                  {stats.totalCustomers}
                </div>
                <span className="text-[11px] text-[#193826]/60 block mt-1">
                  Verified user accounts
                </span>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px]">
                <div className="flex items-center justify-between text-xs text-[#193826]/70 mb-2">
                  <span className="uppercase tracking-wider font-semibold">Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className={`font-serif text-3xl font-bold ${stats.lowStockProducts > 0 ? 'text-amber-700' : 'text-[#193826]'}`}>
                  {stats.lowStockProducts}
                </div>
                <span className="text-[11px] text-[#193826]/60 block mt-1">
                  Products below threshold
                </span>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg text-[#193826] font-semibold">Operational Quick Actions</h3>
                <p className="text-xs text-[#193826]/70">Shortcuts to daily warehouse, catalog, and customer workflows</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all flex items-center gap-1.5 rounded-[2px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#E8DDCD] text-xs uppercase tracking-wider font-semibold text-[#193826] hover:bg-[#FAF7F2] transition-all flex items-center gap-1.5 rounded-[2px]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Review Orders</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="p-5 border-b border-[#E8DDCD] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#193826]">Recent Customer Orders</h3>
                  <p className="text-xs text-[#193826]/70">Latest fruit parcels submitted across India</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#193826] hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="p-4 font-mono font-semibold">{ord.id}</td>
                        <td className="p-4">
                          <strong className="block">{ord.customer?.fullName}</strong>
                          <span className="text-[11px] text-[#193826]/60">{ord.customer?.phone}</span>
                        </td>
                        <td className="p-4 text-[#193826]/70">{ord.date}</td>
                        <td className="p-4 font-semibold">₹{ord.total}</td>
                        <td className="p-4 uppercase text-[10px] font-semibold tracking-wider">
                          {ord.paymentMethod === 'upi_qr' ? 'UPI QR' : 'Cash on Delivery'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded-[2px] uppercase text-[9px] tracking-wider font-semibold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'confirmed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setOrderStatusForm({
                                status: ord.status,
                                courier: ord.tracking?.courier || 'Delhivery Express',
                                trackingNumber: ord.tracking?.trackingNumber || '',
                                trackingUrl: ord.tracking?.trackingUrl || ''
                              });
                            }}
                            className="p-1.5 hover:bg-[#E8DDCD] rounded-[2px] transition-colors text-[#193826]"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 2: PRODUCTS MANAGEMENT
            ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#193826]">Product Catalog</h2>
                <p className="text-xs text-[#193826]/70">Manage fruit snack items, pricing, images, and descriptions</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all flex items-center gap-1.5 rounded-[2px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fruit</span>
              </button>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Fruit</th>
                      <th className="p-4">SKU / Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FFFFFF] border border-[#E8DDCD] p-1 rounded-[2px] flex items-center justify-center shrink-0">
                              <img
                                src={prod.images?.thumbnail || prod.images?.main || prod.image || '/assets/products/dried-mango.png'}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <strong className="font-serif text-sm block">{prod.name}</strong>
                              <span className="text-[11px] text-[#193826]/60 line-clamp-1">{prod.tagline}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#193826]/70">
                          {prod.sku || prod.slug}
                        </td>
                        <td className="p-4 uppercase text-[10px] font-semibold">
                          {prod.category}
                        </td>
                        <td className="p-4 font-bold text-sm">
                          ₹{prod.price}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block font-semibold ${
                            (prod.stock || 0) <= (prod.lowStockThreshold || 10) ? 'text-amber-700' : 'text-[#193826]'
                          }`}>
                            {prod.stock || 0} units
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              productService.toggleActive(prod.id);
                              refreshAllData();
                            }}
                            className={`px-2 py-0.5 rounded-[2px] text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                              prod.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {prod.isActive !== false ? 'Active' : 'Draft'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            id={`admin-edit-product-${prod.id}`}
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 hover:bg-[#E8DDCD] rounded-[2px] text-[#193826] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`admin-delete-product-${prod.id}`}
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 hover:bg-red-50 rounded-[2px] text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: INVENTORY MANAGEMENT
            ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#193826]">Inventory & Warehouse Stock</h2>
                <p className="text-xs text-[#193826]/70">Adjust real-time pouch quantities and monitor low-stock thresholds</p>
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Fruit Snack</th>
                      <th className="p-4">Weight Pack</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Threshold</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {products.map((prod) => {
                      const stock = prod.stock || 0;
                      const threshold = prod.lowStockThreshold || 10;
                      const isLow = stock <= threshold && stock > 0;
                      const isOut = stock === 0;

                      return (
                        <tr key={prod.id} className="hover:bg-[#FFFFFF] transition-colors">
                          <td className="p-4">
                            <strong className="block font-serif text-sm">{prod.name}</strong>
                            <span className="text-[11px] text-[#193826]/60">{prod.sku}</span>
                          </td>
                          <td className="p-4 text-[#193826]/70">
                            {prod.defaultWeight || '40g'}
                          </td>
                          <td className="p-4 font-mono font-bold text-sm">
                            {stock} pouches
                          </td>
                          <td className="p-4 text-[#193826]/70">
                            {threshold} units
                          </td>
                          <td className="p-4">
                            {isOut ? (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] uppercase tracking-wider font-semibold rounded-[2px]">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-semibold rounded-[2px]">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-semibold rounded-[2px]">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                productService.adjustStock(prod.id, -5);
                                refreshAllData();
                              }}
                              className="px-2 py-1 bg-[#E8DDCD] hover:bg-[#D8CABB] text-[11px] font-semibold text-[#193826] rounded-[2px]"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => {
                                productService.adjustStock(prod.id, 10);
                                refreshAllData();
                                showToast(`Added 10 units to ${prod.name}`);
                              }}
                              className="px-2.5 py-1 bg-[#193826] hover:bg-[#12291C] text-[11px] font-semibold text-[#FBF8F2] rounded-[2px]"
                            >
                              +10 Restock
                            </button>
                            <button
                              onClick={() => {
                                productService.adjustStock(prod.id, 50);
                                refreshAllData();
                                showToast(`Added 50 units batch to ${prod.name}`);
                              }}
                              className="px-2.5 py-1 bg-[#C5A869] hover:bg-[#B39657] text-[11px] font-semibold text-[#193826] rounded-[2px]"
                            >
                              +50 Batch
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: ORDERS MANAGEMENT
            ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#193826]">Customer Orders ({filteredOrders.length})</h2>
                <p className="text-xs text-[#193826]/70">Track payment verifications, dispatch waybills, and delivery stages</p>
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-[2px] uppercase text-[10px] tracking-wider font-semibold transition-all shrink-0 ${
                      orderFilter === st
                        ? 'bg-[#193826] text-[#FBF8F2]'
                        : 'bg-[#FAF7F2] border border-[#E8DDCD] text-[#193826]/70 hover:text-[#193826]'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#193826]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. ZST-), Customer Name, Phone number, or Email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DDCD] pl-10 pr-4 py-2.5 text-xs text-[#193826] rounded-[2px] focus:outline-none focus:border-[#193826]"
              />
            </div>

            {/* Orders Table */}
            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-xs text-[#193826]/60">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FFFFFF] transition-colors">
                          <td className="p-4 font-mono font-bold">{ord.id}</td>
                          <td className="p-4">
                            <strong className="block">{ord.customer?.fullName}</strong>
                            <span className="text-[11px] text-[#193826]/60">{ord.customer?.phone}</span>
                          </td>
                          <td className="p-4 text-[#193826]/70 max-w-xs truncate">
                            {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{ord.items?.length || 0} items</span>
                          </td>
                          <td className="p-4 font-bold text-sm">
                            ₹{ord.total}
                          </td>
                          <td className="p-4">
                            <span className="uppercase text-[10px] font-semibold block">
                              {ord.paymentMethod === 'upi_qr' ? 'UPI' : 'COD'}
                            </span>
                            {ord.paymentDetails?.upiRefNumber && (
                              <span className="font-mono text-[9px] text-[#193826]/60 block truncate max-w-[100px]">
                                UTR: {ord.paymentDetails.upiRefNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded-[2px] uppercase text-[9px] tracking-wider font-semibold ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'confirmed'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setOrderStatusForm({
                                  status: ord.status,
                                  courier: ord.tracking?.courier || 'Delhivery Express',
                                  trackingNumber: ord.tracking?.trackingNumber || '',
                                  trackingUrl: ord.tracking?.trackingUrl || ''
                                });
                              }}
                              className="px-3 py-1 bg-[#193826] text-[#FBF8F2] text-[11px] font-semibold hover:bg-[#12291C] transition-colors rounded-[2px]"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CUSTOMERS MANAGEMENT
            ========================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#193826]">Customer Profiles ({customers.length})</h2>
              <p className="text-xs text-[#193826]/70">Registered customer directory, order counts, and lifetime spends</p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="p-4">
                          <strong className="block font-serif text-sm">{cust.fullName}</strong>
                          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-medium">Customer</span>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <span className="block text-[#193826]">{cust.email}</span>
                          <span className="block text-[11px] text-[#193826]/60">{cust.phone || 'No phone'}</span>
                        </td>
                        <td className="p-4 text-[#193826]/70">
                          {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                        <td className="p-4 font-semibold">
                          {cust.orderCount} orders
                        </td>
                        <td className="p-4 font-bold text-sm text-[#255038]">
                          ₹{cust.totalSpent}
                        </td>
                        <td className="p-4 text-[#193826]/70">
                          {cust.lastOrderDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: REVIEWS MODERATION
            ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#193826]">Customer Reviews ({reviews.length})</h2>
              <p className="text-xs text-[#193826]/70">Moderate feedback, approve reviews, and toggle verified purchase badges</p>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px] flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#C5A869]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#C5A869]' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-xs text-[#193826]">{rev.customerName}</span>
                      <span className="text-[10px] text-[#193826]/50">on {rev.reviewDate}</span>

                      {rev.verifiedBuyer && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] uppercase tracking-wider font-semibold rounded-[2px]">
                          Verified Buyer
                        </span>
                      )}

                      <span className="text-[11px] text-[#C5A869] font-medium ml-2">
                        Product: {rev.productId}
                      </span>
                    </div>

                    <p className="text-xs text-[#193826]/85 italic leading-relaxed">
                      "{rev.reviewText}"
                    </p>

                    {rev.image && (
                      <div className="w-16 h-16 border border-[#E8DDCD] rounded-[2px] overflow-hidden">
                        <img src={rev.image} alt="Review upload" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] uppercase tracking-wider font-semibold ${
                      rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {rev.status || 'approved'}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const next = rev.status === 'approved' ? 'hidden' : 'approved';
                          reviewService.updateReviewStatus(rev.productId, rev.id, next);
                          refreshAllData();
                        }}
                        className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E8DDCD] hover:bg-[#E8DDCD] text-[11px] text-[#193826] rounded-[2px]"
                      >
                        {rev.status === 'approved' ? 'Hide' : 'Approve'}
                      </button>

                      <button
                        onClick={() => {
                          reviewService.deleteReview(rev.productId, rev.id);
                          showToast('Review removed.');
                          refreshAllData();
                        }}
                        className="p-1 hover:bg-red-50 text-red-600 rounded-[2px]"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: MESSAGES & CONTACT FORM INQUIRIES
            ========================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#193826]">Customer Inquiries ({messages.length})</h2>
              <p className="text-xs text-[#193826]/70">Inquiries submitted through the Contact Us page</p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 bg-[#FAF7F2] border border-[#E8DDCD] text-center text-xs text-[#193826]/60 rounded-[2px]">
                  No inquiries received yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#FAF7F2] border border-[#E8DDCD] p-5 rounded-[2px] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-serif">{msg.name}</strong>
                        <span className="text-xs text-[#193826]/60">({msg.email})</span>
                        <span className="text-xs text-[#193826]/50">• {msg.phone || 'No phone'}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-[2px] uppercase text-[9px] tracking-wider font-semibold ${
                        msg.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {msg.status || 'new'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#193826]">
                      Subject: {msg.subject}
                    </div>

                    <p className="text-xs text-[#193826]/80 bg-[#FFFFFF] p-3 border border-[#E8DDCD] rounded-[2px] leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-[#193826]/60">
                      <span>Received on {msg.date}</span>
                      <button
                        onClick={() => {
                          contactService.updateStatus(msg.id, msg.status === 'resolved' ? 'new' : 'resolved');
                          refreshAllData();
                        }}
                        className="px-3 py-1 bg-[#193826] text-[#FBF8F2] hover:bg-[#12291C] rounded-[2px] font-semibold"
                      >
                        {msg.status === 'resolved' ? 'Reopen' : 'Mark as Resolved'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 8: NEWSLETTER SUBSCRIBERS
            ========================================================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#193826]">VIP Pantry Newsletter List ({subscribers.length})</h2>
                <p className="text-xs text-[#193826]/70">Customers subscribed to fruit harvest updates and VIP discounts</p>
              </div>

              <button
                onClick={() => {
                  const csv = newsletterService.exportCSV();
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `zestora_subscribers_${Date.now()}.csv`;
                  a.click();
                  showToast('Newsletter CSV downloaded.');
                }}
                className="px-4 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] transition-all flex items-center gap-1.5 rounded-[2px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DDCD] rounded-[2px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#193826]">
                  <thead className="bg-[#F5EFEB] border-b border-[#E8DDCD] uppercase tracking-wider text-[11px] text-[#193826]/70">
                    <tr>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Subscription Date</th>
                      <th className="p-4">Source</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDCD]">
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="p-4 font-medium">{sub.email}</td>
                        <td className="p-4 text-[#193826]/70">{sub.date}</td>
                        <td className="p-4 text-[11px] text-[#C5A869] font-medium uppercase tracking-wider">
                          {sub.source || 'Storefront Footer'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              newsletterService.unsubscribe(sub.email);
                              refreshAllData();
                            }}
                            className="p-1 hover:bg-red-50 text-red-600 rounded-[2px]"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================
          ORDER DETAILS & STATUS UPDATE MODAL
          ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[2px] shadow-2xl z-10 space-y-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E8DDCD] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A869] font-bold">
                Order Management
              </span>
              <h3 className="font-serif text-2xl text-[#193826]">
                Order {selectedOrder.id}
              </h3>
              <p className="text-xs text-[#193826]/70">
                Placed on {selectedOrder.date} by {selectedOrder.customer?.fullName}
              </p>
            </div>

            {/* Status Update Control */}
            <div className="p-4 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#193826] block">
                Update Fulfillment Status & Tracking
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#193826]/70 mb-1">Status</label>
                  <select
                    value={orderStatusForm.status}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, status: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] rounded-[2px]"
                  >
                    <option value="pending">PENDING (Awaiting Confirmation)</option>
                    <option value="confirmed">CONFIRMED (Order Confirmed)</option>
                    <option value="processing">PROCESSING (Picking Sun-Ripened Fruits)</option>
                    <option value="packed">PACKED (Sealed in Tamper-Proof Pouch)</option>
                    <option value="shipped">SHIPPED (Handed to Logistics)</option>
                    <option value="out_for_delivery">OUT FOR DELIVERY (Rider in City)</option>
                    <option value="delivered">DELIVERED (Successfully Handed Over)</option>
                    <option value="cancelled">CANCELLED</option>
                    <option value="refunded">REFUNDED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#193826]/70 mb-1">Express Courier</label>
                  <input
                    type="text"
                    value={orderStatusForm.courier}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, courier: e.target.value })}
                    placeholder="e.g. Delhivery Express"
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] rounded-[2px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-[#193826]/70 mb-1">Tracking Waybill / AWB #</label>
                  <input
                    type="text"
                    value={orderStatusForm.trackingNumber}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingNumber: e.target.value })}
                    placeholder="e.g. DEL72819283"
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] rounded-[2px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, orderStatusForm.status)}
                  className="px-4 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#12291C] rounded-[2px]"
                >
                  Save & Notify Customer
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] space-y-1">
                <strong className="text-[#193826] block">Customer Contact</strong>
                <p className="text-[#193826]/70">{selectedOrder.customer?.fullName}</p>
                <p className="text-[#193826]/70">{selectedOrder.customer?.email}</p>
                <p className="text-[#193826]/70">+91 {selectedOrder.customer?.phone}</p>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] space-y-1">
                <strong className="text-[#193826] block">Delivery Address</strong>
                <p className="text-[#193826]/70">
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.apartment && `${selectedOrder.shippingAddress?.apartment}, `}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - <strong>{selectedOrder.shippingAddress?.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-[#193826] block">
                Items ({selectedOrder.items?.length})
              </strong>
              <div className="divide-y divide-[#E8DDCD] border border-[#E8DDCD] bg-[#FFFFFF] rounded-[2px]">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF7F2] border border-[#E8DDCD] p-1 flex items-center justify-center">
                        <img
                          src={it.product?.images?.thumbnail || it.product?.images?.main}
                          alt={it.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <strong className="font-serif block">{it.product?.name}</strong>
                        <span className="text-[11px] text-[#193826]/60">
                          {it.selectedWeight} × {it.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#193826]">
                      ₹{it.unitPrice * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment info */}
            <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#193826]/60 block">Payment Method</span>
                <strong className="uppercase">{selectedOrder.paymentMethod === 'upi_qr' ? 'UPI QR' : 'Cash on Delivery'}</strong>
                {selectedOrder.paymentDetails?.upiRefNumber && (
                  <span className="font-mono text-[11px] text-[#193826] block mt-0.5">
                    UTR: {selectedOrder.paymentDetails.upiRefNumber}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[#193826]/60 block">Total Amount</span>
                <span className="font-serif text-xl font-bold text-[#193826]">
                  ₹{selectedOrder.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT ADD / EDIT MODAL
          ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[2px] shadow-2xl z-10 space-y-6">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E8DDCD] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A869] font-bold">
                Fruit Catalog
              </span>
              <h3 className="font-serif text-2xl text-[#193826]">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Fruit Snack'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Dried Alphonso Mango"
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                />
              </div>

              {/* Product Image File Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block uppercase tracking-wider font-semibold text-[#193826]">
                    Product Image *
                  </label>
                  <span className="text-[10px] text-[#193826]/60">JPG, PNG, WEBP</span>
                </div>

                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  id="admin-product-image-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMainImageUpload}
                  className="hidden"
                />

                {/* Preview or Upload Drop Area */}
                {(productForm.image || productForm.images?.main) ? (
                  <div className="border border-[#E8DDCD] bg-[#FFFFFF] p-3 rounded-[2px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={productForm.image || productForm.images?.main}
                          alt="Product Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-[#193826] block truncate">
                          {editingProduct ? 'Current Product Image' : 'Uploaded Photo'}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Image attached
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        id="replace-product-image-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-3 py-1.5 border border-[#193826]/30 hover:border-[#193826] text-[#193826] text-[11px] uppercase tracking-wider font-semibold rounded-[2px] transition-colors"
                      >
                        {isUploadingImage ? 'Loading...' : 'Replace'}
                      </button>
                      <button
                        type="button"
                        id="remove-product-image-btn"
                        onClick={handleRemoveMainImage}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-[2px] transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    id="admin-product-image-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed ${
                      imageError ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDCD] hover:border-[#193826] bg-[#FFFFFF]'
                    } p-5 text-center cursor-pointer rounded-[2px] transition-colors`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto mb-2 text-[#193826]/70">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#193826]">
                      {isUploadingImage ? 'Reading image...' : 'Click to browse & upload product image'}
                    </p>
                    <p className="text-[11px] text-[#193826]/60 mt-0.5">
                      Supports JPG, PNG, and WEBP formats
                    </p>
                    <button
                      type="button"
                      className="mt-2.5 px-3.5 py-1.5 bg-[#193826] text-[#FBF8F2] text-[11px] uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#12291C]"
                    >
                      Choose Image File
                    </button>

                    <div className="mt-3.5 pt-3 border-t border-[#E8DDCD] flex items-center gap-2 text-left" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] uppercase font-semibold text-[#193826]/70 shrink-0">Or Image URL:</span>
                      <input
                        type="url"
                        placeholder="https://... (or /assets/products/...)"
                        value={productForm.image && !productForm.image.startsWith('data:') ? productForm.image : ''}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setProductForm(prev => ({
                            ...prev,
                            image: val,
                            images: {
                              ...prev.images,
                              main: val,
                              thumbnail: val,
                              gallery: val ? [val] : []
                            }
                          }));
                          if (val) setImageError('');
                        }}
                        className="flex-1 bg-[#FFFFFF] border border-[#E8DDCD] px-2.5 py-1 text-xs text-[#193826] rounded-[2px]"
                      />
                    </div>
                  </div>
                )}

                {imageError && (
                  <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {imageError}
                  </p>
                )}
              </div>

              {/* Additional Gallery Photos (Optional) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block uppercase tracking-wider font-semibold text-[#193826]/80 text-[10px]">
                    Additional Gallery Photos (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="text-[11px] text-[#C5A869] hover:text-[#193826] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Extra Photos
                  </button>
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />

                {Array.isArray(productForm.images?.gallery) && productForm.images.gallery.length > 1 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {productForm.images.gallery.slice(1).map((imgUrl, idx) => (
                      <div key={idx} className="relative w-12 h-12 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] p-0.5 overflow-hidden group">
                        <img src={imgUrl} alt={`Extra ${idx + 1}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx + 1)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
                          title="Remove"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] rounded-[2px]"
                  >
                    <option value="single">Single Origin Fruit</option>
                    <option value="chips">Crispy Fruit Chips</option>
                    <option value="bundle">Tasting Gift Boxes & Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Initial Stock (Pouches)
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="e.g. Naturally Sweet & Chewy."
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] rounded-[2px]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8DDCD] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826] rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] rounded-[2px]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE PRODUCT CONFIRMATION DIALOG / MODAL
          ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-md w-full p-6 sm:p-7 rounded-[2px] shadow-2xl z-10 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#193826] font-semibold">
                  Delete Product
                </h3>
                <p className="text-xs text-[#193826]/80 mt-1">
                  Are you sure you want to delete this product?
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FFFFFF] border border-[#E8DDCD] rounded-[2px] flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F5EFEB] border border-[#E8DDCD] rounded-[2px] p-1 flex items-center justify-center shrink-0">
                <img
                  src={productToDelete.images?.thumbnail || productToDelete.images?.main || productToDelete.image || '/assets/products/dried-mango.png'}
                  alt={productToDelete.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif text-sm font-semibold text-[#193826] truncate">
                  {productToDelete.name}
                </h4>
                <p className="text-[11px] text-[#193826]/60">
                  ₹{productToDelete.price} &bull; {productToDelete.category}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#193826]/70 leading-relaxed">
              This will remove the product from the active catalog and customer shop. Past customer orders containing this item will be safely preserved.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                id="cancel-delete-product-btn"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-[#E8DDCD] text-xs uppercase tracking-wider font-semibold text-[#193826] hover:bg-[#F5EFEB] rounded-[2px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-product-btn"
                onClick={handleConfirmDeleteProduct}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold rounded-[2px] shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
