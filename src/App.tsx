import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CustomerLoginModal } from './components/auth/CustomerLoginModal';
import { CustomerProfileModal } from './components/profile/CustomerProfileModal';
import { StoreHeader } from './components/storefront/StoreHeader';
import { StoreHero } from './components/storefront/StoreHero';
import { CategoryRow } from './components/storefront/CategoryRow';
import { DailyDeals } from './components/storefront/DailyDeals';
import { PromoBanners } from './components/storefront/PromoBanners';
import { PopularProducts } from './components/storefront/PopularProducts';
import { LimitedDrops } from './components/storefront/LimitedDrops';
import { CouponsBanner } from './components/storefront/CouponsBanner';
import { FastCheckoutSection } from './components/storefront/FastCheckoutSection';
import { Testimonials } from './components/storefront/Testimonials';
import { StoreFooter } from './components/storefront/StoreFooter';
import { CartDrawer } from './components/storefront/CartDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliveryPortal } from './components/delivery/DeliveryPortal';
import { Product } from './types';

function MainAppContent() {
  const { 
    activeView, 
    isCustomerLoginModalOpen, 
    setIsCustomerLoginModalOpen,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingOrderId
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [instantBuyProduct, setInstantBuyProduct] = useState<Product | null>(null);

  const handleInstantBuy = (product: Product) => {
    setInstantBuyProduct(product);
    const checkoutEl = document.getElementById('fast-checkout-section');
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Separate Admin Panel System
  if (activeView === 'admin') {
    return <AdminDashboard />;
  }

  // Separate Delivery Boy Portal
  if (activeView === 'delivery') {
    return <DeliveryPortal />;
  }

  // Starting Home Page for Customers
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      
      {/* 1. DealKart Header with Search, Cart & Customer Firebase Sign In */}
      <StoreHeader 
        onSearchChange={setSearchQuery}
        onCategorySelect={setSelectedCategory}
      />

      <main className="flex-1 pb-16">
        
        {/* 2. Hero Banner ("Great Finds. Better Prices.") */}
        <StoreHero />

        {/* 3. Shop by Category (8 Colorful Categories) */}
        <CategoryRow 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Daily Deals Section (Fresh Deals Every 24 Hours with Countdown) */}
        <DailyDeals 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onInstantBuy={handleInstantBuy}
        />

        {/* 5. Promotional Banners (Bundle Savings & Member Exclusive DealKart+) */}
        <PromoBanners />

        {/* 6. Popular Products Grid (Customer Favorites) */}
        <PopularProducts 
          onInstantBuy={handleInstantBuy}
        />

        {/* 7. Limited Drops (Rare Finds with Countdown) */}
        <LimitedDrops 
          onInstantBuy={handleInstantBuy}
        />

        {/* 8. Grab Your Coupons & Newsletter */}
        <CouponsBanner />

        {/* 9. Fast, Secure & Easy Checkout (COD + Custom Payment QR + Instant Supabase Insert) */}
        <FastCheckoutSection 
          initialProduct={instantBuyProduct}
        />

        {/* 10. Testimonials ("Loved By Thousands") */}
        <Testimonials />

      </main>

      {/* 11. DealKart Footer with Guarantees */}
      <StoreFooter />

      {/* Slide-out Shopping Cart */}
      <CartDrawer />

      {/* Firebase Customer Authentication Modal */}
      <CustomerLoginModal 
        isOpen={isCustomerLoginModalOpen}
        onClose={() => setIsCustomerLoginModalOpen(false)}
      />

      {/* Customer Profile & Live Order Tracking Modal */}
      <CustomerProfileModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialOrderId={trackingOrderId}
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
