import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Zap,
  DollarSign,
  PackageCheck,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  Info,
  Download,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  Calculator
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { formatCurrency, formatPercentOff } from '../utils/formatters';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';
import { useNotification } from '../context/NotificationContext';

export const ProductDetailPage = ({ productId = null }) => {
  const {
    products,
    addToCart,
    openMakeOffer,
    triggerHoldProduct,
    cancelHoldProduct,
    heldProductIds,
    watchlist,
    toggleWatchlist,
    setIsConditionGuideOpen
  } = useAuction();

  const { navigate, matchRoute } = useRouter();
  const { showSuccess, showAlert } = useNotification();

  // Determine active product
  const routeMatch = matchRoute('/products/:id');
  const activeId = productId || routeMatch?.params?.id;

  const product = useMemo(() => {
    if (!activeId) return null;
    return products.find(
      p =>
        (p.id && String(p.id) === String(activeId)) ||
        (p._id && String(p._id) === String(activeId)) ||
        (p.sku && p.sku.toLowerCase() === String(activeId).toLowerCase())
    ) || null;
  }, [products, activeId]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [freightPostalCode, setFreightPostalCode] = useState('');
  const [freightQuote, setFreightQuote] = useState(null);
  const [freightCalculating, setFreightCalculating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIdx(0);
    setSelectedQty(1);
    setFreightQuote(null);
  }, [activeId]);

  // Flash Hold timer check
  const [holdRemainingSecs, setHoldRemainingSecs] = useState(null);
  const prodId = product?.id || product?._id;

  useEffect(() => {
    if (!product) return;
    const holdExpiry = heldProductIds[prodId] || product.holdUntil;
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
  }, [product, prodId, heldProductIds]);

  const formatCountdown = (secs) => {
    if (!secs) return '00:00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <PackageCheck size={56} color="var(--ink-muted)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Liquidation Lot Not Found</h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
          This asset may have been sold or returned to warehouse surplus.
        </p>
        <Link to="/collections/all" className="btn-primary">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const isWatched = watchlist.includes(prodId);
  const savingsPct = formatPercentOff(product.price, product.retailMSRP);
  const dollarSavings = Math.max(0, (product.retailMSRP || 0) - (product.price || 0));
  const isOutOfStock = product.stockQty <= 0;
  const isLowStock = product.stockQty <= 3 && product.stockQty > 0;

  // Images list
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'];

  // Related products from same category
  const relatedLots = products
    .filter(p => (p.id || p._id) !== prodId && p.category === product.category)
    .slice(0, 4);

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedQty);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedQty);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showSuccess('Lot link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Freight calculation
  const handleEstimateFreight = (e) => {
    e.preventDefault();
    if (!freightPostalCode.trim() || freightPostalCode.length < 3) {
      showAlert('Please enter a valid Canadian postal code (e.g. M1H 2X1)');
      return;
    }
    setFreightCalculating(true);
    setTimeout(() => {
      setFreightCalculating(false);
      const isPallet = product.category === 'pallets' || product.price > 1000;
      const baseRate = isPallet ? 145 : 15;
      setFreightQuote({
        postalCode: freightPostalCode.toUpperCase(),
        carrier: isPallet ? 'Day & Ross Freight / Fastfrate LTL' : 'Canada Post / Canpar Express',
        rate: product.price >= 99 && !isPallet ? 0 : baseRate,
        transitDays: '1–2 Business Days',
        isFree: product.price >= 99 && !isPallet
      });
    }, 600);
  };

  // Manifest CSV download generator
  const handleDownloadManifest = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Lot SKU,Title,Brand,Category,Condition,Liquidation Price (CAD),Retail MSRP (CAD),Stock Qty,Warehouse Depot',
        `"${product.sku}","${product.title.replace(/"/g, '""')}","${product.brand || 'ApexxVault'}","${product.category}","${product.condition}",${product.price},${product.retailMSRP},${product.stockQty},"Scarborough Unit #32"`
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexxVault_Manifest_${product.sku}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Manifest CSV for Lot #${product.sku} downloaded.`);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/collections/all">Collections</Link>
          <ChevronRight size={14} />
          <Link to={`/collections/${product.category}`} style={{ textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Lot #{product.sku}</span>
        </div>

        {/* Main Product Layout */}
        <div className="pdp-layout-grid">
          {/* Left: Gallery & Zoom */}
          <div className="pdp-gallery-col">
            <div className="pdp-main-image-wrap">
              <img
                src={images[activeImageIdx]}
                alt={product.title}
                className="pdp-main-image"
              />

              {savingsPct >= 30 && (
                <div className="pdp-savings-badge">
                  SAVE {savingsPct}%
                </div>
              )}

              {holdRemainingSecs !== null && holdRemainingSecs > 0 && (
                <div className="pdp-hold-alert-pill">
                  <Clock size={14} />
                  <span>HELD: {formatCountdown(holdRemainingSecs)}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="pdp-thumbnails-strip">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pdp-thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Scarborough Inspection Guarantee */}
            <div className="pdp-inspection-card">
              <div className="flex items-center gap-3">
                <div className="inspection-icon-box">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="inspection-title">Scarborough Depot Certified</h4>
                  <p className="inspection-desc">
                    Individually bench-tested, verified authentic, and stored at 705 Progress Ave #32.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info, Price, Actions, Holds, Freight */}
          <div className="pdp-info-col">
            {/* Meta Row: Brand, SKU, Condition */}
            <div className="flex items-center justify-between gap-2" style={{ marginBottom: '0.5rem' }}>
              <div className="flex items-center gap-2">
                <span className="pdp-brand-tag">{product.brand || 'ApexxVault Certified'}</span>
                <span className="pdp-sku-tag">Lot #{product.sku}</span>
              </div>

              <div
                className="flex items-center gap-1 pdp-condition-trigger"
                onClick={() => setIsConditionGuideOpen(true)}
                title="View Condition Grading Guide"
              >
                <span className={`badge-condition ${product.condition?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.condition}
                </span>
                <Info size={14} color="var(--accent-gold)" />
              </div>
            </div>

            {/* Product Title */}
            <h1 className="pdp-title">{product.title}</h1>

            {/* Price Block */}
            <div className="pdp-price-box">
              <div className="flex items-baseline gap-3">
                <span className="pdp-current-price">
                  {formatCurrency(product.price)}
                </span>
                <span className="pdp-msrp-struck">
                  MSRP {formatCurrency(product.retailMSRP)}
                </span>
                <span className="pdp-save-pill">
                  SAVE ${Math.round(dollarSavings)} ({savingsPct}% OFF)
                </span>
              </div>
              <p className="pdp-currency-note">Prices quoted in Canadian Dollars (CAD) • 13% Ontario HST applied at checkout</p>
            </div>

            {/* Stock & Availability Line */}
            <div className="pdp-stock-status-bar">
              <PackageCheck size={16} className="stock-check-icon" />
              <div>
                <strong>
                  {isOutOfStock
                    ? 'Currently Sold Out'
                    : isLowStock
                    ? `Only ${product.stockQty} unit${product.stockQty === 1 ? '' : 's'} available!`
                    : `${product.stockQty} units ready in Scarborough inventory`}
                </strong>
                <p>Eligible for same-day warehouse loading at Unit #32 or Ontario courier dispatch.</p>
              </div>
            </div>

            {/* Flash Hold Reservation Block */}
            <div className="pdp-hold-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} color="var(--accent-gold)" />
                  <strong style={{ fontSize: '0.875rem' }}>
                    {holdRemainingSecs !== null && holdRemainingSecs > 0
                      ? `Lot Reserved: ${formatCountdown(holdRemainingSecs)} remaining`
                      : 'Need time to verify? Place a 2-Hour Hold'}
                  </strong>
                </div>

                {holdRemainingSecs !== null && holdRemainingSecs > 0 ? (
                  <button
                    type="button"
                    className="btn-cancel-hold"
                    onClick={() => cancelHoldProduct(product)}
                  >
                    <RotateCcw size={13} />
                    <span>Cancel Hold</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-trigger-hold"
                    onClick={() => triggerHoldProduct(product, 120)}
                  >
                    <span>Reserve Lot (2 Hrs)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            {!isOutOfStock && (
              <div className="pdp-cta-block">
                <div className="pdp-qty-row">
                  <label htmlFor="pdp-qty-select" className="qty-label">Quantity:</label>
                  <div className="qty-counter">
                    <button
                      type="button"
                      onClick={() => setSelectedQty(q => Math.max(1, q - 1))}
                      disabled={selectedQty <= 1}
                    >
                      -
                    </button>
                    <span>{selectedQty}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedQty(q => Math.min(product.stockQty || 5, q + 1))}
                      disabled={selectedQty >= (product.stockQty || 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Buy & Add Buttons */}
                <div className="pdp-btn-group">
                  <button
                    type="button"
                    className="btn-primary pdp-btn-buy"
                    onClick={handleBuyNow}
                  >
                    <Zap size={18} />
                    <span>Buy Now — Instant Checkout</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary pdp-btn-cart"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Secondary Action: Make an Offer */}
                <div className="flex items-center gap-3" style={{ marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-pdp-offer"
                    onClick={() => openMakeOffer(product)}
                  >
                    <DollarSign size={16} />
                    <span>Make an Offer / Bulk Inquire</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-pdp-wishlist ${isWatched ? 'active' : ''}`}
                    onClick={() => toggleWatchlist(prodId)}
                    title={isWatched ? 'Remove from Saved' : 'Save to Wishlist'}
                  >
                    <Heart size={16} fill={isWatched ? '#DC2626' : 'none'} color={isWatched ? '#DC2626' : 'currentColor'} />
                    <span>{isWatched ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-pdp-share"
                    onClick={handleShare}
                    title="Share Lot"
                  >
                    {copiedLink ? <Check size={16} color="var(--emerald-primary)" /> : <Share2 size={16} />}
                    <span>{copiedLink ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Description & Condition Notes */}
            <div className="pdp-details-tabs">
              <h3 className="pdp-section-heading">Asset Specifications &amp; Notes</h3>
              <p className="pdp-description-text">
                {product.description || 'Tier-1 overstock asset inspected and certified at ApexxVault Scarborough Depot.'}
              </p>

              {product.conditionNotes && (
                <div className="pdp-condition-notes-box">
                  <strong>Grading Notes:</strong> {product.conditionNotes}
                </div>
              )}

              {/* Manifest CSV Download */}
              <div className="pdp-manifest-box">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Lot Manifest &amp; Data Sheet</strong>
                    <p>Download official ApexxVault manifest record for Lot #{product.sku}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-download-manifest"
                    onClick={handleDownloadManifest}
                  >
                    <Download size={15} />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Freight & Shipping Estimator */}
            <div className="pdp-freight-calculator">
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                <Calculator size={18} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Estimate Courier &amp; Freight Delivery</h4>
              </div>

              <form onSubmit={handleEstimateFreight} className="freight-calc-form">
                <input
                  type="text"
                  placeholder="Enter Postal Code (e.g. M1H 2X1)"
                  value={freightPostalCode}
                  onChange={(e) => setFreightPostalCode(e.target.value)}
                  maxLength={7}
                  className="freight-postal-input"
                />
                <button type="submit" className="btn-primary freight-submit-btn" disabled={freightCalculating}>
                  {freightCalculating ? 'Estimating...' : 'Get Rates'}
                </button>
              </form>

              {freightQuote && (
                <div className="freight-quote-result">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{freightQuote.carrier}</strong>
                      <p>Estimated Delivery: {freightQuote.transitDays}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="quote-price">
                        {freightQuote.isFree ? 'FREE' : formatCurrency(freightQuote.rate)}
                      </span>
                      {freightQuote.isFree && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--emerald-primary)' }}>Free Delivery Over $99</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Local Pickup Note */}
              <div className="pdp-pickup-notice">
                <MapPin size={15} color="var(--accent-gold)" />
                <span>
                  Free Same-Day Pickup at <strong>705 Progress Ave #32, Scarborough</strong> (Mon–Sat 11am–6pm, Sun 11am–5pm).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Lots Section */}
        {relatedLots.length > 0 && (
          <div className="pdp-related-section">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>You May Also Like</h2>
            <div className="products-grid-catalog">
              {relatedLots.map((relProduct) => (
                <ProductCard key={relProduct.id || relProduct._id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
