import React from 'react';
import { Gift, Crown, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  const scrollToCheckout = () => {
    const el = document.getElementById('fast-checkout-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="bundle-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Banner: Bundle Savings */}
        <div className="bg-[#E7F6C8] rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group border border-[#c5f000]/40 shadow-sm">
          <div className="absolute top-6 right-6 bg-[#130428] text-[#C4F000] text-xs uppercase tracking-wider font-black px-3.5 py-1.5 rounded-full z-10 shadow-md">
            Up To 70% Off
          </div>

          <div className="max-w-md relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-[#5A189A]" />
              <h3 className="text-3xl sm:text-4xl font-black text-[#130428] tracking-tight">
                Bundle Savings
              </h3>
            </div>
            
            <p className="text-green-950 font-semibold text-lg mb-6">
              Buy More. Save More! Combine top products and get extra savings at doorstep.
            </p>

            <button
              onClick={scrollToCheckout}
              className="bg-[#130428] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center gap-2 w-max cursor-pointer"
            >
              <span>Explore Bundles</span>
              <ArrowRight className="w-4 h-4 text-[#C4F000]" />
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-green-800/10 flex items-center gap-2 text-xs font-semibold text-green-900">
            <ShieldCheck className="w-4 h-4 text-green-800" />
            <span>Pay on delivery available on all bundle orders</span>
          </div>
        </div>

        {/* Right Banner: Member Exclusive */}
        <div className="bg-gradient-to-br from-[#5A189A] to-[#29074b] rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group shadow-sm text-white">
          <div className="max-w-md relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Member Exclusive
              </h3>
            </div>

            <p className="text-purple-200 font-medium mb-5 text-sm sm:text-base">
              Join DealKart+ for Free Express Shipping & Extra Perks!
            </p>

            <ul className="text-xs sm:text-sm space-y-2.5 mb-7 font-medium text-purple-100">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#C4F000]" />
                </div>
                <span>Extra 10% Member Discount on all orders</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#C4F000]" />
                </div>
                <span>Early Access to Limited Drops & Flash Deals</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#C4F000]" />
                </div>
                <span>Free Doorstep Cash on Delivery & Priority Courier</span>
              </li>
            </ul>

            <button
              onClick={scrollToCheckout}
              className="bg-amber-400 hover:bg-amber-300 text-[#130428] px-7 py-3.5 rounded-full font-black text-sm shadow-xl transition-all flex items-center gap-2 w-max cursor-pointer"
            >
              <span>Join DealKart+ &rarr;</span>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-purple-400/20 flex items-center gap-2 text-xs font-semibold text-purple-300">
            <span>Instant membership activation with your first COD order</span>
          </div>
        </div>

      </div>
    </div>
  );
};
