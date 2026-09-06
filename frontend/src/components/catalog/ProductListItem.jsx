import React from 'react';
import { Heart, ShoppingCart, Zap, PackageCheck, MapPin, MessageCircle } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatPercentOff } from '../../utils/formatters';

const CONDITION_CLASS_MAP = {
  'Brand New': 'brand-new',
  'Appears New': 'appears-new',
  'Open Box': 'open-box',
  'Customer Return': 'customer-return',
  'Salvage / Parts': 'salvage'
};

export const ProductListItem = ({ product }) => {
  const {
    watchlist,
    toggleWatchlist,
    addToCart,
    buyNowDirect,
    setSelectedProductModal
  } = useAuction();

  const productId = product.id || product._id;
  const isWatched = watchlist.includes(productId);
  const savingsPct = formatPercentOff(product.price, product.retailMSRP);
  const condClass = CONDITION_CLASS_MAP[product.condition] || 'open-box';
  const isOutOfStock = product.stockQty <= 0;

  return (
    <div className="lot-list-item animate-float">
      {/* Thumbnail */}
      <div
        onClick={() => setSelectedProductModal(product)}
        style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}
      >
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'
          }
          alt={product.title}
          className="lot-list-image"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            SKU #{product.sku}
          </span>
          <span className={`badge-condition ${condClass}`}>
            {product.condition}
          </span>
          <span style={{ fontSize: '0.75rem', color: isOutOfStock ? '#fda4af' : '#86efac', fontWeight: 600 }}>
            • {isOutOfStock ? 'Out of Stock' : `${product.stockQty} in stock`}
          </span>
        </div>

        <h4
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            lineHeight: '1.35',
            marginBottom: '0.35rem'
          }}
          onClick={() => setSelectedProductModal(product)}
        >
          {product.title}
        </h4>

        <div className="flex items-center gap-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {product.warehouseLocation && (
            <span className="flex items-center gap-1">
              <MapPin size={12} color="var(--emerald-light)" />
              Bay {product.warehouseLocation}
            </span>
          )}
          <span>• Verified Liquidation Unit</span>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
          Liquidation Price
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
          {formatCurrency(product.price)}
        </div>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          Retail MSRP: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.retailMSRP)}</span>{' '}
          {savingsPct > 0 && <span className="savings-tag">{savingsPct}% OFF</span>}
        </div>
      </div>

      {/* Direct Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className="btn-buy-now"
          onClick={() => buyNowDirect(product, 1)}
          disabled={isOutOfStock}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            boxShadow: 'var(--shadow-emerald)'
          }}
        >
          <MessageCircle size={15} /> DM Me
        </button>

        <button
          onClick={() => toggleWatchlist(productId)}
          style={{
            padding: '0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: isWatched ? 'var(--rose-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={isWatched ? 'Remove from Saved' : 'Save Asset'}
        >
          <Heart size={16} fill={isWatched ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};
