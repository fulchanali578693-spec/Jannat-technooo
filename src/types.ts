export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi_qr' | 'bank_transfer' | 'card';

export interface OrderItem {
  productId: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UploadedFileMeta {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string;
  city: string;
  address: string;
  country?: string;
  product_name?: string;
  product_variant?: string;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  total_amount?: number;
  notes?: string | null;
  payment_method?: PaymentMethod;
  delivery_agent_id?: string;
  delivery_agent_name?: string;
  cash_collected?: boolean;
  payment_file_attachment?: UploadedFileMeta | null;
  upi_transaction_id?: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  discountBadge: string;
  image: string;
  description: string;
  isDailyDeal?: boolean;
  isPopular?: boolean;
  isLimitedDrop?: boolean;
  stockLeft?: number;
  variants: string[];
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  status: 'active' | 'on_delivery' | 'off_duty';
  totalCashCollected: number;
}

export interface PaymentConfig {
  enableCod: boolean;
  codExtraFee: number;
  enableUpiQr: boolean;
  upiId: string;
  upiQrImageUrl: string;
  upiMerchantName: string;
  enableBankTransfer: boolean;
  bankDetails: string;
  enableCard: boolean;
  customUploadedFile?: UploadedFileMeta | null;
  customPaymentInstructions?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroImageUrl: string;
  currencySymbol: string;
  currencyCode: string;
  supportEmail: string;
  supportPhone: string;
}
