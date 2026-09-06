import React, { useState } from 'react';
import {
  Search,
  UploadCloud,
  Heart,
  ShoppingCart,
  ShieldCheck,
  CreditCard,
  ScanLine,
  Mail,
  Sun,
  Moon,
  X,
  User,
  LogOut,
  LogIn,
  LayoutDashboard,
  Shield,
  DollarSign,
  ShoppingBag,
  Package
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { CATEGORIES } from '../../data/auctionEvents';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    currentUser,
    isLoggedIn,
    isAdmin,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsAdminPortalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    watchlist,
    cartTotals,
    setIsBulkUploadOpen,
    setIsWatchlistOpen,
    setIsCartOpen,
    setIsStripeSettingsOpen,
    setIsScannerOpen,
    setIsEmailSettingsOpen,
    setIsCustomerPortalOpen,
    resetCatalog
  } = useAuction();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="main-navbar">
      <div className="container navbar-container">
        {/* Official Brand Logo: Emblem + Name */}
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            resetCatalog && resetCatalog();
          }}
          title="ApexxVault — Return to Main Inventory"
        >
          <img
            src="/logo-icon.png"
            alt="ApexxVault Emblem"
            className="brand-logo-emblem"
          />
          <span className="brand-logo-text">APEXXVAULT</span>
        </a>

        {/* Search Bar with Category Filter */}
        <div className="nav-search-wrapper">
          <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
            <select
              className="search-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by department"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="nav-search-input"
              placeholder="Search assets by SKU, brand, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search assets"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-muted)', padding: '0 0.4rem', cursor: 'pointer' }}
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="search-submit-btn"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Admin Portal Button (If Admin or Quick Access) */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminPortalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--gold-bg)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: 'var(--gold-light)',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Open Admin Management Suite"
            >
              <Shield size={15} />
              <span>Admin Portal</span>
            </button>
          )}

          {/* User Account / Sign In Trigger */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-muted)',
                  color: 'var(--text-primary)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--emerald-bg)',
                    color: 'var(--emerald-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  {currentUser?.firstName?.[0] || 'U'}
                </div>
                <span>{currentUser?.firstName}</span>
              </button>

              {showUserDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    minWidth: '200px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser?.email}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', marginTop: '2px', fontWeight: 600 }}>
                      Role: {currentUser?.role}
                    </div>
                  </div>

                  {/* Customer Account & Offers Portal Link */}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsCustomerPortalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      color: 'var(--emerald-light)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer'
                    }}
                  >
                    <DollarSign size={14} />
                    <span>My Offers &amp; Account Hub</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAdminPortalOpen(true);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.825rem',
                        color: 'var(--gold-light)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer'
                      }}
                    >
                      <LayoutDashboard size={14} />
                      <span>Admin Management Portal</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      color: 'var(--rose-primary)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-primary)',
                padding: '0.48rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Sign in or register to purchase items"
            >
              <LogIn size={15} color="var(--emerald-light)" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Saved Wishlist */}
          <button
            className="nav-icon-btn"
            onClick={() => setIsWatchlistOpen(true)}
            title="View Saved Assets"
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {watchlist.length > 0 && (
              <span className="badge-count">{watchlist.length}</span>
            )}
          </button>

          {/* Theme Switcher Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Crisp Light' : 'Luxury Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
