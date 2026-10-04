import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, Product } from '../../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  QrCode, 
  Truck, 
  Sliders, 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Phone, 
  MapPin, 
  Mail, 
  Sparkles,
  ChevronRight,
  LogOut,
  Upload,
  Eye,
  Store,
  ArrowUpRight,
  FileText,
  Paperclip,
  File,
  Download
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    paymentConfig, 
    updatePaymentConfig, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    refreshOrders, 
    updateOrderStatus, 
    assignDeliveryAgent,
    deliveryAgents, 
    addDeliveryAgent, 
    setActiveView, 
    isAdminLoggedIn, 
    adminLogin, 
    adminLogout 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'payments' | 'delivery' | 'settings'>('overview');
  
  // Auth state
  const [adminEmail, setAdminEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Orders Tab filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    discountBadge: '-20%',
    image: '',
    description: '',
    variants: 'Standard, Deluxe',
    isDailyDeal: false,
    isPopular: false,
    isLimitedDrop: false,
    stockLeft: 100,
  });

  // Delivery agent modal state
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: '',
    phone: '',
    zone: 'Metro City Center',
    vehicle: 'Express Bike',
    status: 'active' as const,
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Payment form
  const [paymentForm, setPaymentForm] = useState({ ...paymentConfig });
  const [savePaymentSuccess, setSavePaymentSuccess] = useState(false);

  const handlePaymentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const isImage = file.type.startsWith('image/');

      setPaymentForm(prev => ({
        ...prev,
        customUploadedFile: {
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: dataUrl,
        },
        upiQrImageUrl: isImage ? dataUrl : prev.upiQrImageUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePaymentFile = () => {
    setPaymentForm(prev => ({
      ...prev,
      customUploadedFile: null,
    }));
  };

  // Handle Login
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-black/5 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <LayoutDashboard className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Log in to manage Cash on Delivery orders, products, and website templates.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const success = adminLogin(adminEmail, loginPassword);
            if (!success) setLoginError(true);
          }} className="space-y-3.5 text-left">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  setLoginError(false);
                }}
                className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginError(false);
                }}
                className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition font-medium"
              />
              {loginError && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  Invalid administrator email or password.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold text-sm py-3 rounded-xl transition shadow-sm cursor-pointer mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end text-xs text-gray-400">
            <button
              onClick={() => setActiveView('store')}
              className="text-gray-600 hover:text-black font-semibold flex items-center gap-1"
            >
              <span>Back to Store</span>
              <span>&rarr;</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Statistics Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const outForDeliveryOrders = orders.filter(o => o.status === 'out_for_delivery').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const deliveredCashRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.product_name && o.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><Check className="w-3 h-3" /> Confirmed</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><Package className="w-3 h-3" /> Shipped</span>;
      case 'out_for_delivery':
        return <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  // Product form handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      discountBadge: '-20%',
      image: '',
      description: '',
      variants: 'Standard, Deluxe',
      isDailyDeal: false,
      isPopular: false,
      isLimitedDrop: false,
      stockLeft: 100,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: String(prod.price),
      originalPrice: String(prod.originalPrice),
      discountBadge: prod.discountBadge,
      image: prod.image,
      description: prod.description,
      variants: prod.variants.join(', '),
      isDailyDeal: !!prod.isDailyDeal,
      isPopular: !!prod.isPopular,
      isLimitedDrop: !!prod.isLimitedDrop,
      stockLeft: prod.stockLeft || 100,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(productForm.price) || 29.99;
    const parsedOriginal = parseFloat(productForm.originalPrice) || parsedPrice * 1.5;
    const variantArray = productForm.variants.split(',').map(v => v.trim()).filter(Boolean);

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: parsedPrice,
      originalPrice: parsedOriginal,
      rating: 4.9,
      reviewCount: 120,
      discountBadge: productForm.discountBadge || `-${Math.round(((parsedOriginal - parsedPrice) / parsedOriginal) * 100)}%`,
      image: productForm.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      description: productForm.description,
      variants: variantArray.length > 0 ? variantArray : ['Standard'],
      isDailyDeal: productForm.isDailyDeal,
      isPopular: productForm.isPopular,
      isLimitedDrop: productForm.isLimitedDrop,
      stockLeft: Number(productForm.stockLeft) || 100,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Save Payments
  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig(paymentForm);
    setSavePaymentSuccess(true);
    setTimeout(() => setSavePaymentSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 flex flex-col font-sans">
      
      {/* Apple-style Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/5 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm shadow-xs">
            
          </div>
          <div>
            <h1 className="font-bold text-base text-gray-900 leading-tight flex items-center gap-2">
              <span>{settings.storeName} Admin SaaS</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Live Supabase Connected
              </span>
            </h1>
            <p className="text-[11px] text-gray-500">
              Cash on Delivery (COD) Operations & Website Customizer
            </p>
          </div>
        </div>

        {/* Top Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer Storefront</span>
          </button>

          <button
            onClick={() => setActiveView('delivery')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Delivery Boy Portal</span>
          </button>

          <button
            onClick={adminLogout}
            className="text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col gap-6">
        
        {/* Apple-style Segmented Navigation Bar */}
        <div className="flex overflow-x-auto p-1 bg-black/5 rounded-2xl w-full sm:w-max self-start scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>COD Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products & Deals</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Payment & QR</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery Boys</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Website Customizer</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW & STATS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-gray-500">Total COD Volume</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    $
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
                  {settings.currencySymbol}{totalRevenue.toFixed(2)}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <span>Delivered Cash: {settings.currencySymbol}{deliveredCashRevenue.toFixed(2)}</span>
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-gray-500">Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
                  {totalOrders}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Across all delivery sectors
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-gray-500">Pending Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 tabular-nums">
                  {pendingOrders}
                </div>
                <p className="text-[11px] text-amber-700 font-semibold mt-2">
                  Awaiting dispatch / confirmation
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-gray-500">In Transit & Delivered</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
                  {deliveredOrders + outForDeliveryOrders}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  {outForDeliveryOrders} on road · {deliveredOrders} delivered
                </p>
              </div>

            </div>

            {/* Quick Status Bar & Recent Orders */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Customer Orders</h3>
                  <p className="text-xs text-gray-500">Live feed from Supabase database table `orders`</p>
                </div>
                <button
                  onClick={refreshOrders}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Supabase</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                      <th className="pb-3">Order ID / Date</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Product & Variant</th>
                      <th className="pb-3">Total (COD)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Quick Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 font-mono text-gray-600">
                          <span className="font-bold text-gray-900">{order.id.slice(0, 12)}</span>
                          <span className="block text-[10px] text-gray-400">
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-gray-900">{order.customer_name}</span>
                          <span className="block text-[10px] text-gray-500">{order.city} · {order.phone}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="font-semibold text-gray-900">{order.product_name}</span>
                          <span className="block text-[10px] text-gray-500">
                            Qty: {order.quantity} · {order.product_variant}
                          </span>
                        </td>
                        <td className="py-3.5 font-black text-gray-900 tabular-nums">
                          {settings.currencySymbol}{Number(order.total_amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3.5 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none focus:border-black"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-black hover:underline"
                >
                  View all {orders.length} orders &rarr;
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
            
            {/* Header, Search & Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-gray-900">Manage COD Orders</h3>
                <p className="text-xs text-gray-500">
                  Search by customer, address, or phone. Update delivery statuses in real-time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, city..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-black transition"
                  />
                </div>

                {/* Filter Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-black"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={refreshOrders}
                  className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                    <th className="pb-3">Order ID / Created</th>
                    <th className="pb-3">Customer Details</th>
                    <th className="pb-3">Address & City</th>
                    <th className="pb-3">Product & Qty</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Delivery Agent</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-400">
                        No orders match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 font-mono text-gray-600">
                          <span className="font-bold text-gray-900">{order.id.slice(0, 14)}</span>
                          <span className="block text-[10px] text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <div className="font-bold text-gray-900">{order.customer_name}</div>
                          <a 
                            href={`tel:${order.phone}`} 
                            className="text-purple-700 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Phone className="w-3 h-3" /> {order.phone}
                          </a>
                          {order.email && <span className="text-[10px] text-gray-400">{order.email}</span>}
                        </td>
                        <td className="py-3.5 max-w-xs">
                          <span className="font-semibold text-gray-800">{order.city}</span>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{order.address}</p>
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-gray-900">{order.product_name}</span>
                          <span className="block text-[11px] text-gray-500">
                            {order.quantity}x ({order.product_variant})
                          </span>
                        </td>
                        <td className="py-3.5 font-black text-gray-900 tabular-nums">
                          {settings.currencySymbol}{Number(order.total_amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <select
                            value={order.delivery_agent_id || ''}
                            onChange={(e) => assignDeliveryAgent(order.id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] outline-none"
                          >
                            <option value="">Unassigned</option>
                            {deliveryAgents.map(a => (
                              <option key={a.id} value={a.id}>{a.name} ({a.zone})</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-black shadow-2xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrderForDetail(order)}
                            className="text-xs font-bold text-black hover:bg-gray-100 px-2.5 py-1 rounded-lg transition"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================= TAB 3: PRODUCTS & STORE CATALOG ================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-gray-900">Website Product Catalog</h3>
                <p className="text-xs text-gray-500">
                  Add, edit, or customize any product shown to customers. Updates automatically on client devices.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-gray-200/90 rounded-2xl p-4 flex gap-4 bg-gray-50/50 hover:bg-white hover:shadow-md transition group"
                >
                  <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1 text-gray-400 hover:text-black transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.name}"?`)) deleteProduct(prod.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{prod.description}</p>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-gray-900 tabular-nums">
                          {settings.currencySymbol}{prod.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through tabular-nums">
                          {settings.currencySymbol}{prod.originalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex gap-1 text-[10px] font-bold">
                        {prod.isDailyDeal && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Daily Deal</span>}
                        {prod.isPopular && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Popular</span>}
                        {prod.isLimitedDrop && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Drop</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: PAYMENT & CUSTOM QR ================= */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6 max-w-4xl">
            
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900">Custom Payment & QR Code Manager</h3>
              <p className="text-xs text-gray-500">
                Configure all payment methods, upload custom merchant QR code, and customize cash on delivery rules.
              </p>
            </div>

            {savePaymentSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment configuration saved & synchronized across customer devices!</span>
              </div>
            )}

            <form onSubmit={handleSavePayments} className="space-y-6">
              
              {/* Payment Methods Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                    <input
                      type="checkbox"
                      checked={paymentForm.enableCod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, enableCod: e.target.checked })}
                      className="w-4 h-4 accent-black"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enable doorstep cash/card collection on delivery.</p>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">COD Extra Handling Fee ($)</label>
                    <input
                      type="number"
                      value={paymentForm.codExtraFee}
                      onChange={(e) => setPaymentForm({ ...paymentForm, codExtraFee: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">Custom UPI / Payment QR</span>
                    <input
                      type="checkbox"
                      checked={paymentForm.enableUpiQr}
                      onChange={(e) => setPaymentForm({ ...paymentForm, enableUpiQr: e.target.checked })}
                      className="w-4 h-4 accent-black"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Allow customers to scan your official merchant QR code.</p>
                </div>

              </div>

              {/* Custom QR Code & Any File Type Upload */}
              <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-200/60 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <QrCode className="w-5 h-5 text-[#5A189A]" />
                    <span>Merchant QR Code & Custom File Upload (Any File Type)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    Supports Images, PDFs, Docs, QR Slips & Guides
                  </span>
                </div>

                {/* Custom File Upload Box (Any file type) */}
                <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs space-y-3">
                  <label className="block text-xs font-bold text-gray-800">
                    Custom Upload File for Payment & QR (Any Type):
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-[#5A189A] hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                      <Upload className="w-4 h-4 text-[#C4F000]" />
                      <span>Choose Any File (PNG, JPG, PDF, DOC, ZIP...)</span>
                      <input
                        type="file"
                        accept="*"
                        onChange={handlePaymentFileUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-gray-400">or enter a direct URL below</span>
                  </div>

                  {/* Display Currently Uploaded File */}
                  {paymentForm.customUploadedFile && (
                    <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#5A189A] text-white flex items-center justify-center shrink-0">
                          {paymentForm.customUploadedFile.type.startsWith('image/') ? (
                            <QrCode className="w-4 h-4 text-[#C4F000]" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#C4F000]" />
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {paymentForm.customUploadedFile.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {(paymentForm.customUploadedFile.size / 1024).toFixed(1)} KB · {paymentForm.customUploadedFile.type || 'Custom File'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={paymentForm.customUploadedFile.url}
                          download={paymentForm.customUploadedFile.name}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3 text-purple-700" />
                          <span>View/Download</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleRemovePaymentFile}
                          className="p-1 hover:bg-rose-100 rounded-lg text-rose-600 transition cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                  
                  {/* QR Preview Card */}
                  <div className="sm:col-span-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-36 h-36 border border-gray-200 rounded-lg p-1 bg-white mb-2 flex items-center justify-center overflow-hidden">
                      {paymentForm.customUploadedFile && !paymentForm.customUploadedFile.type.startsWith('image/') ? (
                        <div className="flex flex-col items-center justify-center p-2 text-center">
                          <FileText className="w-10 h-10 text-[#5A189A] mb-1" />
                          <span className="text-[10px] font-bold text-gray-700 truncate max-w-[120px]">
                            {paymentForm.customUploadedFile.name}
                          </span>
                          <span className="text-[9px] text-purple-700 font-semibold mt-0.5">
                            Custom Attached Doc
                          </span>
                        </div>
                      ) : (
                        <img
                          src={paymentForm.upiQrImageUrl}
                          alt="Merchant QR"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=dealkart%40upi';
                          }}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-gray-800">{paymentForm.upiMerchantName}</span>
                    <span className="text-[10px] text-purple-700 font-mono">{paymentForm.upiId}</span>
                  </div>

                  {/* Inputs */}
                  <div className="sm:col-span-8 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        QR Code Image URL / Upload Link:
                      </label>
                      <input
                        type="text"
                        value={paymentForm.upiQrImageUrl}
                        onChange={(e) => setPaymentForm({ ...paymentForm, upiQrImageUrl: e.target.value })}
                        placeholder="https://... or uploaded file data"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Merchant Name (Displayed on Customer Checkout):
                      </label>
                      <input
                        type="text"
                        value={paymentForm.upiMerchantName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, upiMerchantName: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        UPI ID / Account ID:
                      </label>
                      <input
                        type="text"
                        value={paymentForm.upiId}
                        onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                        placeholder="e.g. dealkart@upi or yourname@oksbi"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Custom Payment Instructions & Guidelines (Displayed to Customer):
                      </label>
                      <textarea
                        rows={2}
                        value={paymentForm.customPaymentInstructions || ''}
                        onChange={(e) => setPaymentForm({ ...paymentForm, customPaymentInstructions: e.target.value })}
                        placeholder="e.g. Scan QR, take a screenshot, and upload payment receipt below for instant processing."
                        className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">Direct Bank Transfer Details</span>
                  <input
                    type="checkbox"
                    checked={paymentForm.enableBankTransfer}
                    onChange={(e) => setPaymentForm({ ...paymentForm, enableBankTransfer: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                </div>
                <textarea
                  rows={2}
                  value={paymentForm.bankDetails}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bankDetails: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow cursor-pointer"
              >
                Save Payment Settings
              </button>

            </form>

          </div>
        )}

        {/* ================= TAB 5: DELIVERY BOY PORTAL MANAGEMENT ================= */}
        {activeTab === 'delivery' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-gray-900">Delivery Boys & Courier Drivers</h3>
                <p className="text-xs text-gray-500">
                  Manage drivers, assign COD deliveries, track cash collected, or launch the Driver Portal.
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsAgentModalOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Driver</span>
                </button>

                <button
                  onClick={() => setActiveView('delivery')}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Driver Portal View</span>
                </button>
              </div>
            </div>

            {/* Drivers List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {deliveryAgents.map((agent) => {
                const assignedCount = orders.filter(o => o.delivery_agent_id === agent.id).length;
                const deliveredCount = orders.filter(o => o.delivery_agent_id === agent.id && o.status === 'delivered').length;

                return (
                  <div
                    key={agent.id}
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-900">{agent.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {agent.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{agent.phone}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{agent.zone}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-gray-400" />
                          <span>{agent.vehicle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 text-xs">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Assigned Deliveries:</span>
                        <span className="font-bold text-gray-900">{assignedCount} orders</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Completed (Cash In Hand):</span>
                        <span className="font-bold text-emerald-700">{deliveredCount} orders</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= TAB 6: WEBSITE CUSTOMIZER & TEMPLATE ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6 max-w-4xl">
            
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900">Website Customizer & Live Template Settings</h3>
              <p className="text-xs text-gray-500">
                Customize your store name, banners, hero text, and contact information. Updates automatically on client devices upon saving!
              </p>
            </div>

            {saveSettingsSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Website template successfully updated & published live to customer devices!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Top Announcement Bar Message
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hero Banner Graphic URL
                </label>
                <input
                  type="text"
                  value={settingsForm.heroImageUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Support Hotline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.supportPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition shadow cursor-pointer"
                >
                  Save & Publish Live to Customer Devices
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h4 className="font-bold text-lg text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Store Product'}
              </h4>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Toys & Hobbies">Toys & Hobbies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Tag (e.g. -50%)</label>
                  <input
                    type="text"
                    value={productForm.discountBadge}
                    onChange={(e) => setProductForm({ ...productForm, discountBadge: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Variants (comma separated)</label>
                <input
                  type="text"
                  value={productForm.variants}
                  onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })}
                  placeholder="Black, White, Gold"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              {/* Placement Toggles */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDailyDeal}
                    onChange={(e) => setProductForm({ ...productForm, isDailyDeal: e.target.checked })}
                  />
                  <span>Daily Deal</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm({ ...productForm, isPopular: e.target.checked })}
                  />
                  <span>Popular</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isLimitedDrop}
                    onChange={(e) => setProductForm({ ...productForm, isLimitedDrop: e.target.checked })}
                  />
                  <span>Limited Drop</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Driver Add Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h4 className="font-bold text-lg text-gray-900">Add New Delivery Driver</h4>
              <button 
                onClick={() => setIsAgentModalOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addDeliveryAgent(agentForm);
              setIsAgentModalOpen(false);
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. Leo Henderson"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  placeholder="+1 (555) 019-3388"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Delivery Zone</label>
                <input
                  type="text"
                  required
                  value={agentForm.zone}
                  onChange={(e) => setAgentForm({ ...agentForm, zone: e.target.value })}
                  placeholder="e.g. Westside Downtown"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vehicle Details</label>
                <input
                  type="text"
                  value={agentForm.vehicle}
                  onChange={(e) => setAgentForm({ ...agentForm, vehicle: e.target.value })}
                  placeholder="e.g. Cargo Moto Van #06"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-gray-400">Order #{selectedOrderForDetail.id}</span>
                <h4 className="font-bold text-lg text-gray-900">{selectedOrderForDetail.customer_name}</h4>
              </div>
              <button 
                onClick={() => setSelectedOrderForDetail(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <p><strong>Phone:</strong> {selectedOrderForDetail.phone}</p>
                <p><strong>Address:</strong> {selectedOrderForDetail.address}, {selectedOrderForDetail.city}</p>
                {selectedOrderForDetail.notes && <p><strong>Notes:</strong> {selectedOrderForDetail.notes}</p>}
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <p><strong>Product:</strong> {selectedOrderForDetail.product_name} ({selectedOrderForDetail.product_variant})</p>
                <p><strong>Quantity:</strong> {selectedOrderForDetail.quantity}</p>
                <p><strong>Payment Method:</strong> <span className="uppercase font-bold text-purple-700">{selectedOrderForDetail.payment_method === 'cod' ? 'Cash on Delivery' : 'Custom UPI / QR'}</span></p>
                {selectedOrderForDetail.upi_transaction_id && (
                  <p>
                    <strong>UPI UTR / Reference:</strong>{' '}
                    <span className="font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      #{selectedOrderForDetail.upi_transaction_id}
                    </span>
                  </p>
                )}
                <p><strong>Total COD Cash:</strong> <span className="font-bold text-emerald-700 text-sm">{settings.currencySymbol}{Number(selectedOrderForDetail.total_amount || 0).toFixed(2)}</span></p>
              </div>

              {/* Customer Uploaded Payment Receipt / File Attachment */}
              {selectedOrderForDetail.payment_file_attachment && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-[#5A189A] shrink-0" />
                    <div className="min-w-0 text-left">
                      <span className="font-bold text-gray-900 block truncate max-w-[200px]">
                        {selectedOrderForDetail.payment_file_attachment.name}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {(selectedOrderForDetail.payment_file_attachment.size / 1024).toFixed(1)} KB · {selectedOrderForDetail.payment_file_attachment.type || 'Custom File'}
                      </span>
                    </div>
                  </div>
                  <a
                    href={selectedOrderForDetail.payment_file_attachment.url}
                    download={selectedOrderForDetail.payment_file_attachment.name}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#5A189A] hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Update Status:</label>
                <select
                  value={selectedOrderForDetail.status}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrderForDetail.id, next);
                    setSelectedOrderForDetail({ ...selectedOrderForDetail, status: next });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
