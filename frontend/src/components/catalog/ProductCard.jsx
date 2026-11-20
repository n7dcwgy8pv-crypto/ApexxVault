import React, { useState, useEffect } from 'react';
import {
  Heart,
  PackageCheck,
  DollarSign,
  ShoppingCart,
  Zap,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useRouter } from '../../context/RouterContext';
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
    addToCart,
    openMakeOffer,
    heldProductIds,
    setCart
  } = useAuction();

  const { navigate } = useRouter();

  const productId = product.id || product._id;
  const isWatched = watchlist.includes(productId);
  const savingsPct = formatPercentOff(product.price, product.retailMSRP);
  const dollarSavings = Math.max(0, (product.retailMSRP || 0) - (product.price || 0));
  const condClass = CONDITION_CLASS_MAP[product.condition] || 'open-box';
  const isLowStock = product.stockQty <= 3 && product.stockQty > 0;
  const isOutOfStock = product.stockQty <= 0;

  // Flash Hold timer check
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

  const handleCardClick = () => {
    navigate(`/products/${productId}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    // Add item to cart and navigate straight to checkout
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleOffer = (e) => {
    e.stopPropagation();
    openMakeOffer(product);
  };

  return (
    <div className="lot-card animate-float" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Image Wrap */}
      <div className="lot-card-image-wrap">
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

        {/* Wishlist Heart */}
        <button
          type="button"
          className={`lot-watch-btn ${isWatched ? 'watched' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(productId);
          }}
          title={isWatched ? 'Remove from Saved' : 'Save Lot'}
          aria-label="Save Lot"
        >
          <Heart size={16} fill={isWatched ? '#DC2626' : 'none'} color={isWatched ? '#DC2626' : 'currentColor'} />
        </button>

        {/* Condition Ribbon Top-Left */}
        <div className="card-top-badges">
          <span className={`badge-condition ${condClass}`}>
            {product.condition}
          </span>
          {savingsPct >= 30 && (
            <span className="badge-save-gold">
              SAVE ${Math.round(dollarSavings)}
            </span>
          )}
        </div>

        {/* Hold Notice if active */}
        {holdRemainingSecs !== null && holdRemainingSecs > 0 && (
          <div className="card-hold-badge">
            <Clock size={12} />
            <span>HELD ({Math.floor(holdRemainingSecs / 60)}m left)</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="card-sold-out-overlay">
            <span>SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="lot-card-body">
        {/* Brand & SKU line */}
        <div className="lot-meta-line">
          <span className="lot-brand">{product.brand || 'ApexxVault Certified'}</span>
          <span className="lot-sku">Lot #{product.sku}</span>
        </div>

        {/* 2-Line Title */}
        <h3 className="lot-card-title" title={product.title}>
          {product.title}
        </h3>

        {/* Price Box */}
        <div className="lot-price-box">
          <div className="current-bid-row">
            <span className="price-highlight">
              {formatCurrency(product.price)}
            </span>
            {savingsPct > 0 && (
              <span className="savings-pill">
                {savingsPct}% OFF
              </span>
            )}
          </div>

          <div className="msrp-row">
            <span className="msrp-label">MSRP:</span>
            <span className="msrp-value">{formatCurrency(product.retailMSRP)}</span>
          </div>
        </div>

        {/* Stock Status Line */}
        <div className="lot-stock-line">
          <PackageCheck size={13} className="stock-icon" />
          <span className={isOutOfStock ? 'stock-out' : isLowStock ? 'stock-low' : 'stock-ok'}>
            {isOutOfStock
              ? 'Sold Out'
              : isLowStock
              ? `Only ${product.stockQty} left in Scarborough depot`
              : 'In Stock — Ready for Pickup or Delivery'}
          </span>
        </div>

        {/* Actions Grid: Add to Cart + Buy Now + Offer */}
        <div className="lot-card-actions-row">
          <button
            type="button"
            className="btn-add-cart-primary"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title="Add to Cart"
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            className="btn-buy-now-outline"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            title="Buy Now (Direct to Checkout)"
          >
            <Zap size={14} />
            <span>Buy Now</span>
          </button>

          <button
            type="button"
            className="btn-offer-icon"
            onClick={handleOffer}
            title="Make an Offer"
            aria-label="Make an Offer"
          >
            <DollarSign size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
