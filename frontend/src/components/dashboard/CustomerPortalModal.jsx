import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  DollarSign,
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';
import { fetchOffersFromDB } from '../../services/api';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

export const CustomerPortalModal = () => {
  const {
    isCustomerPortalOpen,
    setIsCustomerPortalOpen,
    currentUser,
    orders,
    watchlist,
    products,
    openOrderConfirmation,
    setSelectedProductModal
  } = useAuction();
  const { showSuccess, showAlert } = useNotification();

  const [activeTab, setActiveTab] = useState('offers'); // 'offers' | 'orders' | 'watchlist'
  const [myOffers, setMyOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Load customer offers on open or tab switch
  useEffect(() => {
    if (!isCustomerPortalOpen || !currentUser?.email) return;

    const loadCustomerOffers = async () => {
      setIsLoadingOffers(true);
      try {
        const data = await fetchOffersFromDB(currentUser.email);
        setMyOffers(data);
      } catch (err) {
        console.error('Error fetching customer offers:', err);
      } finally {
        setIsLoadingOffers(false);
      }
    };

    loadCustomerOffers();
  }, [isCustomerPortalOpen, currentUser]);

  if (!isCustomerPortalOpen) return null;

  const sellerPhone = WAREHOUSE_PICKUP_DETAILS.phone || '+1 (639) 571-6702';
  const sellerPhoneRaw = sellerPhone.replace(/[^0-9+]/g, '');

  // Filter orders for current user
  const myOrders = orders.filter(
    (o) => (o.customer?.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  // Saved items
  const savedProducts = products.filter((p) => watchlist.includes(p.id || p._id));

  const acceptedCount = myOffers.filter((o) => o.status === 'Accepted').length;

  const handleAcceptedOfferBuy = (offer) => {
    // Build simulated product with the accepted negotiated price
    const prod = products.find((p) => (p.id || p._id) === offer.productId) || {
      id: offer.productId,
      title: offer.productTitle,
      sku: offer.sku,
      price: offer.offeredPrice,
      retailMSRP: offer.retailMSRP,
      condition: 'Appears New'
    };

    const customizedProduct = {
      ...prod,
      price: offer.offeredPrice // Use accepted negotiated price!
    };

    setIsCustomerPortalOpen(false);
    openOrderConfirmation([{ product: customizedProduct, quantity: offer.quantity || 1 }]);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCustomerPortalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem'
              }}
            >
              {currentUser?.firstName?.[0] || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                {currentUser?.firstName} {currentUser?.lastName}'s Account Hub
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {currentUser?.email} • {currentUser?.phone || 'Scarborough Buyer'}
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setIsCustomerPortalOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.5rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeTab === 'offers' ? 'var(--emerald-bg)' : 'transparent',
              border: `1px solid ${activeTab === 'offers' ? 'var(--emerald-primary)' : 'transparent'}`,
              color: activeTab === 'offers' ? 'var(--emerald-light)' : 'var(--text-secondary)'
            }}
          >
            <DollarSign size={15} />
            <span>My Price Offers ({myOffers.length})</span>
            {acceptedCount > 0 && (
              <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                {acceptedCount} ACCEPTED
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeTab === 'orders' ? 'var(--emerald-bg)' : 'transparent',
              border: `1px solid ${activeTab === 'orders' ? 'var(--emerald-primary)' : 'transparent'}`,
              color: activeTab === 'orders' ? 'var(--emerald-light)' : 'var(--text-secondary)'
            }}
          >
            <ShoppingBag size={15} />
            <span>My Reservations ({myOrders.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeTab === 'watchlist' ? 'var(--emerald-bg)' : 'transparent',
              border: `1px solid ${activeTab === 'watchlist' ? 'var(--emerald-primary)' : 'transparent'}`,
              color: activeTab === 'watchlist' ? 'var(--emerald-light)' : 'var(--text-secondary)'
            }}
          >
            <Heart size={15} />
            <span>Saved Watchlist ({savedProducts.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* ========================================================================= */}
          {/* TAB 1: MY OFFERS & NEGOTIATIONS                                           */}
          {/* ========================================================================= */}
          {activeTab === 'offers' && (
            <div>
              {isLoadingOffers ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading your offers...
                </div>
              ) : myOffers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <DollarSign size={42} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    No Price Offers Submitted Yet
                  </h4>
                  <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
                    You can negotiate pricing or request bulk rates on any liquidation lot by clicking the <strong>"Offer"</strong> button on product cards!
                  </p>
                  <button
                    onClick={() => setIsCustomerPortalOpen(false)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Browse Active Inventory
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myOffers.map((off) => {
                    const isAccepted = off.status === 'Accepted';
                    const isDeclined = off.status === 'Declined';
                    const isPending = !isAccepted && !isDeclined;

                    return (
                      <div
                        key={off.id || off._id}
                        style={{
                          background: isAccepted ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                          border: `1.5px solid ${isAccepted ? 'rgba(16, 185, 129, 0.45)' : isDeclined ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem',
                          boxShadow: isAccepted ? '0 4px 20px rgba(16, 185, 129, 0.12)' : 'none'
                        }}
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                              {off.productTitle}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                              SKU #{off.sku} • Submitted on {new Date(off.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Live Status Badge */}
                          <div>
                            {isAccepted && (
                              <span
                                style={{
                                  background: '#10b981',
                                  color: '#ffffff',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontWeight: 900,
                                  fontSize: '0.8rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                }}
                              >
                                <CheckCircle2 size={14} />
                                <span>OFFER ACCEPTED BY SELLER!</span>
                              </span>
                            )}

                            {isPending && (
                              <span
                                style={{
                                  background: 'var(--gold-bg)',
                                  color: 'var(--gold-light)',
                                  padding: '0.3rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <Clock size={13} />
                                <span>Under Seller Review</span>
                              </span>
                            )}

                            {isDeclined && (
                              <span
                                style={{
                                  background: 'rgba(244, 63, 94, 0.15)',
                                  color: '#fda4af',
                                  padding: '0.3rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <X size={13} />
                                <span>Offer Declined</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Details Comparison */}
                        <div
                          style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.85rem 1rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '0.75rem',
                            textAlign: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                              Your Bid Price (Qty {off.quantity})
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--emerald-light)', fontSize: '1.25rem' }}>
                              {formatCurrency(off.offeredPrice)}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                              List Price
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '1.05rem', textDecoration: 'line-through' }}>
                              {formatCurrency(off.liquidationPrice)}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                              Est. Savings
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--gold-light)', fontSize: '1.05rem' }}>
                              Save {formatCurrency(Math.max(0, off.liquidationPrice - off.offeredPrice))}
                            </div>
                          </div>
                        </div>

                        {/* Accepted Offer Action Banner */}
                        {isAccepted && (
                          <div
                            style={{
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                🎉 Great news! The seller has approved your ${off.offeredPrice} bid.
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Pick up at 705 Progress Ave #32, Scarborough or schedule via direct message.
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAcceptedOfferBuy(off)}
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                padding: '0.65rem 1.15rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 800,
                                fontSize: '0.875rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-emerald)'
                              }}
                            >
                              <MessageCircle size={16} />
                              <span>DM Seller &amp; Book Pickup</span>
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

          {/* ========================================================================= */}
          {/* TAB 2: MY ORDERS & RESERVATIONS                                           */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div>
              {myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={42} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    No Reservations Placed Yet
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Your direct message purchase passes and warehouse loading tickets will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id || ord._id || ord.orderId}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem'
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            Order #{ord.orderId}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                            {new Date(ord.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span style={{ background: 'var(--emerald-bg)', color: 'var(--emerald-light)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.725rem', fontWeight: 800 }}>
                          {ord.status || 'Ready for Pickup'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                        Pickup Window: <strong style={{ color: 'var(--emerald-light)' }}>{ord.pickupTimeSlot || 'Flexible'}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Pickup Pass: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>{ord.pickupCode}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--emerald-light)', fontSize: '1.15rem' }}>
                          {formatCurrency(ord.grandTotal || ord.subtotal || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SAVED WATCHLIST                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'watchlist' && (
            <div>
              {savedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Heart size={42} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Your Watchlist is Empty
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Click the heart icon on any product card to save it for later review.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {savedProducts.map((p) => (
                    <div
                      key={p.id || p._id}
                      onClick={() => {
                        setIsCustomerPortalOpen(false);
                        setSelectedProductModal(p);
                      }}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'}
                        alt={p.title}
                        style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-light)', fontSize: '0.95rem' }}>
                          {formatCurrency(p.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
