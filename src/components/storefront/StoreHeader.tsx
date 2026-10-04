import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Zap, 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  ShieldCheck, 
  Truck, 
  ChevronDown, 
  Bell, 
  Menu, 
  X,
  Store,
  Sparkles
} from 'lucide-react';

interface StoreHeaderProps {
  onSearchChange?: (query: string) => void;
  onCategorySelect?: (cat: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ 
  onSearchChange, 
  onCategorySelect 
}) => {
  const { 
    settings, 
    cart, 
    setIsCartOpen, 
    activeView, 
    setActiveView, 
    isAdminLoggedIn,
    firebaseUser,
    customerLogout,
    setIsCustomerLoginModalOpen,
    openTrackingModal
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(searchQuery);
    const dealsSection = document.getElementById('daily-deals-section');
    if (dealsSection) dealsSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (onCategorySelect) onCategorySelect(cat);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-[#130428] text-white text-xs py-2 px-4 text-center font-medium border-b border-purple-900/40 flex items-center justify-center gap-2">
          <span>{settings.announcementText}</span>
          <span className="hidden sm:inline-block bg-[#C4F000] text-[#130428] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            COD Available
          </span>
        </div>
      )}

      {/* Main DealKart Header */}
      <header className="bg-[#130428] text-white sticky top-0 z-40 shadow-xl transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
            
            {/* Left: Brand Logo & Tagline */}
            <div 
              onClick={() => setActiveView('store')} 
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 bg-[#5A189A] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/60 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-[#C4F000] fill-[#C4F000]" />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-gray-300 bg-clip-text text-transparent">
                  {settings.storeName}
                </span>
                <span className="block text-[10px] font-medium text-purple-300 tracking-wider -mt-1">
                  {settings.tagline}
                </span>
              </div>
            </div>

            {/* Center: Search Bar with Category Select */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex-1 max-w-2xl hidden md:flex items-center"
            >
              <div className="flex w-full rounded-full overflow-hidden bg-white/10 border border-white/20 focus-within:bg-white focus-within:border-white transition-all duration-300 shadow-inner group">
                <select 
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-transparent text-gray-300 group-focus-within:text-gray-800 px-4 py-2.5 outline-none text-xs font-semibold hidden lg:block cursor-pointer border-r border-white/10 group-focus-within:border-gray-200"
                >
                  <option value="" className="text-black">All categories</option>
                  <option value="Electronics" className="text-black">Electronics</option>
                  <option value="Fashion" className="text-black">Fashion</option>
                  <option value="Home & Living" className="text-black">Home & Living</option>
                  <option value="Beauty" className="text-black">Beauty</option>
                  <option value="Accessories" className="text-black">Accessories</option>
                  <option value="Toys & Hobbies" className="text-black">Toys & Hobbies</option>
                </select>

                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  placeholder="Search deals, brands, products..." 
                  className="flex-1 px-4 py-2.5 outline-none text-sm w-full bg-transparent text-white group-focus-within:text-black placeholder-gray-400"
                />

                <button 
                  type="submit" 
                  className="text-white group-focus-within:text-[#130428] px-5 py-2.5 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right: Actions, Portals & Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium">
              
              {/* Quick Navigation Toggle: Admin Dashboard */}
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-[#C4F000] text-[#130428] shadow-md shadow-lime-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Open Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-[#C4F000]" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              {/* Quick Navigation Toggle: Delivery Portal */}
              <button
                onClick={() => setActiveView('delivery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'delivery'
                    ? 'bg-[#C4F000] text-[#130428] shadow-md shadow-lime-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Open Delivery Driver Portal"
              >
                <Truck className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Delivery Boy</span>
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => {
                  const section = document.getElementById('popular-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hidden sm:block text-gray-300 hover:text-white transition p-2 cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-300 hover:text-[#C4F000] transition flex items-center p-2 group cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-1 bg-[#C4F000] text-[#130428] text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-scale">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Track Order Live Button */}
              <button
                onClick={() => openTrackingModal()}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                title="Track Live Order Status"
              >
                <Truck className="w-3.5 h-3.5 text-[#C4F000]" />
                <span>Track Order</span>
              </button>

              {/* Customer User Info & Logout or Sign In */}
              {firebaseUser ? (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                  <button
                    onClick={() => openTrackingModal()}
                    className="w-8 h-8 rounded-full bg-[#5A189A] hover:bg-purple-700 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-white transition cursor-pointer shadow-xs"
                    title="View Profile & Orders"
                  >
                    {firebaseUser.email ? firebaseUser.email[0].toUpperCase() : 'U'}
                  </button>
                  <div className="text-left text-[11px]">
                    <button
                      onClick={() => openTrackingModal()}
                      className="block font-bold text-gray-200 hover:text-[#C4F000] truncate max-w-[110px] transition text-left cursor-pointer"
                      title="Open Profile & Tracking"
                    >
                      {firebaseUser.email?.split('@')[0]}
                    </button>
                    <button
                      onClick={customerLogout}
                      className="text-gray-400 hover:text-rose-400 transition cursor-pointer text-[10px]"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCustomerLoginModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <User className="w-3.5 h-3.5 text-[#C4F000]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Fast Checkout Jump Button */}
              <button 
                onClick={() => {
                  const chk = document.getElementById('fast-checkout-section');
                  if (chk) chk.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#5A189A] hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition shadow-lg shadow-purple-900/40 hidden md:flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#C4F000]" />
                <span>Instant COD</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>

          {/* Secondary Nav Bar */}
          <div className="flex items-center justify-between py-3 border-t border-white/10 text-xs sm:text-sm font-semibold overflow-x-auto text-gray-300 scrollbar-none">
            <div className="flex items-center gap-4 sm:gap-7 whitespace-nowrap">
              <button 
                onClick={() => {
                  const catEl = document.getElementById('categories-section');
                  if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="flex items-center gap-2 hover:text-white cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#C4F000]" />
                <span>Categories</span>
              </button>
              
              <a href="#daily-deals-section" className="hover:text-white transition">
                Today's Deals
              </a>
              <a href="#bundle-section" className="hover:text-white transition">
                Bundles
              </a>
              <a href="#popular-section" className="hover:text-white transition">
                Popular Products
              </a>
              <a href="#limited-drops-section" className="hover:text-white transition">
                Limited Drops
              </a>
              <a href="#coupons-section" className="hover:text-white transition">
                Coupons
              </a>
              <a href="#fast-checkout-section" className="text-[#C4F000] hover:text-white transition flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pay on Delivery</span>
              </a>
            </div>

            <button 
              onClick={() => {
                const coup = document.getElementById('coupons-section');
                if (coup) coup.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden lg:flex items-center gap-1.5 border border-[#C4F000]/50 text-[#C4F000] px-3 py-1 rounded-full hover:bg-[#C4F000] hover:text-[#130428] transition whitespace-nowrap text-xs font-bold cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Deal Alerts</span>
            </button>
          </div>

          {/* Mobile search expanded */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-white/10">
              <form onSubmit={handleSearchSubmit} className="flex rounded-full overflow-hidden bg-white/10 border border-white/20">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals, products..."
                  className="px-4 py-2 text-sm w-full bg-transparent text-white outline-none"
                />
                <button type="submit" className="px-4 text-white">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button 
                  onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
                  className="bg-[#5A189A] text-white py-2 rounded-lg text-xs font-bold text-center"
                >
                  Admin Dashboard
                </button>
                <button 
                  onClick={() => { setActiveView('delivery'); setMobileMenuOpen(false); }}
                  className="bg-sky-600 text-white py-2 rounded-lg text-xs font-bold text-center"
                >
                  Delivery Driver Portal
                </button>
              </div>
            </div>
          )}

        </div>
      </header>
    </>
  );
};
