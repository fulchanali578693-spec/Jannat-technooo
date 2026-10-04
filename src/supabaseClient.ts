import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus } from './types';

// Supabase Credentials (INSERT only)
export const SUPABASE_URL = "https://aqihwumjlzpzyazxvazw.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pND8EMf5EOGIJGFjYKyufw_qaHv4Os-";

/**
 * Supabase JS Client initialized with public publishable key.
 * Critical Rule: Used for INSERT only into table "orders".
 * Do NOT use select, update, or delete.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const LOCAL_STORAGE_ORDERS_KEY = 'dealkart_orders_cache_v3';

// Cross-tab real-time broadcast channel for instant live updates between customer devices and admin panel
export const realtimeChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('dealkart_realtime_sync')
  : null;

/**
 * Broadcast event to all listening tabs/devices in realtime
 */
export function broadcastRealtimeUpdate(type: 'NEW_ORDER' | 'UPDATE_ORDER' | 'UPDATE_SETTINGS' | 'UPDATE_PRODUCTS', payload: any) {
  if (realtimeChannel) {
    try {
      realtimeChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn('Realtime broadcast notice:', e);
    }
  }
  // Also dispatch local window event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dealkart_realtime_event', { detail: { type, payload } }));
  }
}

/**
 * Read cached orders from local storage
 */
export const getLocalOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse local orders cache:', e);
    return [];
  }
};

/**
 * Save orders to local storage
 */
export const saveLocalOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to local storage:', e);
  }
};

/**
 * Insert order into Supabase
 * STRICT RULE: INSERT ONLY into table "orders" with:
 * customer_name, phone, email, city, address, country,
 * product_name, product_variant, quantity, notes, status="pending"
 */
export async function insertOrderToSupabase(orderData: Partial<Order>): Promise<{ data: Order | null; error: any }> {
  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    customer_name: orderData.customer_name?.trim() || 'Customer',
    phone: orderData.phone?.trim() || '',
    email: orderData.email?.trim() || null,
    city: orderData.city?.trim() || '',
    address: orderData.address?.trim() || '',
    country: orderData.country?.trim() || 'USA',
    product_name: orderData.product_name?.trim() || 'Daily Deal Product',
    product_variant: orderData.product_variant?.trim() || 'Standard Edition',
    quantity: Number(orderData.quantity) || 1,
    notes: orderData.notes?.trim() || null,
    status: 'pending', // MUST be "pending"
    created_at: new Date().toISOString(),
    total_amount: orderData.total_amount || 0,
    payment_method: orderData.payment_method || 'cod',
    delivery_agent_id: orderData.delivery_agent_id,
    delivery_agent_name: orderData.delivery_agent_name,
    cash_collected: false,
  };

  // 1. Immediately save to local persistent store
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveLocalOrders(updatedOrders);

  // 2. Broadcast in realtime to Admin Dashboard & Delivery Boy Portal
  broadcastRealtimeUpdate('NEW_ORDER', newOrder);

  // 3. Perform Supabase INSERT ONLY
  try {
    const { data, error } = await supabase.from('orders').insert([
      {
        customer_name: newOrder.customer_name,
        phone: newOrder.phone,
        email: newOrder.email,
        city: newOrder.city,
        address: newOrder.address,
        country: newOrder.country,
        product_name: newOrder.product_name,
        product_variant: newOrder.product_variant,
        quantity: newOrder.quantity,
        notes: newOrder.notes,
        status: "pending",
      }
    ]);

    if (error) {
      console.warn('Supabase insert note:', error.message);
      // If Supabase returned an error, return error
      return { data: newOrder, error };
    }

    return { data: newOrder, error: null };
  } catch (err) {
    console.error('Supabase insert exception:', err);
    return { data: newOrder, error: err };
  }
}

/**
 * Update order status locally and broadcast in realtime to all connected devices/panels
 * (Does NOT call Supabase update to respect INSERT ONLY rule)
 */
export function updateOrderStatusLocally(
  orderId: string, 
  newStatus: OrderStatus, 
  extras?: Partial<Order>
): Order[] {
  const current = getLocalOrders();
  const updated = current.map(o => {
    if (o.id === orderId) {
      const updatedOrder = { 
        ...o, 
        status: newStatus, 
        ...(extras || {}) 
      };
      // Broadcast live update
      broadcastRealtimeUpdate('UPDATE_ORDER', updatedOrder);
      return updatedOrder;
    }
    return o;
  });

  saveLocalOrders(updated);
  return updated;
}
