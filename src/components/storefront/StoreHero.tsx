import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Clock, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const StoreHero: React.FC = () => {
  const { settings } = useStore();

  const scrollToDeals = () => {
    const el = document.getElementById('daily-deals-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col lg:flex-row relative min-h-[440px]">
        
        {/* Left Column: Copy & CTAs */}
        <div className="p-8 sm:p-12 lg:w-[55%] flex flex-col justify-center z-10">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#130428] leading-[1.08] mb-4 tracking-tight">
            {settings.heroTitle.includes('.') ? (
              <>
                {settings.heroTitle.split('.')[0]}.<br />
                <span className="text-[#5A189A]">{settings.heroTitle.split('.')[1]}</span>
              </>
            ) : (
              settings.heroTitle
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-7 font-medium">
            {settings.heroSubtitle}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <span className="bg-[#E7F6C8] text-green-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#C4F000]/40 shadow-xs">
              <Tag className="w-3.5 h-3.5 text-green-800" />
              <span>Up To 80% Off</span>
            </span>

            <span className="bg-[#F3E8FF] text-purple-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#5A189A]/20 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-purple-800" />
              <span>Limited Time</span>
            </span>

            <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-gray-200">
              <Award className="w-3.5 h-3.5 text-gray-700" />
              <span>Top Brands</span>
            </span>

            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Cash on Delivery</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToDeals}
              className="bg-[#5A189A] hover:bg-purple-800 active:scale-95 text-white px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Today's Deals</span>
              <ArrowRight className="w-5 h-5 text-[#C4F000]" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('fast-checkout-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-gray-200 hover:border-gray-900 text-gray-800 hover:text-black px-6 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer"
            >
              Direct COD Order
            </button>
          </div>

        </div>

        {/* Right Column: Hero Graphic */}
        <div className="lg:w-[45%] relative min-h-[320px] lg:min-h-full bg-gradient-to-br from-purple-100 via-indigo-50 to-amber-50 overflow-hidden flex items-center justify-center p-4">
          <img
            src={settings.heroImageUrl}
            alt="DealKart Shopping Banner"
            className="w-full h-full object-cover rounded-2xl shadow-inner mix-blend-multiply"
            onError={(e) => {
              // Fallback
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Floating discount tags over banner */}
          <div className="absolute top-6 right-6 bg-[#130428] text-[#C4F000] text-xs font-black px-3.5 py-1.5 rounded-full shadow-xl uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hot Deals Live</span>
          </div>

          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-3 shadow-xl max-w-xs hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold shrink-0">
              COD
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Doorstep Verification</p>
              <p className="text-[11px] text-gray-500">Inspect before paying cash</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
