import React from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { SubNav } from './components/layout/SubNav';
import { AuctionHeader } from './components/layout/AuctionHeader';
import { FilterSidebar } from './components/filters/FilterSidebar';
import { SortBar } from './components/catalog/SortBar';
import { CatalogView } from './components/catalog/CatalogView';
import { Footer } from './components/layout/Footer';

import { BulkUploadModal } from './components/bulk-upload/BulkUploadModal';
import { ProductDetailModal } from './components/lot-details/ProductDetailModal';
import { OrderConfirmationModal } from './components/cart/OrderConfirmationModal';
import { CheckoutSuccessModal } from './components/cart/CheckoutSuccessModal';
import { EmailInvoicePreviewModal } from './components/cart/EmailInvoicePreviewModal';
import { EmailSettingsModal } from './components/admin/EmailSettingsModal';
import { WarehouseScannerModal } from './components/admin/WarehouseScannerModal';
import { WatchlistDrawer } from './components/dashboard/WatchlistDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { ConditionGuideModal } from './components/catalog/ConditionGuideModal';
import { DropAlertModal } from './components/lead-capture/DropAlertModal';
import { MakeOfferModal } from './components/lot-details/MakeOfferModal';
import { CustomerPortalModal } from './components/dashboard/CustomerPortalModal';
import { LiveActivityTicker } from './components/common/LiveActivityTicker';
import { useAuction } from './context/AuctionContext';

import './styles/index.css';
import './styles/components.css';

export const App = () => {
  const {
    isEmailSettingsOpen,
    setIsEmailSettingsOpen,
    isConditionGuideOpen,
    setIsConditionGuideOpen,
    isMakeOfferOpen,
    setIsMakeOfferOpen,
    offerProduct
  } = useAuction();

  return (
    <div className="app-wrapper">
      {/* Top Liquidation Status Ticker */}
      <AnnouncementBar />

      {/* Main Navbar with Brand, Category Search, User Auth, Admin Portal, Scanner & Bulk Upload */}
      <Navbar />

      {/* Categories & Availability Filters */}
      <SubNav />

      {/* Primary Catalog Layout */}
      <main className="container" style={{ flex: 1 }}>
        {/* Warehouse Surplus Hero & Live Liquidation Savings Stats */}
        <AuctionHeader />

        {/* Store Grid & Sidebar Filters Layout */}
        <div className="catalog-main-layout">
          {/* Faceted Condition, Location, Availability & Price filters */}
          <FilterSidebar />

          {/* Product Cards Grid & Sorting */}
          <div style={{ minWidth: 0 }}>
            <SortBar />
            <CatalogView />
          </div>
        </div>
      </main>

      {/* Warehouse Logistics, Interactive Map & Footer */}
      <Footer />

      {/* Modals, Drawers & Interactive Enhancements */}
      <AuthModal />
      <AdminPortalModal />
      <BulkUploadModal />
      <ProductDetailModal />
      <OrderConfirmationModal />
      <CheckoutSuccessModal />
      <EmailInvoicePreviewModal />
      <EmailSettingsModal
        isOpen={isEmailSettingsOpen}
        onClose={() => setIsEmailSettingsOpen(false)}
      />
      <WarehouseScannerModal />
      <WatchlistDrawer />

      {/* New Roadmap Modals & Interactive Alerts */}
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
      <CustomerPortalModal />
      <LiveActivityTicker />
    </div>
  );
};

export default App;
