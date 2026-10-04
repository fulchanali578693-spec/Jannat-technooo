import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQty, 
    removeFromCart, 
    cartTotal, 
    settings 
  } = useStore();

  if (!isCartOpen) return null;

  const scrollToCheckout = () => {
    setIsCartOpen(false);
    const el = document.getElementById('fast-checkout-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#5A189A]" />
              <h3 className="font-bold text-lg text-gray-900">Your Shopping Bag</h3>
              <span className="bg-[#130428] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>

            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-black p-1 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-gray-300 mb-3" />
                <p className="text-base font-bold text-gray-700">Your cart is currently empty</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Discover daily flash deals with free Cash on Delivery available at checkout.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 bg-[#5A189A] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow hover:bg-purple-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.productId}-${item.variant}`}
                  className="flex gap-4 p-3 bg-gray-50/80 rounded-2xl border border-gray-200/80"
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1 pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variant)}
                          className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-500">{item.variant}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQty(item.productId, item.variant, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.variant, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-gray-900 tabular-nums">
                        {settings.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {settings.currencySymbol}{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cash on Delivery</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Estimated Total</span>
                  <span className="text-xl tabular-nums">
                    {settings.currencySymbol}{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={scrollToCheckout}
                className="w-full bg-[#130428] hover:bg-[#5A189A] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C4F000]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pay cash or UPI after doorstep package inspection</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
