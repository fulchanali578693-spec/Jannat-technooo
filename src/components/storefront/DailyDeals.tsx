import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  Zap, 
  Clock, 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowRight, 
  Check,
  Banknote
} from 'lucide-react';

interface DailyDealsProps {
  selectedCategory?: string;
  searchQuery?: string;
  onInstantBuy: (product: Product) => void;
}

export const DailyDeals: React.FC<DailyDealsProps> = ({
  selectedCategory,
  searchQuery,
  onInstantBuy,
}) => {
  const { products, addToCart, settings } = useStore();

  // Ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 24,
    seconds: 51,
  });

  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Filter products
  let dealProducts = products.filter((p) => p.isDailyDeal);
  if (dealProducts.length === 0) {
    dealProducts = products.slice(0, 4);
  }

  if (selectedCategory) {
    dealProducts = products.filter((p) => p.category === selectedCategory);
  }

  if (searchQuery) {
    dealProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div id="daily-deals-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#130428] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A189A] rounded-full filter blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900 rounded-full filter blur-[100px] opacity-30 pointer-events-none" />

        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 relative z-10">
          
          {/* Title */}
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <Zap className="w-7 h-7 text-[#C4F000] animate-pulse fill-[#C4F000]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                Daily Deals
                <span className="text-xs bg-[#C4F000] text-[#130428] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Now
                </span>
              </h2>
              <p className="text-gray-400 font-medium text-xs sm:text-sm mt-0.5">
                Fresh Deals Every 24 Hours! · Cash on Delivery available on all items
              </p>
            </div>
          </div>

          {/* Countdown & Action */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Countdown Box */}
            <div className="flex items-center gap-2 text-white bg-black/40 px-4 sm:px-5 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <span className="text-xs font-semibold text-gray-300 mr-1 hidden sm:inline">
                Ends In:
              </span>

              <div className="text-center min-w-[28px]">
                <div className="font-mono font-bold text-lg sm:text-xl leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[9px] text-gray-400 uppercase font-bold mt-0.5">Hrs</div>
              </div>

              <span className="text-lg font-bold pb-2 opacity-50">:</span>

              <div className="text-center min-w-[28px]">
                <div className="font-mono font-bold text-lg sm:text-xl leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[9px] text-gray-400 uppercase font-bold mt-0.5">Min</div>
              </div>

              <span className="text-lg font-bold pb-2 opacity-50">:</span>

              <div className="text-center min-w-[28px]">
                <div className="font-mono font-bold text-lg sm:text-xl leading-none text-[#C4F000]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[9px] text-[#C4F000] uppercase font-bold mt-0.5">Sec</div>
              </div>
            </div>

            <button 
              onClick={() => {
                const el = document.getElementById('popular-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#C4F000] hover:bg-[#b0d800] text-[#130428] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg shadow-lime-500/20 whitespace-nowrap cursor-pointer"
            >
              View All Deals &rarr;
            </button>

          </div>

        </div>

        {/* 4 Daily Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {dealProducts.slice(0, 4).map((product) => {
            const isAdded = addedIds[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 sm:p-5 flex flex-col justify-between group relative shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1.5"
              >
                {/* Top Badge & Wishlist */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {product.discountBadge}
                  </span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Image */}
                <div className="h-44 w-full flex items-center justify-center relative overflow-hidden bg-gray-50/80 rounded-2xl p-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider mb-1">
                    {product.category}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5 group-hover:text-[#5A189A] transition-colors">
                    {product.name}
                  </h3>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 text-xs text-amber-400 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-gray-500 font-medium text-[11px] ml-1">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-4 mt-auto">
                    <span className="text-2xl font-black text-gray-900 tabular-nums">
                      {settings.currencySymbol}{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-medium tabular-nums">
                      {settings.currencySymbol}{product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isAdded
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-[#5A189A] text-[#5A189A] hover:bg-[#5A189A] hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onInstantBuy(product)}
                      className="w-full bg-[#130428] hover:bg-[#5A189A] text-white py-2.5 px-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Banknote className="w-3.5 h-3.5 text-[#C4F000]" />
                      <span>COD Buy</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
