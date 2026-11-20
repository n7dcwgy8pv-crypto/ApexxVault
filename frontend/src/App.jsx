import React from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingChat } from './components/common/FloatingChat';

// Views
import { HomePage } from './views/HomePage';
import { CatalogPage } from './views/CatalogPage';
import { CategoriesPage } from './views/CategoriesPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { SearchPage } from './views/SearchPage';
import { CartPage } from './views/CartPage';
import { CheckoutPage } from './views/CheckoutPage';
import { CheckoutSuccessPage } from './views/CheckoutSuccessPage';
import { AccountPage } from './views/AccountPage';
import { AboutUsPage } from './views/AboutUsPage';
import { ContactPage } from './views/ContactPage';
import { ConditionGuidePage } from './views/ConditionGuidePage';
import { FreightPage } from './views/FreightPage';
import { PolicyPage } from './views/PolicyPage';
import { AdminPage } from './views/AdminPage';

// Modals & Drawers
import { CartDrawer } from './components/cart/CartDrawer';
import { WatchlistDrawer } from './components/dashboard/WatchlistDrawer';
import { MakeOfferModal } from './components/lot-details/MakeOfferModal';
import { DropAlertModal } from './components/lead-capture/DropAlertModal';
import { ConditionGuideModal } from './components/catalog/ConditionGuideModal';
import { BulkUploadModal } from './components/bulk-upload/BulkUploadModal';
import { WarehouseScannerModal } from './components/admin/WarehouseScannerModal';
import { EmailSettingsModal } from './components/admin/EmailSettingsModal';
import { AuthModal } from './components/auth/AuthModal';

import { useAuction } from './context/AuctionContext';
import { useRouter } from './context/RouterContext';

import './styles/index.css';
import './styles/components.css';

export const App = () => {
  const {
    isConditionGuideOpen,
    setIsConditionGuideOpen,
    isMakeOfferOpen,
    setIsMakeOfferOpen,
    offerProduct,
    isEmailSettingsOpen,
    setIsEmailSettingsOpen
  } = useAuction();

  const { currentPath, matchRoute } = useRouter();

  // Route Matching
  const renderCurrentView = () => {
    // 1. Home Page
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }

    // 2. Collections All
    if (currentPath === '/collections/all') {
      return <CatalogPage categorySlug="all" />;
    }

    // 3. Collections Category
    const categoryMatch = matchRoute('/collections/:slug');
    if (categoryMatch.isMatch) {
      return <CatalogPage categorySlug={categoryMatch.params.slug} />;
    }

    // 4. Categories Overview Page
    if (currentPath === '/pages/categories') {
      return <CategoriesPage />;
    }

    // 5. Product Detail Page
    const productMatch = matchRoute('/products/:id');
    if (productMatch.isMatch) {
      return <ProductDetailPage productId={productMatch.params.id} />;
    }

    // 6. Search Page
    if (currentPath === '/search') {
      return <SearchPage />;
    }

    // 7. Cart Page
    if (currentPath === '/cart') {
      return <CartPage />;
    }

    // 8. Checkout Flow
    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }

    // 9. Checkout Success
    const checkoutSuccessMatch = matchRoute('/checkout/success/:id');
    if (checkoutSuccessMatch.isMatch) {
      return <CheckoutSuccessPage />;
    }

    // 10. Account Hub
    if (currentPath === '/account') {
      return <AccountPage />;
    }

    // 11. About Us
    if (currentPath === '/pages/about-us' || currentPath === '/about') {
      return <AboutUsPage />;
    }

    // 12. Contact
    if (currentPath === '/pages/contact' || currentPath === '/contact') {
      return <ContactPage />;
    }

    // 13. Condition Guide
    if (currentPath === '/pages/condition-guide' || currentPath === '/condition-guide') {
      return <ConditionGuidePage />;
    }

    // 14. Freight Estimator
    if (currentPath === '/pages/freight' || currentPath === '/freight') {
      return <FreightPage />;
    }

    // 15. Policy Pages
    const policyMatch = matchRoute('/policies/:policy');
    if (policyMatch.isMatch) {
      return <PolicyPage policySlug={policyMatch.params.policy} />;
    }
    if (currentPath.startsWith('/policies')) {
      return <PolicyPage policySlug="privacy" />;
    }

    // 16. Admin Management Suite
    if (currentPath === '/admin') {
      return <AdminPage />;
    }

    // Default Fallback: Home
    return <HomePage />;
  };

  return (
    <div className="app-wrapper">
      {/* Top Announcement Marquee */}
      <AnnouncementBar />

      {/* Main Header */}
      <Navbar />

      {/* Main Route View */}
      <main className="main-content-area">
        {renderCurrentView()}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Floating WhatsApp Support Button */}
      <FloatingChat />

      {/* Persistent Slide-Outs & Modals */}
      <CartDrawer />
      <WatchlistDrawer />
      <AuthModal />
      <BulkUploadModal />
      <WarehouseScannerModal />
      <EmailSettingsModal
        isOpen={isEmailSettingsOpen}
        onClose={() => setIsEmailSettingsOpen(false)}
      />

      <ConditionGuideModal
        isOpen={isConditionGuideOpen}
        onClose={() => setIsConditionGuideOpen(false)}
      />

      <DropAlertModal />

      <MakeOfferModal
        product={offerProduct}
        isOpen={isMakeOfferOpen}
        onClose={() => setIsMakeOfferOpen(false)}
      />
    </div>
  );
};

export default App;
