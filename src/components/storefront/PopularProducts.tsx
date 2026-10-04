import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  Flame, 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowRight, 
  Check, 
  Banknote 
} from 'lucide-react';

interface PopularProductsProps {
  onInstantBuy: (product: Product) => void;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ onInstantBuy }) => {
  const { products, addToCart, settings } = useStore();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const popularItems = products.filter((p) => p.isPopular).slice(0, 6);

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div id="popular-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Heading */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Popular Products
          </h2>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('daily-deals-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-bold text-gray-500 hover:text-[#5A189A] transition flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6 Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {popularItems.map((product) => {
          const isAdded = addedIds[product.id];

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between group relative border border-gray-200/80 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Top Icons */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                <button 
                  type="button" 
                  className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                  title="Wishlist"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product Image */}
              <div className="h-36 sm:h-40 w-full flex items-center justify-center bg-gray-50/80 rounded-xl p-2 mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60';
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#5A189A] transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-2">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-gray-500 font-medium">({product.rating})</span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-3 mt-auto">
                  <span className="text-base sm:text-lg font-black text-gray-900 tabular-nums">
                    {settings.currencySymbol}{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[11px] text-gray-400 line-through tabular-nums">
                      {settings.currencySymbol}{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                      isAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-gray-200 text-gray-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {isAdded ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    <span className="text-[11px]">Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onInstantBuy(product)}
                    className="bg-[#130428] hover:bg-[#5A189A] text-white py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Banknote className="w-3 h-3 text-[#C4F000]" />
                    <span className="text-[11px]">Buy</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
