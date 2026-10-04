import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Rocket, Sparkles, ArrowRight, Banknote } from 'lucide-react';

interface LimitedDropsProps {
  onInstantBuy: (product: Product) => void;
}

export const LimitedDrops: React.FC<LimitedDropsProps> = ({ onInstantBuy }) => {
  const { products, settings } = useStore();

  const dropItems = products.filter((p) => p.isLimitedDrop).slice(0, 4);

  return (
    <div id="limited-drops-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0b0318] text-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-purple-900/40 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-20 pointer-events-none" />

        {/* Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Limited Drops</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Fast Selling
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-purple-200">
                Rare Finds. Limited Stock! Order via Cash on Delivery before they sell out.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('fast-checkout-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#C4F000] hover:bg-[#b0d800] text-[#130428] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-lime-500/10 cursor-pointer"
          >
            <span>Shop Limited</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Drops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {dropItems.map((product) => {
            return (
              <div
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="h-40 w-full flex items-center justify-center bg-black/20 rounded-xl p-3 mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-lg font-black text-[#C4F000] tabular-nums">
                      {settings.currencySymbol}{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through tabular-nums">
                      {settings.currencySymbol}{product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Stock pill */}
                  <div className="w-full bg-black/40 rounded-full py-1 px-3 text-[11px] font-bold text-center border border-white/10 mb-3 text-amber-300">
                    Only {product.stockLeft || 250} Left In Stock
                  </div>

                  <button
                    type="button"
                    onClick={() => onInstantBuy(product)}
                    className="w-full bg-[#5A189A] hover:bg-purple-600 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Banknote className="w-3.5 h-3.5 text-[#C4F000]" />
                    <span>Instant COD Order</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
