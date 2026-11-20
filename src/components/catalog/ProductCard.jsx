import React, { useState, useEffect } from 'react';
import { Heart, PackageCheck, MapPin, MessageCircle, DollarSign, Lock, Clock, Info, ShieldCheck } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatPercentOff } from '../../utils/formatters';

const CONDITION_CLASS_MAP = {
  'Brand New': 'brand-new',
  'Appears New': 'appears-new',
  'Open Box': 'open-box',
  'Customer Return': 'customer-return',
  'Salvage / Parts': 'salvage'
};

export const ProductCard = ({ product }) => {
  const {
    watchlist,
    toggleWatchlist,
    buyNowDirect,
    setSelectedProductModal,
    setIsConditionGuideOpen,
    openMakeOffer,
    triggerHoldProduct,
    heldProductIds
  } = useAuction();

  const productId = product.id || product._id;
  const isWatched = watchlist.includes(productId);
  const savingsPct = formatPercentOff(product.price, product.retailMSRP);
  const dollarSavings = Math.max(0, (product.retailMSRP || 0) - (product.price || 0));
  const condClass = CONDITION_CLASS_MAP[product.condition] || 'open-box';
  const isLowStock = product.stockQty <= 3 && product.stockQty > 0;
  const isOutOfStock = product.stockQty <= 0;

  // Check Flash Hold timer
  const [holdRemainingSecs, setHoldRemainingSecs] = useState(null);
  useEffect(() => {
    const holdExpiry = heldProductIds[productId] || product.holdUntil;
    if (!holdExpiry) {
      setHoldRemainingSecs(null);
      return;
    }
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(holdExpiry).getTime() - Date.now()) / 1000));
      setHoldRemainingSecs(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [product, productId, heldProductIds]);

  const formatCountdown = (secs) => {
    if (!secs) return '00:00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="lot-card animate-float">
      {/* Image Container with Quick View & Badges */}
      <div
        className="lot-card-image-wrap"
        onClick={() => setSelectedProductModal(product)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'
          }
          alt={product.title}
          className="lot-card-image"
          loading="lazy"
        />

        {/* SKU Tag */}
        <div className="lot-number-tag">
          SKU #{product.sku}
        </div>

        {/* Wishlist Button */}
        <button
          className={`lot-watch-btn ${isWatched ? 'watched' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(productId);
          }}
          title={isWatched ? 'Remove from Saved' : 'Save Asset'}
          aria-label={isWatched ? 'Remove from Saved' : 'Save Asset'}
        >
          <Heart size={15} fill={isWatched ? 'currentColor' : 'none'} />
        </button>

        {/* Hold Lock Overlay Banner if active */}
        {holdRemainingSecs !== null && holdRemainingSecs > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 3,
              background: 'rgba(245, 158, 11, 0.95)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <Clock size={12} />
            <span>HELD: {formatCountdown(holdRemainingSecs)}</span>
          </div>
        )}

        {/* Stock Status Ribbon Overlay */}
        <div className="stock-tag-ribbon">
          <span
            className="flex items-center gap-1 font-mono"
            style={{
              fontSize: '0.725rem',
              color: isOutOfStock ? '#fda4af' : isLowStock ? '#fca5a5' : '#86efac'
            }}
          >
            <PackageCheck size={13} />
            {isOutOfStock
              ? 'Out of Stock'
              : isLowStock
              ? `Only ${product.stockQty} Left`
              : `${product.stockQty} in Stock`}
          </span>

          {product.warehouseLocation && (
            <span
              className="flex items-center gap-1 font-mono"
              style={{ fontSize: '0.7rem', color: '#cbd5e1' }}
            >
              <MapPin size={11} />
              Bay {product.warehouseLocation}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="lot-card-body">
        {/* Condition Badge & Value Tag */}
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => setIsConditionGuideOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
            title="Click to view Condition Guide"
          >
            <span className={`badge-condition ${condClass}`}>
              {product.condition}
            </span>
            <Info size={12} color="var(--emerald-light)" />
          </div>

          {savingsPct >= 40 && (
            <span
              style={{
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-light)',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                letterSpacing: '0.04em'
              }}
            >
              SAVE ${Math.round(dollarSavings)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="lot-card-title"
          title={product.title}
          onClick={() => setSelectedProductModal(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.title}
        </h3>

        {/* Pricing Box */}
        <div className="lot-price-box">
          <div className="current-bid-row">
            <span className="bid-label">Liquidation Price</span>
            <span className="price-highlight">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="msrp-row">
            <span style={{ color: 'var(--text-muted)' }}>
              Retail MSRP: <span className="msrp-value">{formatCurrency(product.retailMSRP)}</span>
            </span>
            {savingsPct > 0 && (
              <span className="savings-tag">
                {savingsPct}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button
            className="btn-buy-now"
            onClick={() => buyNowDirect(product, 1)}
            disabled={isOutOfStock}
            title="Direct Message Seller to Buy"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'var(--shadow-emerald)'
            }}
          >
            <MessageCircle size={14} /> DM Me
          </button>

          <button
            type="button"
            onClick={() => openMakeOffer(product)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-muted)',
              color: 'var(--gold-light)',
              padding: '0.55rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}
            title="Make an Offer / Bulk Inquire"
          >
            <DollarSign size={13} />
            <span>Offer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
