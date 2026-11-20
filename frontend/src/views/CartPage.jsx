import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  ChevronRight,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    cartHoldCountdown
  } = useAuction();

  const { navigate } = useRouter();
  const [orderNotes, setOrderNotes] = useState('');

  const FREE_DELIVERY_THRESHOLD = 99.00;
  const subtotal = cartTotals.subtotal;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgressPct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <ShoppingCart size={64} color="var(--ink-muted)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '1.75rem' }}>
          Explore our Scarborough warehouse surplus catalogue and find liquidation deals up to 75% off.
        </p>
        <Link to="/collections/all" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
          Shop All Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Shopping Cart</span>
        </div>

        <h1 className="cart-page-title">Your Liquidation Cart</h1>

        {/* Free Delivery Progress Bar ($99 Threshold) */}
        <div className="cart-free-delivery-banner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={18} color="var(--accent-gold)" />
              <span className="delivery-progress-text">
                {amountToFreeDelivery > 0 ? (
                  <>Add <strong>{formatCurrency(amountToFreeDelivery)}</strong> more to unlock <strong>FREE Delivery</strong> across Ontario!</>
                ) : (
                  <>🎉 You qualify for <strong>FREE Delivery</strong> across Ontario!</>
                )}
              </span>
            </div>
            <span className="delivery-threshold-label">{deliveryProgressPct}%</span>
          </div>
          <div className="free-delivery-progress-track">
            <div
              className="free-delivery-progress-fill"
              style={{ width: `${deliveryProgressPct}%` }}
            />
          </div>
        </div>

        {/* Cart Layout Grid */}
        <div className="cart-layout-grid">
          {/* Left: Cart Line Items */}
          <div className="cart-items-col">
            <div className="cart-items-card">
              <div className="cart-table-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              <div className="cart-line-items-list">
                {cart.map((item) => {
                  const product = item.product || item;
                  const itemPrice = product.price || 0;
                  const lineTotal = itemPrice * (item.quantity || 1);
                  const prodId = product.id || product._id;

                  return (
                    <div key={prodId} className="cart-line-item-row">
                      {/* Product Thumbnail & Details */}
                      <div className="cart-item-product-cell">
                        <img
                          src={
                            product.images && product.images[0]
                              ? product.images[0]
                              : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400'
                          }
                          alt={product.title}
                          className="cart-item-thumb"
                          onClick={() => navigate(`/products/${prodId}`)}
                        />
                        <div className="cart-item-info">
                          <Link to={`/products/${prodId}`} className="cart-item-title">
                            {product.title}
                          </Link>
                          <div className="cart-item-meta">
                            <span className="cart-item-sku">Lot #{product.sku}</span>
                            <span className="badge-condition appears-new">{product.condition}</span>
                          </div>
                          <span className="cart-item-unit-price">
                            {formatCurrency(itemPrice)} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls (Finding C7 & M2) */}
                      <div className="cart-item-qty-cell">
                        <div className="cart-qty-counter">
                          <button
                            type="button"
                            className="qty-touch-btn"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartQuantity(prodId, item.quantity - 1);
                              } else {
                                removeFromCart(prodId);
                              }
                            }}
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="qty-value-display">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-touch-btn"
                            onClick={() => updateCartQuantity(prodId, item.quantity + 1)}
                            disabled={item.quantity >= (product.stockQty || 5)}
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(prodId)}
                          title="Remove Item"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="cart-item-total-cell">
                        <span className="cart-line-total-price">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scarborough Warehouse Pickup Notice */}
            <div className="cart-pickup-note-box">
              <MapPin size={20} color="var(--accent-gold)" />
              <div>
                <strong>Local Scarborough Pickup Available at Checkout</strong>
                <p>
                  Choose Free Warehouse Pickup at 705 Progress Ave #32 during checkout. Same-day loading dock release with matching photo ID.
                </p>
              </div>
            </div>

            {/* Special Instructions Note */}
            <div className="cart-notes-card">
              <label htmlFor="order-notes" className="cart-notes-label">
                Order Notes or Loading Instructions:
              </label>
              <textarea
                id="order-notes"
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Pickup time preference, pallet truck requirement, delivery instructions..."
                className="cart-notes-textarea"
              />
            </div>
          </div>

          {/* Right: Order Summary & Checkout Action */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>
                  {amountToFreeDelivery <= 0 ? (
                    <strong style={{ color: 'var(--emerald-primary)' }}>FREE</strong>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Ontario HST (13%)</span>
                <span>{formatCurrency(subtotal * 0.13)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span>Estimated Total (CAD)</span>
                <span className="summary-total-price">
                  {formatCurrency(subtotal + (subtotal * 0.13))}
                </span>
              </div>

              <button
                type="button"
                className="btn-primary btn-checkout-proceed"
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="summary-trust-perks">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} color="var(--emerald-primary)" />
                  <span>Bank-Grade 256-bit SSL Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} color="var(--accent-gold)" />
                  <span>Free Pickup or Tracked Ontario Courier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
