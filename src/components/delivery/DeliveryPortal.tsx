import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  Truck, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Navigation, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Check,
  Store,
  LayoutDashboard
} from 'lucide-react';

export const DeliveryPortal: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    refreshOrders, 
    deliveryAgents, 
    activeDeliveryAgentId, 
    setActiveDeliveryAgentId, 
    settings, 
    setActiveView 
  } = useStore();

  const currentAgent = deliveryAgents.find(a => a.id === activeDeliveryAgentId) || deliveryAgents[0];

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deliveries for this agent or unassigned
  const myAssignedOrders = orders.filter(
    o => o.delivery_agent_id === currentAgent.id || (!o.delivery_agent_id && o.status !== 'delivered' && o.status !== 'cancelled')
  );

  const pendingDeliveries = myAssignedOrders.filter(
    o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'out_for_delivery' || o.status === 'shipped'
  );

  const completedDeliveries = myAssignedOrders.filter(o => o.status === 'delivered');

  const todayCashCollected = completedDeliveries.reduce(
    (sum, o) => sum + (o.total_amount || 0), 0
  );

  const handleMarkDelivered = async (order: Order) => {
    await updateOrderStatus(order.id, 'delivered', {
      cash_collected: true,
      delivery_agent_id: currentAgent.id,
      delivery_agent_name: currentAgent.name,
    });
    setActionSuccess(`Order #${order.id.slice(0, 8)} marked Delivered. Collected ${settings.currencySymbol}${Number(order.total_amount || 0).toFixed(2)} cash!`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleMarkOutForDelivery = async (order: Order) => {
    await updateOrderStatus(order.id, 'out_for_delivery', {
      delivery_agent_id: currentAgent.id,
      delivery_agent_name: currentAgent.name,
    });
    setActionSuccess(`Order #${order.id.slice(0, 8)} is now Out for Delivery`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 flex flex-col font-sans">
      
      {/* Mobile-first Driver Header */}
      <header className="sticky top-0 z-40 bg-sky-950 text-white px-4 sm:px-6 py-4 shadow-lg flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base leading-tight">Delivery Agent Portal</h1>
              <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-sky-200">
              {currentAgent.name} · {currentAgent.vehicle}
            </p>
          </div>
        </div>

        {/* Driver Selector & Exit buttons */}
        <div className="flex items-center gap-2">
          <select
            value={activeDeliveryAgentId}
            onChange={(e) => setActiveDeliveryAgentId(e.target.value)}
            className="bg-sky-900 border border-sky-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none"
          >
            {deliveryAgents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={() => setActiveView('store')}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            title="Return to Store"
          >
            <Store className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            title="Open Admin Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Content */}
      <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 flex-1 space-y-5">
        
        {/* Cash Collected Alert Banner */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Driver KPI Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500">Today's Cash Collected</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums mt-2">
              {settings.currencySymbol}{todayCashCollected.toFixed(2)}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Keep cash secure in bag</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500">Pending Deliveries</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-800 tabular-nums mt-2">
              {pendingDeliveries.length}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">{completedDeliveries.length} done today</span>
          </div>
        </div>

        {/* Tab Controls: Pending vs Completed */}
        <div className="flex bg-gray-200/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-700" />
            <span>Active Deliveries ({pendingDeliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Delivered & Cash In Hand ({completedDeliveries.length})</span>
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {(activeTab === 'pending' ? pendingDeliveries : completedDeliveries).length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-400 space-y-2">
              <Truck className="w-12 h-12 mx-auto text-gray-300" />
              <p className="font-bold text-gray-700">No deliveries in this section</p>
              <p className="text-xs">All assigned Cash on Delivery shipments are up to date.</p>
            </div>
          ) : (
            (activeTab === 'pending' ? pendingDeliveries : completedDeliveries).map((order) => {
              const totalDue = Number(order.total_amount || 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  {/* Top: Customer & Cash Due */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400">Order #{order.id.slice(0, 10)}</span>
                      <h3 className="font-black text-base text-gray-900">{order.customer_name}</h3>
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">
                        {order.product_name} · Qty: {order.quantity} ({order.product_variant})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Collect Cash</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">
                        {settings.currencySymbol}{totalDue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Address & Quick Actions */}
                  <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-800">
                        {order.address}, {order.city}
                      </span>
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-gray-500 pl-6 italic">
                        Note: "{order.notes}"
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap gap-2 pl-6">
                      <a
                        href={`tel:${order.phone}`}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call Customer ({order.phone})</span>
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${order.address}, ${order.city}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>Open Maps</span>
                      </a>
                    </div>
                  </div>

                  {/* Courier Action Buttons */}
                  {activeTab === 'pending' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {order.status !== 'out_for_delivery' && (
                        <button
                          onClick={() => handleMarkOutForDelivery(order)}
                          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Start / Out for Delivery</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMarkDelivered(order)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm sm:col-span-1"
                      >
                        <CheckCircle2 className="w-4 h-4 text-lime-300" />
                        <span>Cash Collected & Delivered</span>
                      </button>
                    </div>
                  )}

                  {activeTab === 'completed' && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Cash Received & Handed to Customer</span>
                      </div>
                      <span className="tabular-nums">
                        {settings.currencySymbol}{totalDue.toFixed(2)}
                      </span>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
