import React, { useState, useEffect } from 'react';
import {
  User,
  PackageCheck,
  DollarSign,
  Heart,
  Clock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  ShoppingCart,
  MapPin,
  Lock
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import { ProductCard } from '../components/catalog/ProductCard';

export const AccountPage = () => {
  const {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    orders,
    products,
    watchlist,
    toggleWatchlist,
    addToCart,
    heldProductIds,
    cancelHoldProduct
  } = useAuction();

  const { navigate } = useRouter();
  const { showSuccess, showAlert } = useNotification();

  // Auth form states (when logged out)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab (when logged in)
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'offers' | 'holds' | 'saved'

  // Customer Offers fetched from API
  const [customerOffers, setCustomerOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Load customer offers when user is logged in
  useEffect(() => {
    if (isLoggedIn && currentUser?.email) {
      const fetchCustomerOffers = async () => {
        setLoadingOffers(true);
        try {
          const res = await fetch(`/api/offers?email=${encodeURIComponent(currentUser.email)}`);
          const data = await res.json();
          if (data && data.offers) {
            setCustomerOffers(data.offers);
          }
        } catch (err) {
          console.warn('Could not fetch customer offers:', err);
        } finally {
          setLoadingOffers(false);
        }
      };
      fetchCustomerOffers();
    }
  }, [isLoggedIn, currentUser?.email]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        showSuccess(`Welcome back, ${res.user?.firstName || 'Buyer'}!`);
      } else {
        showAlert(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      showAlert(`Login error: ${err.message}`);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    try {
      const res = await register({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });
      if (res.success) {
        showSuccess('Account created successfully! Welcome to ApexxVault.');
      } else {
        showAlert(res.error || 'Failed to register account.');
      }
    } catch (err) {
      showAlert(`Registration error: ${err.message}`);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Respond to counter-offer
  const handleCounterResponse = async (offerId, accept, counterPrice, productTitle) => {
    try {
      const newStatus = accept ? 'Accepted' : 'Declined';
      const res = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(
          accept
            ? `Counter-offer of $${counterPrice} accepted! You may now proceed to checkout.`
            : 'Counter-offer declined.'
        );
        // Refresh offers list
        setCustomerOffers(prev =>
          prev.map(o => (o._id === offerId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      showAlert(`Action error: ${err.message}`);
    }
  };

  // Customer orders filter
  const customerOrders = orders.filter(
    o => o.customer?.email?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  // Active holds
  const activeHeldProducts = products.filter(p => {
    const prodId = p.id || p._id;
    return heldProductIds[prodId] || (p.holdUntil && new Date(p.holdUntil) > new Date());
  });

  // Saved products
  const savedProducts = products.filter(p => watchlist.includes(p.id || p._id));

  // If NOT Logged In: Render Login / Register Screen
  if (!isLoggedIn) {
    return (
      <div className="account-auth-container">
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="account-auth-card">
            {/* Brand Header */}
            <div className="auth-card-header">
              <img
                src="/apexxvault-brand-logo.png"
                alt="ApexxVault"
                className="auth-logo"
                style={{ height: '54px', width: 'auto', maxWidth: '240px', margin: '0 auto 1rem', display: 'block', objectFit: 'contain' }}
              />
              <h2>Customer Account Hub</h2>
              <p>Track your surplus orders, submitted offers, active holds, and saved lots.</p>
            </div>

            {/* Mode Tabs */}
            <div className="auth-tabs-row">
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form-body">
                <div className="checkout-field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                  />
                </div>

                <div className="checkout-field-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary auth-submit-btn"
                  disabled={authSubmitting}
                >
                  <Lock size={16} />
                  <span>{authSubmitting ? 'Signing in...' : 'Sign In to Account'}</span>
                </button>

                <p className="auth-helper-text">
                  Demo Customer: <code>customer@example.com</code> / <code>Password123!</code>
                </p>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="auth-form-body">
                <div className="auth-name-row">
                  <div className="checkout-field-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="checkout-field-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="checkout-field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="checkout-field-group">
                  <label>Phone Number (For Pickup Verification)</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (416) 000-0000"
                  />
                </div>

                <div className="checkout-field-group">
                  <label>Create Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary auth-submit-btn"
                  disabled={authSubmitting}
                >
                  <span>{authSubmitting ? 'Creating account...' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="account-hub-page">
      <div className="container">
        {/* User Welcome Banner */}
        <div className="account-header-card">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="account-avatar-box">
                {currentUser.firstName?.[0] || 'A'}
              </div>
              <div>
                <h1 className="account-name-heading">
                  Welcome back, {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="account-email-sub">
                  {currentUser.email} • Scarborough Depot Member
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="btn-primary"
                  style={{
                    background: 'var(--accent-gold)',
                    color: '#000',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Management Suite</span>
                </Link>
              )}
              <button
                type="button"
                className="btn-secondary account-logout-btn"
                onClick={logout}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="account-tabs-bar">
            <button
              type="button"
              className={`account-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <PackageCheck size={18} />
              <span>My Orders ({customerOrders.length})</span>
            </button>

            <button
              type="button"
              className={`account-nav-tab ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              <DollarSign size={18} />
              <span>My Offers ({customerOffers.length})</span>
            </button>

            <button
              type="button"
              className={`account-nav-tab ${activeTab === 'holds' ? 'active' : ''}`}
              onClick={() => setActiveTab('holds')}
            >
              <Clock size={18} />
              <span>My Active Holds ({activeHeldProducts.length})</span>
            </button>

            <button
              type="button"
              className={`account-nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Heart size={18} />
              <span>Saved Lots ({savedProducts.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="account-tab-content">
            {customerOrders.length === 0 ? (
              <div className="account-empty-box">
                <PackageCheck size={48} color="var(--ink-muted)" />
                <h3>No Orders Placed Yet</h3>
                <p>Browse our catalog to score liquidation deals up to 75% below MSRP.</p>
                <Link to="/collections/all" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Explore Catalogue
                </Link>
              </div>
            ) : (
              <div className="orders-cards-list">
                {customerOrders.map((ord) => (
                  <div key={ord.orderId || ord._id} className="order-summary-card">
                    <div className="order-summary-header">
                      <div>
                        <span className="order-id-label">Order Reference</span>
                        <strong className="order-id-val">{ord.orderId}</strong>
                        <span className="order-date-val">
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="order-status-badge">
                          {ord.status || 'PAID'}
                        </span>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => navigate(`/checkout/success/${ord.orderId}`)}
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
                        >
                          View Pickup Pass
                        </button>
                      </div>
                    </div>

                    <div className="order-items-preview">
                      {ord.items?.map((item, i) => (
                        <div key={i} className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span>{item.quantity}x {item.product?.title || 'Liquidation Lot'}</span>
                          <strong>{formatCurrency((item.price || 0) * (item.quantity || 1))}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer-row">
                      <span>Total Paid: <strong>{formatCurrency(ord.grandTotal)}</strong> CAD</span>
                      <span style={{ color: 'var(--ink-muted)', fontSize: '0.8rem' }}>
                        Pickup: 705 Progress Ave #32, Scarborough
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY OFFERS */}
        {activeTab === 'offers' && (
          <div className="account-tab-content">
            {loadingOffers ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Loading submitted offers...</p>
            ) : customerOffers.length === 0 ? (
              <div className="account-empty-box">
                <DollarSign size={48} color="var(--ink-muted)" />
                <h3>No Offers Submitted</h3>
                <p>Click "Make an Offer" on any lot to propose your wholesale price directly to our desk.</p>
                <Link to="/collections/all" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Browse Catalogue
                </Link>
              </div>
            ) : (
              <div className="offers-cards-list">
                {customerOffers.map((offer) => {
                  const isCountered = offer.status === 'Countered';
                  return (
                    <div key={offer._id} className="offer-summary-card">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="offer-sku-tag">Lot #{offer.sku}</span>
                          <h3 className="offer-item-title">{offer.productTitle}</h3>
                        </div>
                        <span className={`offer-status-badge ${offer.status?.toLowerCase()}`}>
                          Status: {offer.status}
                        </span>
                      </div>

                      <div className="offer-details-row">
                        <div>
                          <span>Liquidation MSRP:</span>
                          <strong>{formatCurrency(offer.liquidationPrice)}</strong>
                        </div>
                        <div>
                          <span>Your Offer:</span>
                          <strong style={{ color: 'var(--accent-gold)' }}>
                            {formatCurrency(offer.offeredPrice)}
                          </strong>
                        </div>
                        {offer.counterPrice && (
                          <div>
                            <span>Seller Counter-Offer:</span>
                            <strong style={{ color: 'var(--emerald-primary)' }}>
                              {formatCurrency(offer.counterPrice)}
                            </strong>
                          </div>
                        )}
                      </div>

                      {offer.adminResponseNote && (
                        <div className="offer-seller-note">
                          <strong>Seller Response:</strong> {offer.adminResponseNote}
                        </div>
                      )}

                      {/* Counter-Offer Action Buttons */}
                      {isCountered && (
                        <div className="counter-actions-row">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() =>
                              handleCounterResponse(
                                offer._id,
                                true,
                                offer.counterPrice,
                                offer.productTitle
                              )
                            }
                          >
                            <CheckCircle2 size={16} />
                            <span>Accept Counter (${offer.counterPrice})</span>
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                              handleCounterResponse(
                                offer._id,
                                false,
                                offer.counterPrice,
                                offer.productTitle
                              )
                            }
                          >
                            <XCircle size={16} />
                            <span>Decline Counter</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY HOLDS */}
        {activeTab === 'holds' && (
          <div className="account-tab-content">
            {activeHeldProducts.length === 0 ? (
              <div className="account-empty-box">
                <Clock size={48} color="var(--ink-muted)" />
                <h3>No Lots on Flash Hold</h3>
                <p>You can reserve any asset for 2 hours with our Flash Hold feature on product detail pages.</p>
                <Link to="/collections/all" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Browse Catalogue
                </Link>
              </div>
            ) : (
              <div className="holds-cards-list">
                {activeHeldProducts.map((p) => {
                  const prodId = p.id || p._id;
                  return (
                    <div key={prodId} className="hold-item-card">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200'}
                          alt={p.title}
                          className="hold-item-thumb"
                        />
                        <div>
                          <span className="hold-sku-tag">Lot #{p.sku}</span>
                          <h4 className="hold-item-title">{p.title}</h4>
                          <span className="hold-price-val">{formatCurrency(p.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => cancelHoldProduct(p)}
                        >
                          <RotateCcw size={14} />
                          <span>Cancel Hold</span>
                        </button>

                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            addToCart(p, 1);
                            navigate('/checkout');
                          }}
                        >
                          <ShoppingCart size={15} />
                          <span>Checkout Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SAVED LOTS (WISHLIST) */}
        {activeTab === 'saved' && (
          <div className="account-tab-content">
            {savedProducts.length === 0 ? (
              <div className="account-empty-box">
                <Heart size={48} color="var(--ink-muted)" />
                <h3>No Saved Lots</h3>
                <p>Click the heart icon on any asset to save it to your personal watchlist.</p>
                <Link to="/collections/all" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Browse Catalogue
                </Link>
              </div>
            ) : (
              <div className="products-grid-catalog">
                {savedProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
