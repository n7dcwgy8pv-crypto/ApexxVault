import React from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  PackageOpen,
  Sparkles,
  PackageCheck,
  Lock,
  MessageCircle
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatPercentOff } from '../../utils/formatters';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    openStripePayment,
    setSelectedProductModal
  } = useAuction();

  if (!isCartOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <div
        className="modal-content cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} color="var(--emerald-primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>ApexVault Cart ({cartTotals.itemCount})</h3>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                Clear Cart
              </button>
            )}
            <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <PackageOpen size={48} style={{ margin: '0 auto 1.25rem', opacity: 0.4 }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Your vault cart is empty</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                Browse our warehouse asset inventory and add brand new, open-box, or wholesale lots.
              </p>
              <button
                className="btn-buy-now"
                onClick={() => setIsCartOpen(false)}
                style={{ margin: '0 auto', padding: '0.6rem 1.5rem' }}
              >
                Explore Vault Assets
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cart.map(({ product, quantity }) => {
                const itemSavings = formatPercentOff(product.price, product.retailMSRP);

                return (
                  <div key={product.id} className="cart-item-row">
                    <div
                      className="cart-item-thumb"
                      onClick={() => {
                        setIsCartOpen(false);
                        setSelectedProductModal(product);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={product.images && product.images[0] ? product.images[0] : ''}
                        alt={product.title}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {product.sku}
                        </span>
                        <span className={`badge-condition ${product.condition === 'Brand New' ? 'brand-new' : 'open-box'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                          {product.condition}
                        </span>
                      </div>

                      <h4
                        style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                        onClick={() => {
                          setIsCartOpen(false);
                          setSelectedProductModal(product);
                        }}
                      >
                        {product.title}
                      </h4>

                      <div className="flex items-center justify-between" style={{ marginTop: '0.35rem' }}>
                        <div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald-primary)', fontFamily: 'var(--font-mono)' }}>
                            {formatCurrency(product.price)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                            {formatCurrency(product.retailMSRP)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="qty-stepper">
                          <button
                            className="qty-btn"
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-val">{quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            disabled={quantity >= (product.stockQty || 99)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Stripe Checkout Summary */}
        {cart.length > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem'
          }}>
            {/* Savings Banner */}
            {cartTotals.totalSavings > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                color: 'var(--emerald-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <Sparkles size={16} />
                <span>You are saving {formatCurrency(cartTotals.totalSavings)} off retail MSRP!</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cartTotals.itemCount} items)</span>
                <span className="font-mono">{formatCurrency(cartTotals.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (13% HST)</span>
                <span className="font-mono">{formatCurrency(cartTotals.tax)}</span>
              </div>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.25rem 0' }} />

              <div className="flex items-center justify-between" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Grand Total</span>
                <span className="font-mono" style={{ color: 'var(--emerald-primary)' }}>
                  {formatCurrency(cartTotals.grandTotal)}
                </span>
              </div>
            </div>

            {/* Direct Order Confirmation Button */}
            <button
              className="btn-buy-now"
              onClick={() => openOrderConfirmation ? openOrderConfirmation(null) : openStripePayment(null)}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: 'var(--shadow-emerald)'
              }}
            >
              <MessageCircle size={18} />
              <span>DM to Purchase Items ({formatCurrency(cartTotals.grandTotal)})</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2" style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Lock size={12} color="var(--emerald-light)" />
              <span>No Online Payment Required • Same-Day Warehouse Pickup</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
