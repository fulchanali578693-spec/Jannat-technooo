import React from 'react';
import { 
  Shirt, 
  Smartphone, 
  Sofa, 
  Sparkles, 
  Dumbbell, 
  ShoppingBag, 
  Gamepad2, 
  Glasses, 
  ArrowRight 
} from 'lucide-react';

interface CategoryRowProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { name: 'Fashion', icon: Shirt, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { name: 'Home & Living', icon: Sofa, color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
    { name: 'Beauty', icon: Sparkles, color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { name: 'Sports', icon: Dumbbell, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { name: 'Groceries', icon: ShoppingBag, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { name: 'Toys & Hobbies', icon: Gamepad2, color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
    { name: 'Accessories', icon: Glasses, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  ];

  return (
    <div id="categories-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Shop By Category
        </h2>
        <button
          onClick={() => onSelectCategory('')}
          className="text-xs sm:text-sm font-bold text-gray-500 hover:text-[#5A189A] transition flex items-center gap-1 cursor-pointer"
        >
          <span>{selectedCategory ? 'Show All Categories' : 'View All'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Icons Row */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const Icon = cat.icon;

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
              className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#5A189A] text-white shadow-xl shadow-purple-900/30 ring-4 ring-purple-200 scale-105'
                    : `${cat.color} border border-white/60 group-hover:-translate-y-1 group-hover:shadow-md`
                }`}
              >
                <Icon className={`w-8 h-8 sm:w-9 sm:h-9 ${isSelected ? 'text-[#C4F000]' : ''}`} />
              </div>

              <span
                className={`text-xs sm:text-sm font-bold text-center transition-colors ${
                  isSelected ? 'text-[#5A189A]' : 'text-gray-700 group-hover:text-black'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
