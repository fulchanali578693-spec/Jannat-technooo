import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  OrderStatus, 
  Product, 
  StoreSettings, 
  PaymentConfig, 
  DeliveryAgent, 
  OrderItem 
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PAYMENT_CONFIG, 
  INITIAL_PRODUCTS, 
  INITIAL_DELIVERY_AGENTS 
} from '../storeConfig';
import { 
  insertOrderToSupabase, 
  updateOrderStatusLocally, 
  getLocalOrders, 
  saveLocalOrders, 
  broadcastRealtimeUpdate,
  realtimeChannel
} from '../supabaseClient';
import { auth, signOut, onAuthStateChanged, User } from '../firebase';

export const ADMIN_EMAIL = 'jannatinfotech@gmail.com';
export const ADMIN_PASS = 'JannatInfotech@6900';

interface StoreContextType {
  // Settings & Theme
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Payments & Custom QR
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (newConfig: Partial<PaymentConfig>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  refreshOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<{ data: Order | null; error: any }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, extras?: Partial<Order>) => Promise<void>;
  assignDeliveryAgent: (orderId: string, agentId: string) => Promise<void>;

  // Delivery Boys
  deliveryAgents: DeliveryAgent[];
  addDeliveryAgent: (agent: Omit<DeliveryAgent, 'id' | 'totalCashCollected'>) => void;
  activeDeliveryAgentId: string;
  setActiveDeliveryAgentId: (id: string) => void;

