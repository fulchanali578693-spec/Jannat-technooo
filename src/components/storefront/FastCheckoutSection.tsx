import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, PaymentMethod, UploadedFileMeta } from '../../types';
import { 
  Banknote, 
  QrCode, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  MapPin,
  Mail,
  Upload,
  FileText,
  Paperclip,
  Download,
  Trash2,
  Lock,
  Copy,
  Check,
  AlertTriangle,
  FileCheck,
  ShieldAlert
} from 'lucide-react';

interface FastCheckoutSectionProps {
  initialProduct?: Product | null;
}

export const FastCheckoutSection: React.FC<FastCheckoutSectionProps> = ({ initialProduct }) => {
  const { 
    products, 
    settings, 
    paymentConfig, 
    createOrder, 
    cart, 
    clearCart,
    firebaseUser,
    openTrackingModal
  } = useStore();

  // If initialProduct is passed or cart has items, use that; else default to first product
  const defaultProduct = initialProduct || (cart.length > 0 ? products.find(p => p.id === cart[0].productId) || products[0] : products[0]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProduct);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    defaultProduct?.variants[0] || 'Standard Edition'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [formData, setFormData] = useState({
    customer_name: firebaseUser?.displayName || '',
    phone: '',
    email: firebaseUser?.email || '',
    city: '',
    address: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [customerFileAttachment, setCustomerFileAttachment] = useState<UploadedFileMeta | null>(null);

  const handleCustomerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCustomerFileAttachment({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomerFile = () => {
    setCustomerFileAttachment(null);
    setUpiVerified(false);
  };

  // UPI Strict Payment Verification State
  const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  const [isUpiPaymentConfirmed, setIsUpiPaymentConfirmed] = useState<boolean>(false);
  const [upiCopied, setUpiCopied] = useState<boolean>(false);
  const [upiVerified, setUpiVerified] = useState<boolean>(false);
  const [upiVerifying, setUpiVerifying] = useState<boolean>(false);
  const [upiError, setUpiError] = useState<string | null>(null);

  const handleCopyUpiId = () => {
    if (paymentConfig.upiId) {
      navigator.clipboard.writeText(paymentConfig.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  const handleVerifyUpiPayment = () => {
    setUpiError(null);
    if (!upiTransactionId.trim() || upiTransactionId.trim().length < 6) {
      setUpiError('Please enter a valid 12-digit UPI Transaction / UTR Reference number from your payment app.');
      return;
    }
    if (!customerFileAttachment) {
      setUpiError('Please upload your payment screenshot or receipt file before verifying.');
      return;
    }
    if (!isUpiPaymentConfirmed) {
      setUpiError('Please check the confirmation box indicating that you have completed this payment.');
      return;
    }

    setUpiVerifying(true);
    setTimeout(() => {
      setUpiVerifying(false);
      setUpiVerified(true);
      setUpiError(null);
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.upiPayment;
        delete next.upiTransactionId;
        delete next.customerFileAttachment;
        delete next.isUpiPaymentConfirmed;
        return next;
      });
    }, 800);
  };

  // Sync when initialProduct prop changes
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setSelectedVariant(initialProduct.variants[0] || 'Standard');
    }
  }, [initialProduct]);

  React.useEffect(() => {
    if (firebaseUser?.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: firebaseUser.email || '',
        customer_name: prev.customer_name || firebaseUser.displayName || ''
      }));
    }
  }, [firebaseUser]);

  const unitPrice = selectedProduct?.price || 29.99;
  const subtotal = unitPrice * quantity;
  const shippingFee = 0; // Free
  const codFee = (paymentMethod === 'cod' && paymentConfig.codExtraFee) ? paymentConfig.codExtraFee : 0;
  const grandTotal = subtotal + shippingFee + codFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customer_name.trim() || formData.customer_name.trim().length < 2) {
      errs.customer_name = 'Please enter your full name.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid delivery phone number.';
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Please provide complete house/apartment & street address.';
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errs.city = 'Please enter your delivery city.';
    }

    // STRICT UPI PAYMENT VERIFICATION: Don't go forward without completed payment!
    if (paymentMethod === 'upi_qr') {
      let upiIssue = false;
      if (!upiTransactionId.trim() || upiTransactionId.trim().length < 6) {
        errs.upiTransactionId = 'Required: Please enter your 12-digit UPI Transaction / UTR number.';
        upiIssue = true;
      }
      if (!customerFileAttachment) {
        errs.customerFileAttachment = 'Required: Please upload your payment screenshot or receipt file.';
        upiIssue = true;
      }
      if (!isUpiPaymentConfirmed) {
        errs.isUpiPaymentConfirmed = 'Required: You must confirm that you have completed this payment.';
        upiIssue = true;
      }
      if (!upiVerified || upiIssue) {
        errs.upiPayment = 'Payment Incomplete: You must complete the UPI payment, enter the reference ID, and upload payment proof before your order can proceed.';
        const upiEl = document.getElementById('upi-payment-block');
        if (upiEl) {
          upiEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (paymentMethod === 'upi_qr' && (!upiTransactionId.trim() || !customerFileAttachment || !isUpiPaymentConfirmed || !upiVerified)) {
        setOrderError('UPI Payment Incomplete: Please complete the payment, enter your UTR number, and upload proof before placing your order.');
      }
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const upiNote = paymentMethod === 'upi_qr' && upiTransactionId.trim() 
        ? `[UPI UTR: ${upiTransactionId.trim()}]` 
        : '';
      const finalNotes = [formData.notes.trim(), upiNote].filter(Boolean).join(' | ') || null;

      const payload = {
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        country: 'USA',
        product_name: selectedProduct.name,
        product_variant: selectedVariant,
        quantity: quantity,
        status: 'pending' as const,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        notes: finalNotes,
        payment_file_attachment: customerFileAttachment,
        upi_transaction_id: paymentMethod === 'upi_qr' ? upiTransactionId.trim() : null,
      };

      const res = await createOrder(payload);

      if (res.error) {
        setOrderError('Could not process order right now. Please check your connection and try again.');
      } else if (res.data) {
        setOrderSuccess(res.data);
        clearCart();
      } else {
        setOrderError('Could not process order right now. Please check your details and try again.');
      }
    } catch (err: any) {
      console.error('Order error:', err);
      setOrderError('Could not process order right now. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOrderView = () => {
    setOrderSuccess(null);
    setFormData({
      customer_name: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      notes: '',
    });
    setQuantity(1);
    setFormErrors({});
  };

  return (
    <div id="fast-checkout-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
      
      {/* Checkout Container Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200/90 shadow-xl overflow-hidden">
        
        {/* Top Header & Steps Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-lime-50 px-6 sm:px-10 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#5A189A] font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Doorstep Verification & COD Protected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Fast, Secure & Easy Checkout
            </h2>
          </div>

          {/* Steps Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cart
            </span>
            <span>&rarr;</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Address
            </span>
            <span>&rarr;</span>
            <span className="flex items-center gap-1 text-[#5A189A]">
              <span className="w-4 h-4 rounded-full bg-[#5A189A] text-white flex items-center justify-center text-[10px]">3</span> Payment
            </span>
            <span>&rarr;</span>
            <span className="text-gray-400">Done</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {orderError && (
          <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-sm font-semibold">{orderError}</p>
          </div>
        )}

        {/* Success View */}
        {orderSuccess ? (
          <div className="p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed · Cash on Delivery
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
                Thank You, {orderSuccess.customer_name}!
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Your order has been recorded in our dispatch system. We will call you before delivery!
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-xs text-gray-500">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-gray-900">{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Item:</span>
                <span className="font-bold text-gray-900">{orderSuccess.product_name} ({orderSuccess.product_variant})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Quantity:</span>
                <span className="font-semibold text-gray-900">{orderSuccess.quantity} unit(s)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                  {orderSuccess.address}, {orderSuccess.city}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 text-base">
                <span className="font-bold text-gray-900">Total Cash Due at Door:</span>
                <span className="text-2xl font-black text-emerald-700 tabular-nums">
                  {settings.currencySymbol}{Number(orderSuccess.total_amount || grandTotal).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> Our assigned delivery courier will contact you at <strong>{orderSuccess.phone}</strong> when approaching your address. Please keep exact cash or your UPI app ready.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openTrackingModal(orderSuccess.id)}
                className="w-full sm:w-auto bg-[#5A189A] hover:bg-purple-700 text-white font-bold text-sm px-7 py-3 rounded-full transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#C4F000]" />
                <span>Track Order Live</span>
              </button>
              <button
                onClick={resetOrderView}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm px-7 py-3 rounded-full transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            
            {/* Left 7 Cols: Customer Info & Payment Methods */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
              
              {/* Shipping Form */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#5A189A]" />
                  <span>1. Delivery Details</span>
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Where should we send your parcel? No upfront payment required.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) => {
                          setFormData({ ...formData, customer_name: e.target.value });
                          if (formErrors.customer_name) setFormErrors({ ...formErrors, customer_name: '' });
                        }}
                        placeholder="e.g. Jessica Alba"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-200 transition ${
                          formErrors.customer_name ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {formErrors.customer_name && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.customer_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                          }}
                          placeholder="e.g. +1 (555) 019-2834"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-200 transition ${
                            formErrors.phone ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {formErrors.phone ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.phone}</p>
                      ) : (
                        <p className="text-[11px] text-gray-400 mt-1">Delivery boy will call this number</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jessica@example.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Street Address & Apt / Landmark *
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                      }}
                      placeholder="e.g. 104 Sunset Boulevard, Apartment 4B, near Metro station"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-200 transition resize-none ${
                        formErrors.address ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                        }}
                        placeholder="e.g. Los Angeles"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-200 transition ${
                          formErrors.city ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Leave with security if away"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section (Custom QR code, COD, etc.) */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>2. Select Payment Method</span>
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Select your preferred payment choice. Admin can configure custom payment methods anytime.
                </p>

                <div className="space-y-3">
                  {/* COD Option */}
                  {paymentConfig.enableCod && (
                    <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                            <span>Cash on Delivery (COD)</span>
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Most Popular
                            </span>
                          </span>
                          <span className="text-xs font-bold text-emerald-700">FREE</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pay cash or scan courier's QR code only when package arrives at your door.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Custom UPI / Payment QR Option */}
                  {paymentConfig.enableUpiQr && (
                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'upi_qr'
                        ? 'border-[#5A189A] bg-purple-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === 'upi_qr'}
                          onChange={() => setPaymentMethod('upi_qr')}
                          className="mt-1 text-[#5A189A] focus:ring-purple-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                              <span>Custom Payment QR / UPI Scan & Pay</span>
                              <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Instant Verification
                              </span>
                            </span>
                            <QrCode className="w-5 h-5 text-[#5A189A]" />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Scan merchant QR code using Google Pay, PhonePe, Paytm or banking app.
                          </p>
                        </div>
                      </label>

                      {/* Strict UPI Payment & QR Verification Block */}
                      {paymentMethod === 'upi_qr' && (
                        <div id="upi-payment-block" className="mt-4 pt-4 border-t border-purple-200/60 space-y-4">
                          
                          {/* Alert Notice for UPI */}
                          <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                            upiVerified 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                              : formErrors.upiPayment || upiError
                              ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse'
                              : 'bg-purple-50/80 border-purple-200 text-purple-900'
                          }`}>
                            {upiVerified ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-bold text-sm">
                                {upiVerified 
                                  ? '✓ UPI Payment Completed & Verified!'
                                  : 'Mandatory Payment Step: Complete Payment Before Proceeding'}
                              </p>
                              <p className="text-[11px] mt-0.5 opacity-90">
                                {upiVerified
                                  ? `Transaction reference locked: ${upiTransactionId}. Your order is now ready to submit.`
                                  : 'Please scan the QR or pay via UPI, enter your 12-digit Transaction/UTR number, and upload proof. Without payment completion, this order cannot proceed.'}
                              </p>
                            </div>
                          </div>

                          {/* Step 1: Merchant QR & UPI Details Card */}
                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                            <div className="w-32 h-32 rounded-xl border border-gray-200 p-1.5 bg-white shrink-0 shadow-sm flex items-center justify-center overflow-hidden">
                              {paymentConfig.customUploadedFile && !paymentConfig.customUploadedFile.type.startsWith('image/') ? (
                                <div className="flex flex-col items-center justify-center p-2 text-center">
                                  <FileText className="w-10 h-10 text-[#5A189A] mb-1" />
                                  <span className="text-[9px] font-bold text-gray-700 truncate max-w-[90px]">
                                    {paymentConfig.customUploadedFile.name}
                                  </span>
                                </div>
                              ) : (
                                <img
                                  src={paymentConfig.upiQrImageUrl}
                                  alt="Merchant Payment QR"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=dealkart%40upi';
                                  }}
                                />
                              )}
                            </div>

                            <div className="space-y-2 text-center sm:text-left text-xs flex-1">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Official Merchant</span>
                                <p className="font-bold text-gray-900 text-sm">{paymentConfig.upiMerchantName}</p>
                              </div>

                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="text-gray-700 font-mono bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs font-semibold">
                                  {paymentConfig.upiId}
                                </span>
                                <button
                                  type="button"
                                  onClick={handleCopyUpiId}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  {upiCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                                      <span>Copy UPI</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="pt-1">
                                <span className="text-[11px] text-gray-500 block">Exact Transfer Amount:</span>
                                <span className="text-lg font-black text-purple-900">
                                  {settings.currencySymbol}{grandTotal.toFixed(2)}
                                </span>
                              </div>

                              {/* Merchant Custom File Download Link if provided */}
                              {paymentConfig.customUploadedFile && (
                                <div className="pt-1">
                                  <a
                                    href={paymentConfig.customUploadedFile.url}
                                    download={paymentConfig.customUploadedFile.name}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-[#5A189A] rounded-lg text-xs font-bold transition"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download Merchant Payment Slip</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Merchant Custom Payment Instructions */}
                          {paymentConfig.customPaymentInstructions && (
                            <div className="p-3 bg-purple-100/60 border border-purple-200 rounded-xl text-xs text-purple-900">
                              <strong>Merchant Instructions:</strong> {paymentConfig.customPaymentInstructions}
                            </div>
                          )}

                          {/* Step 2: Enter Transaction ID / UTR Number (Mandatory) */}
                          <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs font-bold text-gray-800">
                              1. Enter 12-Digit UPI Transaction / UTR Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={upiTransactionId}
                              onChange={(e) => {
                                setUpiTransactionId(e.target.value);
                                setUpiVerified(false);
                                if (formErrors.upiTransactionId) {
                                  setFormErrors(prev => {
                                    const next = { ...prev };
                                    delete next.upiTransactionId;
                                    return next;
                                  });
                                }
                              }}
                              placeholder="e.g. 428910284918 (from Google Pay, PhonePe, Paytm, BHIM)"
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono outline-none transition ${
                                formErrors.upiTransactionId
                                  ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                                  : 'border-gray-300 focus:border-[#5A189A] bg-white'
                              }`}
                            />
                            {formErrors.upiTransactionId && (
                              <p className="text-[11px] text-rose-600 font-semibold">{formErrors.upiTransactionId}</p>
                            )}
                            <p className="text-[10px] text-gray-400">
                              Found under "Transaction Details" or "UPI Ref ID" in your payment app.
                            </p>
                          </div>

                          {/* Step 3: Upload Payment Screenshot / Receipt (Mandatory) */}
                          <div className={`p-4 bg-white rounded-xl border space-y-2.5 ${
                            formErrors.customerFileAttachment ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-[#5A189A]" />
                                <span>2. Upload Payment Proof / Screenshot <span className="text-rose-500">*</span></span>
                              </span>
                              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                                Required for UPI
                              </span>
                            </div>

                            {customerFileAttachment ? (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">
                                      {customerFileAttachment.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                      {(customerFileAttachment.size / 1024).toFixed(1)} KB · Proof Attached
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRemoveCustomerFile}
                                  className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-purple-50/50 border border-dashed border-gray-300 hover:border-purple-400 rounded-xl text-xs font-bold text-gray-700 hover:text-[#5A189A] transition cursor-pointer gap-1 text-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5A189A] flex items-center justify-center mb-1">
                                  <Paperclip className="w-4 h-4" />
                                </div>
                                <span>Click or Drag to Upload Payment Screenshot</span>
                                <span className="text-[10px] text-gray-400 font-normal">Supports JPG, PNG, PDF, WEBP (Any File Type)</span>
                                <input
                                  type="file"
                                  accept="*"
                                  onChange={(e) => {
                                    handleCustomerFileUpload(e);
                                    if (formErrors.customerFileAttachment) {
                                      setFormErrors(prev => {
                                        const next = { ...prev };
                                        delete next.customerFileAttachment;
                                        return next;
                                      });
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            )}

                            {formErrors.customerFileAttachment && (
                              <p className="text-[11px] text-rose-600 font-semibold">{formErrors.customerFileAttachment}</p>
                            )}
                          </div>

                          {/* Step 4: Confirmation Checkbox */}
                          <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isUpiPaymentConfirmed}
                                onChange={(e) => {
                                  setIsUpiPaymentConfirmed(e.target.checked);
                                  setUpiVerified(false);
                                  if (formErrors.isUpiPaymentConfirmed) {
                                    setFormErrors(prev => {
                                      const next = { ...prev };
                                      delete next.isUpiPaymentConfirmed;
                                      return next;
                                    });
                                  }
                                }}
                                className="mt-0.5 w-4 h-4 accent-[#5A189A] rounded cursor-pointer"
                              />
                              <div className="text-xs text-gray-700">
                                <span className="font-bold">
                                  I confirm that I have sent {settings.currencySymbol}{grandTotal.toFixed(2)} to {paymentConfig.upiId}
                                </span>
                                <span className="block text-[11px] text-gray-500 mt-0.5">
                                  I understand my order will only be processed after verification of this authentic UPI reference.
                                </span>
                              </div>
                            </label>
                            {formErrors.isUpiPaymentConfirmed && (
                              <p className="text-[11px] text-rose-600 font-semibold mt-1.5 pl-6">{formErrors.isUpiPaymentConfirmed}</p>
                            )}
                          </div>

                          {/* Step 5: Verify & Confirm Payment Button */}
                          {upiError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>{upiError}</span>
                            </div>
                          )}

                          <div className="pt-1">
                            {upiVerified ? (
                              <div className="p-3.5 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                  <span>Payment Step Completed & Verified</span>
                                </div>
                                <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-md">
                                  Cleared to Place Order
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleVerifyUpiPayment}
                                disabled={upiVerifying}
                                className="w-full bg-[#5A189A] hover:bg-purple-700 active:scale-99 text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                {upiVerifying ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin text-[#C4F000]" />
                                    <span>Verifying UPI Transaction Details...</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="w-4 h-4 text-[#C4F000]" />
                                    <span>Verify & Confirm My UPI Payment ({settings.currencySymbol}{grandTotal.toFixed(2)})</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentConfig.enableBankTransfer && (
                    <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">Direct Bank Transfer</span>
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {paymentConfig.bankDetails}
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Card Payment */}
                  {paymentConfig.enableCard && (
                    <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">Credit / Debit Card at Doorstep</span>
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Courier carries a wireless POS terminal. Swipe or tap on delivery.
                        </p>
                      </div>
                    </label>
                  )}
                </div>

              </div>

            </div>

            {/* Right 5 Cols: Live Order Summary (Price x Quantity) */}
            <div className="lg:col-span-5 p-6 sm:p-10 bg-gray-50/70 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-base text-gray-900">Order Summary</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Live Calculation
                  </span>
                </div>

                {/* Product Select Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedProduct?.image}
                        alt={selectedProduct?.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-purple-700 uppercase">
                          {selectedProduct?.category}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                          {selectedProduct?.name}
                        </h4>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900 tabular-nums">
                          {settings.currencySymbol}{unitPrice.toFixed(2)}
                        </span>
                        {selectedProduct?.originalPrice > unitPrice && (
                          <span className="text-xs text-gray-400 line-through tabular-nums">
                            {settings.currencySymbol}{selectedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Switch Product Dropdown if user wants to change item in checkout */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Change Item:
                    </label>
                    <select
                      value={selectedProduct?.id}
                      onChange={(e) => {
                        const found = products.find((p) => p.id === e.target.value);
                        if (found) {
                          setSelectedProduct(found);
                          setSelectedVariant(found.variants[0] || 'Standard');
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-600"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {settings.currencySymbol}{p.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variant Selection */}
                  {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Select Variant / Color:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.variants.map((v) => {
                          const isSel = selectedVariant === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setSelectedVariant(v)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-[#130428] text-white shadow-xs'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-black text-gray-900 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Pricing Breakdown */}
                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({quantity}x Item)</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {settings.currencySymbol}{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Express Doorstep Shipping</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-gray-600">
                      <span>Cash on Delivery Handling</span>
                      <span className="font-bold text-emerald-700">
                        {codFee === 0 ? 'FREE' : `${settings.currencySymbol}${codFee.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-300 flex justify-between items-baseline text-sm">
                    <span className="font-black text-gray-900">Total Due on Delivery:</span>
                    <span className="text-2xl font-black text-emerald-700 tabular-nums">
                      {settings.currencySymbol}{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                {paymentMethod === 'upi_qr' && !upiVerified ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-98 text-white font-black text-sm sm:text-base py-4 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-5 h-5 text-amber-200" />
                      <span>Complete UPI Payment to Proceed ({settings.currencySymbol}{grandTotal.toFixed(2)})</span>
                    </button>
                    <p className="text-center text-xs text-amber-800 font-bold mt-2.5 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Payment Required: First scan QR, enter 12-digit UTR, and upload receipt above.</span>
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full bg-[#130428] hover:bg-[#5A189A] active:scale-98 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-black text-base py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending Order to Supabase...</span>
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'upi_qr' ? (
                            <CheckCircle2 className="w-5 h-5 text-[#C4F000]" />
                          ) : (
                            <Banknote className="w-5 h-5 text-[#C4F000]" />
                          )}
                          <span>
                            {paymentMethod === 'upi_qr' 
                              ? `Place Order (UPI Paid: ${settings.currencySymbol}${grandTotal.toFixed(2)})`
                              : `Place Cash on Delivery Order (${settings.currencySymbol}${grandTotal.toFixed(2)})`} &rarr;
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-gray-500 mt-2.5">
                      {paymentMethod === 'upi_qr'
                        ? '🛡️ UPI transaction locked and cross-verified with instant dispatch.'
                        : '🛡️ 100% Cash on Delivery Protected. Pay nothing until inspected.'}
                    </p>
                  </>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
