import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useRouter, Link } from '../../context/RouterContext';
import { CATEGORIES } from '../../data/auctionEvents';

export const Navbar = () => {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    watchlist,
    cartTotals,
    setIsWatchlistOpen,
    setIsCartOpen
  } = useAuction();

  const { navigate, currentPath } = useRouter();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchInputValue.trim())}`);
    setMobileSearchOpen(false);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/collections/all' },
    { label: 'Categories', href: '/pages/categories' },
    { label: 'Deal of the Week', href: '/#deal-of-the-week' },
    { label: 'About Us', href: '/pages/about-us' },
    { label: 'Contact', href: '/pages/contact' }
  ];

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={24} />
        </button>

        {/* Official ApexxVault 3D Emblem & 3D Metallic Wordmark */}
        <Link to="/" className="site-brand-logo" title="ApexxVault — Premier Liquidation Depot">
          <img
            src="/apexxvault-brand-logo.png"
            alt="ApexxVault"
            className="brand-logo-full-img"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Input Bar (Desktop) */}
        <div className="header-search-desktop">
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search lots..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="search-input"
              aria-label="Search catalog"
            />
            {searchInputValue && (
              <button
                type="button"
                onClick={() => setSearchInputValue('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Right Action Icons: Search (mobile), Account, Wishlist, Cart */}
        <div className="header-actions">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            className="header-action-btn mobile-search-btn"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          {/* Admin Management Button (Only visible to authenticated administrators) */}
          {isLoggedIn && isAdmin && (
            <Link
              to="/admin"
              className="header-action-btn admin-portal-btn"
              title="Admin Management Suite"
              aria-label="Admin Portal"
              style={{ color: 'var(--accent-gold)' }}
            >
              <Shield size={20} />
              <span className="action-btn-text" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                Admin
              </span>
            </Link>
          )}

          {/* Account Icon */}
          <Link
            to="/account"
            className="header-action-btn"
            title={isLoggedIn ? `Account (${currentUser?.firstName})` : 'Sign In / Register'}
            aria-label="Account"
          >
            <User size={20} />
            <span className="action-btn-text">
              {isLoggedIn ? currentUser?.firstName : 'Account'}
            </span>
          </Link>

          {/* Wishlist Icon */}
          <button
            type="button"
            className="header-action-btn"
            onClick={() => setIsWatchlistOpen(true)}
            title="Saved Lots"
            aria-label="Saved Lots"
          >
            <Heart size={20} />
            {watchlist.length > 0 && (
              <span className="action-badge">{watchlist.length}</span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            className="header-action-btn cart-btn-action"
            onClick={() => navigate('/cart')}
            title="View Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartTotals.itemCount > 0 && (
              <span className="action-badge cart-badge">{cartTotals.itemCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar-row container">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search lots..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              autoFocus
            />
            <button type="submit" className="mobile-search-submit">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-drawer-header">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <img
                  src="/apexxvault-brand-logo.png"
                  alt="ApexxVault"
                  style={{ height: '36px', width: 'auto', display: 'block' }}
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ padding: '0.5rem', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-nav-list">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} color="var(--ink-muted)" />
                </Link>
              ))}
            </nav>

            <div className="mobile-drawer-divider" />

            {/* Category Quick Links */}
            <div className="mobile-categories-section">
              <p className="mobile-section-label">Browse Departments</p>
              <div className="mobile-categories-chips">
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/collections/${cat.id}`}
                    className="mobile-category-chip"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
                <MapPin size={14} color="var(--accent-gold)" />
                <span>705 Progress Ave #32, Scarborough, ON</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: 'var(--ink-muted)' }}>
                <Phone size={14} color="var(--accent-gold)" />
                <span>(416) 571-6702</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