  // Shopping Bag / Cart
  cart: OrderItem[];
  addToCart: (product: Product, variant?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateCartQty: (productId: string, variant: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;

  // Views & Admin/Customer Auth
  activeView: 'store' | 'admin' | 'delivery';
  setActiveView: (view: 'store' | 'admin' | 'delivery') => void;
  isAdminLoggedIn: boolean;
  adminLogin: (emailOrPass: string, password?: string) => boolean;
  adminLogout: () => void;
  
  // Firebase Customer Auth & Modal
  firebaseUser: User | null;
  isAuthLoading: boolean;
  customerLogout: () => Promise<void>;
  isCustomerLoginModalOpen: boolean;
  setIsCustomerLoginModalOpen: (open: boolean) => void;

  // Customer Profile & Tracking Modal
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingOrderId: string | null;
  openTrackingModal: (orderId?: string) => void;

  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'dealkart_settings_v3',
  PAYMENTS: 'dealkart_payments_v3',
  PRODUCTS: 'dealkart_products_v3',
  AGENTS: 'dealkart_delivery_agents_v3',
  AUTH: 'dealkart_admin_auth_v3',
};

// Seed demo orders if brand new session
const DEMO_ORDERS: Order[] = [
  {
    id: "ord_1041_demo",
    customer_name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 349-1029",
    city: "San Francisco",
    address: "742 Montgomery St, Apt 14B",
    country: "USA",
    product_name: "True Wireless Earbuds",
    product_variant: "Midnight Black",
    quantity: 1,
    status: "delivered",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    total_amount: 29.99,
    notes: "Ring bell twice, leave at door",
    payment_method: "cod",
    delivery_agent_id: "da-1",
    delivery_agent_name: "Alex Martinez",
    cash_collected: true,
  },
  {
    id: "ord_1042_demo",
    customer_name: "David Kim",
    email: "dkim.creative@gmail.com",
    phone: "+1 (555) 782-9901",
    city: "Seattle",
    address: "1208 Pine Crest Ave, Suite 300",
    country: "USA",
    product_name: "Digital Air Fryer 5.5L",
    product_variant: "Matte Black",
    quantity: 1,
    status: "out_for_delivery",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    total_amount: 89.99,
    notes: "Call 10 mins before arrival",
    payment_method: "cod",
    delivery_agent_id: "da-2",
    delivery_agent_name: "Marcus Vance",
    cash_collected: false,
  },
  {
    id: "ord_1043_demo",
    customer_name: "Elena Rostova",
    email: "elena.r@outlook.com",
    phone: "+1 (555) 412-8823",
    city: "Chicago",
    address: "510 Michigan Ave, Unit 802",
    country: "USA",
    product_name: "Noise-Cancel Headphones",
    product_variant: "Matte Graphite",
    quantity: 2,
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    total_amount: 199.98,
    notes: "Please call on arrival",
    payment_method: "cod",
    cash_collected: false,
  },
  {
    id: "ord_1044_demo",
    customer_name: "Michael Torres",
    email: "mtorres99@gmail.com",
    phone: "+1 (555) 901-2244",
    city: "Austin",
    address: "420 Congress Ave, Flat 12",
    country: "USA",
    product_name: "Smart Watch Pro",
    product_variant: "Titanium Silver",
    quantity: 1,
    status: "confirmed",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    total_amount: 79.99,
    payment_method: "upi_qr",
    delivery_agent_id: "da-1",
    delivery_agent_name: "Alex Martinez",
    cash_collected: false,
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 2. Payments
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  });

  // 3. Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 4. Delivery Agents
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_AGENTS;
    } catch {
      return INITIAL_DELIVERY_AGENTS;
    }
  });

  const [activeDeliveryAgentId, setActiveDeliveryAgentId] = useState<string>("da-1");

  // 5. Orders (Maintained via local cache + Realtime channel, strictly INSERT only on Supabase)
  const [orders, setOrders] = useState<Order[]>(() => {
    const existing = getLocalOrders();
    if (existing.length === 0) {
      saveLocalOrders(DEMO_ORDERS);
      return DEMO_ORDERS;
    }
    return existing;
  });

  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // 6. Navigation View & Auth
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'delivery'>('store');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // 7. Firebase Auth Integration
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isCustomerLoginModalOpen, setIsCustomerLoginModalOpen] = useState<boolean>(false);

  // Customer Profile & Tracking Modal
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const openTrackingModal = (orderId?: string) => {
    if (orderId) setTrackingOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  // 8. Cart & Modals
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Sync settings updates across all browser tabs & broadcast in realtime
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      broadcastRealtimeUpdate('UPDATE_SETTINGS', updated);
      return updated;
    });
  };

  const updatePaymentConfig = (newConfig: Partial<PaymentConfig>) => {
    setPaymentConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
      broadcastRealtimeUpdate('UPDATE_SETTINGS', { paymentConfig: updated });
      return updated;
    });
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
    };
    setProducts(prev => {
      const updated = [newProd, ...prev];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      broadcastRealtimeUpdate('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      broadcastRealtimeUpdate('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      broadcastRealtimeUpdate('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const addDeliveryAgent = (agentData: Omit<DeliveryAgent, 'id' | 'totalCashCollected'>) => {
    const newAgent: DeliveryAgent = {
      ...agentData,
      id: `da-${Date.now()}`,
      totalCashCollected: 0,
    };
    setDeliveryAgents(prev => {
      const updated = [...prev, newAgent];
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updated));
      return updated;
    });
  };

  // Orders Actions: INSERT only on Supabase, realtime state update across panels
  const refreshOrders = async () => {
    setIsLoadingOrders(true);
    const local = getLocalOrders();
    setOrders(local);
    setIsLoadingOrders(false);
  };

  const createOrder = async (orderData: Partial<Order>) => {
    // Calls Supabase INSERT ONLY with exact requested columns
    const res = await insertOrderToSupabase(orderData);
    if (res.data) {
      setOrders(prev => [res.data!, ...prev.filter(o => o.id !== res.data!.id)]);
    }
    return res;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, extras?: Partial<Order>) => {
    const updated = updateOrderStatusLocally(orderId, status, extras);
    setOrders(updated);
  };

  const assignDeliveryAgent = async (orderId: string, agentId: string) => {
    const agent = deliveryAgents.find(a => a.id === agentId);
    await updateOrderStatus(orderId, 'out_for_delivery', {
      delivery_agent_id: agentId,
      delivery_agent_name: agent?.name,
    });
  };

  // Cart Management
  const addToCart = (product: Product, variant?: string, quantity: number = 1) => {
    const chosenVariant = variant || product.variants[0] || 'Standard';
    setCart(prev => {
      const index = prev.findIndex(item => item.productId === product.id && item.variant === chosenVariant);
      if (index >= 0) {
        const copy = [...prev];
        copy[index].quantity += quantity;
        return copy;
      } else {
        return [...prev, {
          productId: product.id,
          name: product.name,
          variant: chosenVariant,
          price: product.price,
          quantity: quantity,
          image: product.image,
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variant === variant)));
  };

  const updateCartQty = (productId: string, variant: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variant === variant) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Admin Auth with specific credentials: jannatinfotech@gmail.com / JannatInfotech@6900
  const adminLogin = (emailOrPass: string, password?: string) => {
    const email = password ? emailOrPass.trim().toLowerCase() : '';
    const pass = password ? password.trim() : emailOrPass.trim();

    if (
      (email === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS) ||
      (email === '' && pass === ADMIN_PASS)
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const customerLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setFirebaseUser(null);
    adminLogout();
  };

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      if (user && user.email === ADMIN_EMAIL) {
        setIsAdminLoggedIn(true);
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      }
    });

    return () => unsubscribe();
  }, []);

  // Realtime updates listener across tabs & devices
  useEffect(() => {
    const handleRealtimeMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;
      const { type, payload } = event.data;

      if (type === 'NEW_ORDER') {
        setOrders(prev => [payload, ...prev.filter(o => o.id !== payload.id)]);
      } else if (type === 'UPDATE_ORDER') {
        setOrders(prev => prev.map(o => o.id === payload.id ? { ...o, ...payload } : o));
      } else if (type === 'UPDATE_SETTINGS') {
        if (payload.paymentConfig) setPaymentConfig(payload.paymentConfig);
        else setSettings(payload);
      } else if (type === 'UPDATE_PRODUCTS') {
        setProducts(payload);
      }
    };

    if (realtimeChannel) {
      realtimeChannel.addEventListener('message', handleRealtimeMessage);
    }

    const handleWindowRealtime = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.type === 'NEW_ORDER') {
        setOrders(prev => [detail.payload, ...prev.filter(o => o.id !== detail.payload.id)]);
      } else if (detail.type === 'UPDATE_ORDER') {
        setOrders(prev => prev.map(o => o.id === detail.payload.id ? { ...o, ...detail.payload } : o));
      }
    };

    window.addEventListener('dealkart_realtime_event', handleWindowRealtime);

    // Also sync from localStorage on storage event
    const handleStorageChange = () => {
      const local = getLocalOrders();
      if (local.length > 0) setOrders(local);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (realtimeChannel) {
        realtimeChannel.removeEventListener('message', handleRealtimeMessage);
      }
      window.removeEventListener('dealkart_realtime_event', handleWindowRealtime);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        paymentConfig,
        updatePaymentConfig,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        isLoadingOrders,
        refreshOrders,
        createOrder,
        updateOrderStatus,
        assignDeliveryAgent,
        deliveryAgents,
        addDeliveryAgent,
        activeDeliveryAgentId,
        setActiveDeliveryAgentId,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        activeView,
        setActiveView,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        firebaseUser,
        isAuthLoading,
        customerLogout,
        isCustomerLoginModalOpen,
        setIsCustomerLoginModalOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingOrderId,
        openTrackingModal,
        selectedProductForModal,
        setSelectedProductForModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
