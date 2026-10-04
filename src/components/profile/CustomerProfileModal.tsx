import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  X, 
  User, 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Receipt, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  LogOut,
  RefreshCw,
  DollarSign,
  Paperclip,
  Download
} from 'lucide-react';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string | null;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const { 
    firebaseUser, 
    customerLogout, 
    orders, 
    settings, 
    deliveryAgents,
    setIsCustomerLoginModalOpen 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'tracking' | 'profile'>(initialOrderId ? 'tracking' : 'tracking');
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId || null);

  if (!isOpen) return null;

  // Filter customer orders by email or phone
  const userOrders = orders.filter(o => {
    if (!firebaseUser?.email) return false;
    return o.email?.toLowerCase() === firebaseUser.email.toLowerCase();
  });

  // If user searched for a specific Order ID or Phone number
  const searchedOrders = orders.filter(o => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return o.id.toLowerCase().includes(q) || o.phone.toLowerCase().includes(q);
  });

  // Display orders list
  const displayOrders = searchQuery.trim() 
    ? searchedOrders 
    : (userOrders.length > 0 ? userOrders : orders.slice(0, 5));

  // The active order being tracked
  const activeOrder: Order | undefined = selectedOrderId
    ? orders.find(o => o.id === selectedOrderId)
    : (displayOrders[0] || undefined);

  // Status step calculation
  const getStepStatus = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'confirmed':
        return 2;
      case 'shipped':
        return 2.5;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = activeOrder ? getStepStatus(activeOrder.status) : 1;

  // Find assigned courier agent if any
  const assignedAgent = activeOrder?.delivery_agent_id 
    ? deliveryAgents.find(a => a.id === activeOrder.delivery_agent_id) 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0" />

      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white text-gray-900 rounded-3xl shadow-2xl relative z-10 border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-[#130428] text-white flex items-center justify-between border-b border-purple-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A189A] flex items-center justify-center text-white shadow-md">
              <Package className="w-5 h-5 text-[#C4F000]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Customer Portal & Order Tracking
                </h3>
                <span className="bg-[#C4F000]/20 text-[#C4F000] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#C4F000]/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {firebaseUser?.email || 'Guest Tracking Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 px-6 pt-2">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'tracking'
                ? 'border-[#5A189A] text-[#5A189A]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#5A189A] text-[#5A189A]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer Profile</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {activeTab === 'tracking' ? (
            <div className="space-y-6">
              
              {/* Search Bar for Order Tracking */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID (e.g. ord_1041_demo) or phone..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#5A189A] transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-black cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 whitespace-nowrap px-1">
                  {displayOrders.length} order(s) found
                </div>
              </div>

              {/* If no orders found */}
              {displayOrders.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6">
                  <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-gray-800">No Orders Found</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    We could not find any active orders for the given search. Try entering your Order ID from your receipt or place an order.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Orders List Selection */}
                  <div className="lg:col-span-5 space-y-2.5 max-h-[350px] lg:max-h-[460px] overflow-y-auto pr-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
                      Recent Orders
                    </p>
                    {displayOrders.map(order => {
                      const isSelected = activeOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-purple-50/70 border-[#5A189A] shadow-xs'
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-mono font-bold text-gray-900 truncate max-w-[130px]">
                              {order.id}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'out_for_delivery'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : order.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {order.product_name || 'Daily Deal Item'}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="font-bold text-gray-900">
                              {settings.currencySymbol}{(order.total_amount || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Active Order Live Tracking Details */}
                  {activeOrder && (
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6 text-left">
                      
                      {/* Order Status Badge & Top Info */}
                      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Order Tracking #
                          </div>
                          <h4 className="text-base sm:text-lg font-mono font-black text-gray-900">
                            {activeOrder.id}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Placed on {new Date(activeOrder.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            activeOrder.status === 'delivered'
                              ? 'bg-emerald-500 text-white'
                              : activeOrder.status === 'out_for_delivery'
                              ? 'bg-amber-500 text-white animate-pulse'
                              : activeOrder.status === 'confirmed'
                              ? 'bg-[#5A189A] text-white'
                              : 'bg-gray-800 text-white'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>{activeOrder.status.replace(/_/g, ' ')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Visual Stepper Timeline */}
                      <div>
                        <div className="text-xs font-bold text-gray-900 mb-3 flex items-center justify-between">
                          <span>Live Courier Progress</span>
                          <span className="text-[11px] font-semibold text-purple-700">
                            Cash on Delivery Express
                          </span>
                        </div>

                        <div className="relative flex items-center justify-between my-4 px-2">
                          {/* Connecting Progress Line */}
                          <div className="absolute top-1/2 left-6 right-6 h-1 -translate-y-1/2 bg-gray-200 z-0">
                            <div 
                              className="h-full bg-[#5A189A] transition-all duration-500"
                              style={{
                                width: `${
                                  currentStep === 1 ? '10%' :
                                  currentStep === 2 ? '40%' :
                                  currentStep === 3 ? '75%' :
                                  currentStep === 4 ? '100%' : '0%'
                                }`
                              }}
                            />
                          </div>

                          {/* Step 1: Placed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              currentStep >= 1 ? 'bg-[#5A189A] text-white shadow-md' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 mt-1.5">Placed</span>
                          </div>

                          {/* Step 2: Confirmed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              currentStep >= 2 ? 'bg-[#5A189A] text-white shadow-md' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 mt-1.5">Packed</span>
                          </div>

                          {/* Step 3: Out for Delivery */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              currentStep >= 3 ? 'bg-amber-500 text-white shadow-md ring-4 ring-amber-100 animate-pulse' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 mt-1.5">On Road</span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              currentStep >= 4 ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Receipt className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 mt-1.5">Delivered</span>
                          </div>
                        </div>

                      </div>

                      {/* Delivery Boy Courier Contact Info */}
                      {(activeOrder.delivery_agent_name || assignedAgent) && (
                        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900">
                                Assigned Courier Driver
                              </div>
                              <div className="text-xs font-semibold text-amber-900">
                                {activeOrder.delivery_agent_name || assignedAgent?.name}
                              </div>
                              <div className="text-[11px] text-gray-600">
                                {assignedAgent?.vehicle || 'Express Bike'} · Zone: {assignedAgent?.zone || activeOrder.city}
                              </div>
                            </div>
                          </div>

                          {assignedAgent?.phone && (
                            <a
                              href={`tel:${assignedAgent.phone}`}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Driver</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Item & Address Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        
                        {/* Product Summary */}
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Ordered Item
                          </span>
                          <div className="font-bold text-gray-900">
                            {activeOrder.product_name}
                          </div>
                          <div className="text-gray-600">
                            Variant: <span className="font-semibold text-gray-800">{activeOrder.product_variant || 'Standard'}</span>
                          </div>
                          <div className="text-gray-600">
                            Qty: <span className="font-semibold text-gray-800">{activeOrder.quantity}</span>
                          </div>
                          <div className="text-gray-600">
                            Payment: <span className="font-bold text-purple-700 uppercase">{activeOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI QR'}</span>
                          </div>
                          {activeOrder.upi_transaction_id && (
                            <div className="text-gray-600">
                              UPI UTR: <span className="font-mono font-bold text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded text-[11px]">#{activeOrder.upi_transaction_id}</span>
                            </div>
                          )}
                          <div className="text-sm font-black text-gray-900 pt-1 border-t border-gray-200 flex justify-between">
                            <span>Cash Due at Door:</span>
                            <span>{settings.currencySymbol}{(activeOrder.total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Delivery Destination */}
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Destination Address
                          </span>
                          <div className="font-bold text-gray-900 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#5A189A]" />
                            <span>{activeOrder.customer_name}</span>
                          </div>
                          <div className="text-gray-600">
                            {activeOrder.address}
                          </div>
                          <div className="text-gray-600">
                            {activeOrder.city}, {activeOrder.country || 'USA'}
                          </div>
                          <div className="text-gray-600 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{activeOrder.phone}</span>
                          </div>
                          {activeOrder.notes && (
                            <div className="text-[11px] text-gray-500 italic mt-1 pt-1 border-t border-gray-200">
                              Note: "{activeOrder.notes}"
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Attached Payment Receipt / File if provided */}
                      {activeOrder.payment_file_attachment && (
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip className="w-4 h-4 text-[#5A189A] shrink-0" />
                            <div className="min-w-0">
                              <span className="font-bold text-gray-900 block truncate max-w-[220px]">
                                Attached Payment Slip: {activeOrder.payment_file_attachment.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {(activeOrder.payment_file_attachment.size / 1024).toFixed(1)} KB · {activeOrder.payment_file_attachment.type || 'Custom File'}
                              </span>
                            </div>
                          </div>
                          <a
                            href={activeOrder.payment_file_attachment.url}
                            download={activeOrder.payment_file_attachment.name}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#5A189A] hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Slip</span>
                          </a>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            /* Profile Tab */
            <div className="space-y-6 max-w-xl mx-auto text-left">
              
              {firebaseUser ? (
                <div className="space-y-5">
                  
                  {/* Customer Card */}
                  <div className="p-6 rounded-3xl bg-linear-to-br from-purple-900 to-[#130428] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-[#C4F000]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#C4F000] text-[#130428] flex items-center justify-center font-black text-2xl shadow-lg">
                        {firebaseUser.email ? firebaseUser.email[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black tracking-tight">
                            {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                          </h4>
                          <span className="bg-[#C4F000] text-[#130428] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            VIP Member
                          </span>
                        </div>
                        <p className="text-xs text-purple-200 mt-0.5">
                          {firebaseUser.email}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 font-mono">
                          UID: {firebaseUser.uid.substring(0, 14)}...
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Orders</span>
                        <p className="text-base font-black text-[#C4F000]">{userOrders.length}</p>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">Delivery Perk</span>
                        <p className="text-base font-black text-white">Free Express COD</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('tracking');
                      }}
                      className="w-full py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-[#5A189A]" />
                        <span>View My Order History ({userOrders.length})</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={async () => {
                        await customerLogout();
                        onClose();
                      }}
                      className="w-full py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-xs font-bold text-rose-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out from Firebase</span>
                    </button>
                  </div>

                </div>
              ) : (
                /* Not Logged In State */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-[#5A189A] flex items-center justify-center mx-auto">
                    <User className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Sign in to sync your customer profile
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Sign in with Firebase to automatically link your order history, save addresses, and track shipments.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setIsCustomerLoginModalOpen(true);
                    }}
                    className="bg-[#130428] hover:bg-[#5A189A] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Sign In / Register</span>
                    <ChevronRight className="w-4 h-4 text-[#C4F000]" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Real-time status synced with Supabase & Firebase</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold text-gray-700 hover:text-black cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
