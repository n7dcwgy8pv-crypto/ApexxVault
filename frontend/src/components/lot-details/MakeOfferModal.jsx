import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle2,
  Package,
  TrendingDown,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';
import { createOfferInDB } from '../../services/api';

export const MakeOfferModal = ({ product, isOpen, onClose }) => {
  const {
    currentUser,
    savedCustomer,
    setIsAuthModalOpen,
    setAuthModalMode,
    setAuthPendingCallback,
    setIsMakeOfferOpen,
    setOfferProduct
  } = useAuction();
  const { showSuccess, showAlert } = useNotification();

  const [offeredPrice, setOfferedPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      const src = currentUser || savedCustomer || {};
      setName(`${src.firstName || ''} ${src.lastName || ''}`.trim());
      setPhone(src.phone || '');
      setEmail(src.email || '');
      if (product) {
        // Pre-fill reasonable negotiation start (e.g. 15% below liquidation price)
        const suggested = Math.round(product.price * 0.88);
        setOfferedPrice(suggested > 0 ? suggested.toString() : product.price.toString());
      }
      setQuantity(1);
      setNote('');
      setErrorMsg('');
    }
  }, [isOpen, currentUser, savedCustomer, product]);

  if (!isOpen || !product) return null;

  // Unauthenticated Guard: Redirect to Login/Register directly
  if (!currentUser) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem 1.5rem' }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--gold-bg)',
              color: 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <DollarSign size={28} />
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>
            Sign In to Make an Offer
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            To submit price negotiations or volume discounts for <strong>{product.title}</strong>, please sign in to your ApexxVault account.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                setAuthModalMode('login');
                setAuthPendingCallback(() => () => {
                  setOfferProduct(product);
                  setIsMakeOfferOpen(true);
                });
                setIsAuthModalOpen(true);
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setAuthModalMode('register');
                setAuthPendingCallback(() => () => {
                  setOfferProduct(product);
                  setIsMakeOfferOpen(true);
                });
                setIsAuthModalOpen(true);
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const priceNum = parseFloat(offeredPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid offer price.');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and phone number for the seller to reply.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId: product.id || product._id,
        productTitle: product.title,
        sku: product.sku,
        liquidationPrice: product.price,
        retailMSRP: product.retailMSRP || product.price,
        offeredPrice: priceNum,
        quantity: parseInt(quantity, 10) || 1,
        note: note.trim(),
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim()
        }
      };

      const res = await createOfferInDB(payload);
      if (res.success) {
        showSuccess(`Offer of ${formatCurrency(priceNum)} submitted! The seller will review and contact you.`);
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to submit offer.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountPercent = product.price > 0 && offeredPrice
    ? Math.round(((product.price - parseFloat(offeredPrice || 0)) / product.price) * 100)
    : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-bg)',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                Make an Offer / Bulk Inquire
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Negotiate price or request volume wholesale discount
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
          {errorMsg && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                color: '#fda4af',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product Snapshot */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SKU #{product.sku} • In Stock: {product.stockQty}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>List Price</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-light)', fontSize: '1.1rem' }}>
                {formatCurrency(product.price)}
              </div>
            </div>
          </div>

          {/* Offer Input Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Your Proposed Price (CAD) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--emerald-light)' }}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>$</span>
              </div>
              {discountPercent > 0 && (
                <div style={{ fontSize: '0.725rem', color: 'var(--gold-light)', marginTop: '3px', fontWeight: 600 }}>
                  ↓ {discountPercent}% below listed price
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Quantity Wanted
              </label>
              <input
                type="number"
                min="1"
                max={product.stockQty || 99}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Negotiation Note / Terms (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Can pick up cash today in Scarborough if accepted."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              padding: '0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            {isSubmitting ? (
              <span>Submitting Offer...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Offer to Seller ({formatCurrency(parseFloat(offeredPrice || 0) * (parseInt(quantity, 10) || 1))})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
