import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MessageSquareShare,
  Phone,
  Copy,
  Check,
  MapPin,
  Sparkles,
  AlertCircle,
  Clock,
  Calendar,
  CreditCard,
  Banknote,
  DollarSign
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/formatters';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

const PICKUP_SLOTS = [
  'Today: 11:00 AM – 1:30 PM (Morning Dock)',
  'Today: 1:30 PM – 4:00 PM (Afternoon Dock)',
  'Today: 4:00 PM – 6:00 PM (Evening Dock)',
  'Tomorrow: 11:00 AM – 2:00 PM (Priority Gate)',
  'Tomorrow: 2:00 PM – 5:00 PM (Standard Gate)',
  'Flexible (Anytime during Operating Hours)'
];

export const OrderConfirmationModal = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    orderIntent,
    processDirectOrder,
    savedCustomer,
    currentUser,
    showSuccess
  } = useAuction();

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(PICKUP_SLOTS[0]);

  if (!isOrderModalOpen || !orderIntent) return null;

  const sellerPhone = WAREHOUSE_PICKUP_DETAILS.phone || '+1 (639) 571-6702';
  const sellerPhoneRaw = sellerPhone.replace(/[^0-9+]/g, '');

  const userSource = currentUser || savedCustomer || {};
  const customerName = `${userSource.firstName || 'Customer'} ${userSource.lastName || ''}`.trim();
  const customerEmail = userSource.email || '';
  const customerPhone = userSource.phone || '';

  const firstItem = orderIntent.items?.[0]?.product || {};
  const itemTitle = firstItem.title || 'Liquidation Item';
  const itemSku = firstItem.sku || 'N/A';
  const itemPrice = formatCurrency(orderIntent.grandTotal || orderIntent.subtotal || 0);

  const dmText = `Hi ApexxVault! I want to buy SKU #${itemSku} (${itemTitle}) for ${itemPrice}. My name is ${customerName}, phone: ${customerPhone}. Preferred Pickup Time: ${selectedSlot}.`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(sellerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleWhatsAppDM = () => {
    const cleanNumber = sellerPhoneRaw.replace('+', '');
    const encoded = encodeURIComponent(dmText);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  const handleSmsDM = () => {
    const encoded = encodeURIComponent(dmText);
    window.open(`sms:${sellerPhoneRaw}?body=${encoded}`, '_blank');
  };

  const handleFastReserve = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      await processDirectOrder({
        firstName: userSource.firstName || 'Customer',
        lastName: userSource.lastName || 'Buyer',
        email: userSource.email || 'customer@direct.ca',
        phone: userSource.phone || sellerPhone,
        street: userSource.street || '705 Progress Ave #32',
        city: userSource.city || 'Scarborough',
        province: userSource.province || 'Ontario',
        postalCode: userSource.postalCode || 'M1H 2X1',
        pickupTimeSlot: selectedSlot,
        note: `Direct DM purchase reservation with selected slot: ${selectedSlot}`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Error processing reservation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsOrderModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PhoneCall size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                💬 Contact Seller to Purchase
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Call or DM the seller directly with the number below
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setIsOrderModalOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Error Banner */}
          {errorMessage && (
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
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Selected Item Snapshot */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              Selected Item for Purchase
            </div>

            {orderIntent.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between" style={{ gap: '0.75rem' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product?.title || 'Wholesale Lot Item'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    SKU #{item.product?.sku} • Condition: {item.product?.condition || 'Brand New'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--emerald-light)' }}>
                    {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PROMINENT SELLER CONTACT BOX */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Seller Contact Phone Number
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.9rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.02em',
                marginBottom: '0.85rem'
              }}
            >
              {sellerPhone}
            </div>

            {/* Quick Actions Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.65rem'
              }}
            >
              {/* Call */}
              <a
                href={`tel:${sellerPhoneRaw}`}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <PhoneCall size={15} />
                <span>Call Now</span>
              </a>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppDM}
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageSquareShare size={15} />
                <span>WhatsApp</span>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={handleSmsDM}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-muted)',
                  color: 'var(--text-primary)',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Phone size={15} color="var(--blue-light)" />
                <span>SMS Text</span>
              </button>
            </div>

            {/* Copy Button */}
            <div style={{ marginTop: '0.85rem' }}>
              <button
                type="button"
                onClick={handleCopyPhone}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedPhone ? 'var(--emerald-light)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600
                }}
              >
                {copiedPhone ? <Check size={14} color="var(--emerald-light)" /> : <Copy size={14} />}
                <span>{copiedPhone ? 'Phone Number Copied!' : 'Click to Copy Phone Number'}</span>
              </button>
            </div>
          </div>

          {/* Warehouse Pickup Slot Selection */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Calendar size={16} color="var(--emerald-light)" />
              <span>Select Scarborough Loading Dock Pickup Time</span>
            </div>

            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-muted)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.75rem',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              {PICKUP_SLOTS.map((slot, idx) => (
                <option key={idx} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Logged in User Profile Bar */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              fontSize: '0.825rem'
            }}
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--emerald-bg)',
                  color: 'var(--emerald-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}
              >
                {customerName[0] || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {customerName}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {customerEmail} {customerPhone ? `• ${customerPhone}` : ''}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', background: 'var(--emerald-bg)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', fontWeight: 700 }}>
              Verified User
            </span>
          </div>

          {/* 1-Click Send Reservation to Seller */}
          <button
            type="button"
            onClick={handleFastReserve}
            disabled={isProcessing}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              border: 'none',
              marginBottom: '1rem'
            }}
          >
            {isProcessing ? (
              <span>Sending Request to Seller...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>⚡ 1-Click Send Purchase Request to Seller</span>
              </>
            )}
          </button>

          {/* Accepted Payment Options Badges */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem', textAlign: 'center' }}>
              Accepted Payment Methods on Pickup:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Banknote size={12} color="var(--emerald-light)" /> Cash on Pickup
              </span>
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={12} color="var(--blue-light)" /> Interac e-Transfer
              </span>
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={12} color="var(--gold-light)" /> Debit / In-Person Terminal
              </span>
            </div>
          </div>

          {/* Warehouse Pickup Address Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}
          >
            <MapPin size={13} color="var(--emerald-light)" />
            <span>Pickup: <strong>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
