import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  MapPin,
  PackageCheck,
  Plus,
  Minus,
  Check,
  HelpCircle,
  Truck,
  MessageCircle,
  Download,
  DollarSign,
  Lock,
  Clock,
  ZoomIn,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatPercentOff } from '../../utils/formatters';
import { downloadProductManifestCsv } from '../../utils/csvParser';
import { FreightCalculator } from './FreightCalculator';

const CONDITION_CLASS_MAP = {
  'Brand New': 'brand-new',
  'Appears New': 'appears-new',
  'Open Box': 'open-box',
  'Customer Return': 'customer-return',
  'Salvage / Parts': 'salvage'
};

export const ProductDetailModal = () => {
  const {
    selectedProductModal,
    setSelectedProductModal,
    watchlist,
    toggleWatchlist,
    buyNowDirect,
    setIsConditionGuideOpen,
    openMakeOffer,
    triggerHoldProduct,
    heldProductIds
  } = useAuction();

  const product = selectedProductModal;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [remainingHoldSeconds, setRemainingHoldSeconds] = useState(null);

  const productId = product?.id || product?._id;
  const isWatched = productId ? watchlist.includes(productId) : false;
  const savingsPct = product ? formatPercentOff(product.price, product.retailMSRP) : 0;
  const condClass = product ? (CONDITION_CLASS_MAP[product.condition] || 'open-box') : 'open-box';
  const maxStock = product?.stockQty || 1;

  // Flash Hold Countdown Timer
  useEffect(() => {
    if (!product || !productId) return;
    const holdExpiry = heldProductIds[productId] || product.holdUntil;
    if (!holdExpiry) {
      setRemainingHoldSeconds(null);
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(holdExpiry).getTime() - Date.now()) / 1000));
      setRemainingHoldSeconds(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [product, productId, heldProductIds]);

  if (!product) return null;

  const handleBuyNow = () => {
    buyNowDirect(product, selectedQty);
  };

  const formatCountdown = (secs) => {
    if (!secs) return '00:00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProductModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="lot-number-tag" style={{ position: 'static' }}>
              SKU #{product.sku}
            </span>

            {/* Interactive Condition with (i) guide trigger */}
            <div
              onClick={() => setIsConditionGuideOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
              title="Click to view Condition Standards Guide"
            >
              <span className={`badge-condition ${condClass}`}>
                {product.condition}
              </span>
              <Info size={14} color="var(--emerald-light)" />
            </div>

            <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700 }}>
              {product.stockQty > 0 ? `${product.stockQty} Units In Stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="modal-close-btn"
              onClick={() => toggleWatchlist(productId)}
              style={{ color: isWatched ? '#f43f5e' : 'var(--text-secondary)' }}
              title={isWatched ? 'Remove from Saved' : 'Save Asset'}
            >
              <Heart size={18} fill={isWatched ? 'currentColor' : 'none'} />
            </button>
            <button className="modal-close-btn" onClick={() => setSelectedProductModal(null)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left: Gallery & Inspection Tools */}
            <div>
              {/* Main Image with Zoom preview */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: '#0b1120',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative',
                  cursor: 'zoom-in'
                }}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images && product.images[activeImageIndex] ? product.images[activeImageIndex] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: isZoomed ? 'contain' : 'cover',
                    transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                    transition: 'transform 0.25s ease'
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 600
                  }}
                >
                  <ZoomIn size={12} />
                  <span>{isZoomed ? 'Click to Reset Zoom' : 'Click to Inspect Zoom'}</span>
                </div>
              </div>

              {/* Multi-Angle Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2" style={{ marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        width: '64px',
                        height: '50px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: `2px solid ${activeImageIndex === idx ? 'var(--emerald-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Warehouse Intake & Flaw Inspection Box */}
              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)'
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    <ShieldCheck size={16} color="var(--emerald-light)" />
                    <span>Warehouse Intake Inspection</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', background: 'var(--emerald-bg)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontWeight: 700 }}>
                    100% Inspected
                  </span>
                </div>
                <div>{product.conditionNotes || `Condition classified as ${product.condition}. Verified operational at Scarborough depot.`}</div>
              </div>

              {/* Manifest Specs Breakdown */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.725rem' }}>
                    Item Manifest Specifications
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}:</span>{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Itemized Manifest CSV Button */}
              <button
                onClick={() => downloadProductManifestCsv(product)}
                style={{
                  width: '100%',
                  marginTop: '0.85rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={15} color="var(--emerald-light)" />
                <span>Download Itemized Manifest (CSV)</span>
              </button>
            </div>

            {/* Right: Direct Actions, Negotiation, Hold Lock, Pricing */}
            <div>
              <h1 style={{ fontSize: '1.35rem', lineHeight: '1.3', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {product.title}
              </h1>

              {/* Active Hold Banner if applicable */}
              {remainingHoldSeconds !== null && remainingHoldSeconds > 0 && (
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: 'var(--gold-light)',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>2-Hour Flash Lock Active:</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900 }}>
                    {formatCountdown(remainingHoldSeconds)}
                  </span>
                </div>
              )}

              {/* Price Box */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Liquidation Direct Price
                    </span>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)', lineHeight: '1.1' }}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Estimated Retail MSRP
                    </span>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(product.retailMSRP)}
                    </div>
                    {savingsPct > 0 && (
                      <span className="savings-tag" style={{ fontSize: '0.78rem', padding: '0.15rem 0.5rem' }}>
                        Save {savingsPct}% ({formatCurrency((product.retailMSRP || product.price) - product.price)})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.15rem 0' }} />

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between" style={{ marginBottom: '1.15rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Select Quantity:
                  </span>
                  <div className="qty-stepper" style={{ border: '1px solid var(--border-subtle)' }}>
                    <button
                      className="qty-btn"
                      onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="qty-val" style={{ width: '40px' }}>{selectedQty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setSelectedQty(Math.min(maxStock, selectedQty + 1))}
                      disabled={selectedQty >= maxStock}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* DM Me to Buy */}
                  <button
                    className="btn-buy-now"
                    onClick={handleBuyNow}
                    style={{
                      padding: '0.85rem',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      boxShadow: 'var(--shadow-emerald)'
                    }}
                    disabled={product.stockQty <= 0}
                  >
                    <MessageCircle size={18} /> DM Me to Buy ({formatCurrency(product.price * selectedQty)})
                  </button>

                  {/* Secondary Negotiation & Hold Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    {/* Make an Offer */}
                    <button
                      type="button"
                      onClick={() => openMakeOffer(product)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-muted)',
                        color: 'var(--gold-light)',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer'
                      }}
                    >
                      <DollarSign size={15} />
                      <span>Make an Offer</span>
                    </button>

                    {/* 2-Hour Flash Lock */}
                    <button
                      type="button"
                      onClick={() => triggerHoldProduct(product, 120)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-muted)',
                        color: 'var(--text-primary)',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Lock size={14} color="var(--blue-light)" />
                      <span>Reserve (2h Hold)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Freight & Delivery Quote Calculator */}
              <FreightCalculator product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
