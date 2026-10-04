import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Zap, RotateCcw, ShieldCheck, Headphones, Heart } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { settings, setActiveView } = useStore();

  return (
    <footer className="bg-[#0b0318] text-white pt-12 pb-8 border-t border-purple-900/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4F000]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">30-Day Returns</h4>
              <p className="text-xs text-gray-400">Doorstep exchange on all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4F000]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">100% Authentic</h4>
              <p className="text-xs text-gray-400">Directly sourced brand items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4F000]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Customer Support 24/7</h4>
              <p className="text-xs text-gray-400">{settings.supportPhone} · {settings.supportEmail}</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 text-xs text-gray-400">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#5A189A] rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#C4F000] fill-[#C4F000]" />
              </div>
              <span className="font-black text-xl text-white">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
              {settings.tagline}. Discover unbeatable daily flash deals and order with 100% peace of mind using our verified Cash on Delivery network.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('admin')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => setActiveView('delivery')}
                className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                Delivery Driver Portal
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Shop</h5>
            <ul className="space-y-2">
              <li><a href="#categories-section" className="hover:text-white">All Categories</a></li>
              <li><a href="#daily-deals-section" className="hover:text-white">Today's Deals</a></li>
              <li><a href="#bundle-section" className="hover:text-white">Bundles</a></li>
              <li><a href="#limited-drops-section" className="hover:text-white">New Arrivals</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Help</h5>
            <ul className="space-y-2">
              <li><a href="#fast-checkout-section" className="hover:text-white">Track Order</a></li>
              <li><a href="#fast-checkout-section" className="hover:text-white">Returns & COD</a></li>
              <li><a href="#coupons-section" className="hover:text-white">FAQ</a></li>
              <li><a href={`mailto:${settings.supportEmail}`} className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. | Great Finds. Better Prices.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Cash-on-Delivery commerce</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
