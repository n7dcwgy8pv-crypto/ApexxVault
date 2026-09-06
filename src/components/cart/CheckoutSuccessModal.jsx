import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  X,
  Printer,
  MapPin,
  Calendar,
  Barcode,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  Mail,
  FileText,
  User,
  Phone,
  Send,
  ExternalLink,
  Download
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { renderBarcodeSvg, generateOrderQrPayload, WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';
import { dispatchLiveEmailInvoice, openMailClientWithInvoice, generateInvoiceHtml } from '../../utils/emailService';

export const CheckoutSuccessModal = () => {
  const {
    isCheckoutSuccessOpen,
    setIsCheckoutSuccessOpen,
    lastOrder,
    openEmailPreview,
    showSuccess
  } = useAuction();

  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (lastOrder) {
      renderBarcodeSvg('checkout-success-barcode', lastOrder.orderId);
    }
  }, [lastOrder]);

  if (!isCheckoutSuccessOpen || !lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    const res = await dispatchLiveEmailInvoice(lastOrder);
    setIsResending(false);
    showSuccess(`📧 Live email invoice re-dispatched to ${lastOrder.customer?.email}!`);
  };

  const handleDownloadInvoiceHtml = () => {
    const html = generateInvoiceHtml(lastOrder);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ApexVault_Invoice_${lastOrder.orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qrPayload = generateOrderQrPayload(lastOrder);
  const fullName = `${lastOrder.customer?.firstName || ''} ${lastOrder.customer?.lastName || ''}`.trim() || 'Valued Customer';

  return (
    <div className="modal-backdrop" onClick={() => setIsCheckoutSuccessOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '750px' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--emerald-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#ecfdf5' }}>Purchase Confirmed & Paid!</h2>
              <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                Your order invoice and pickup pass are ready.
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={() => setIsCheckoutSuccessOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Email Dispatched Interactive Banner */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div className="flex items-center gap-2" style={{ color: '#bae6fd', fontSize: '0.85rem' }}>
              <Mail size={18} color="var(--cyan-primary)" />
              <div>
                <div>Live invoice delivered to <strong>{lastOrder.customer?.email}</strong> via Resend</div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>Check your email inbox or spam folder.</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openMailClientWithInvoice(lastOrder)}
                style={{
                  background: 'rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title="Open in your default Mail app / Gmail"
              >
                <ExternalLink size={13} /> Open in Mail App
              </button>

              <button
                onClick={handleResendEmail}
                disabled={isResending}
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Send size={13} /> {isResending ? 'Sending...' : 'Resend Live Email'}
              </button>

              <button
                onClick={() => openEmailPreview(lastOrder)}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Preview Email
              </button>
            </div>
          </div>

          {/* CUSTOMER PROFILE & RECORDS SECTION */}
          {lastOrder.customer && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <div style={{
                fontWeight: 800,
                color: 'var(--emerald-primary)',
                textTransform: 'uppercase',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                paddingBottom: '0.4rem'
              }}>
                <User size={15} /> Customer Details &amp; Buyer Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>CUSTOMER NAME</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>{fullName}</div>

                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>EMAIL ADDRESS</div>
                  <div style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>{lastOrder.customer.email}</div>

                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>CONTACT TELEPHONE</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{lastOrder.customer.phone}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>PHYSICAL BILLING / PICKUP ADDRESS</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{lastOrder.customer.street}</strong><br />
                    {lastOrder.customer.city}, {lastOrder.customer.province} {lastOrder.customer.postalCode}<br />
                    Canada
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details & Scannable Barcode Box */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div className="flex items-center justify-between" style={{ borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Official Invoice ID</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--gold-hover)' }}>
                  {lastOrder.orderId}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup Pass Code</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
                  {lastOrder.pickupCode}
                </div>
              </div>
            </div>

            {/* Real Scannable Barcode & QR Code Layout */}
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center',
              margin: '0.5rem 0 1rem 0',
              display: 'grid',
              gridTemplateColumns: '95px 1fr',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* QR Code */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={85}
                  level="M"
                />
              </div>

              {/* Barcode SVG */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg id="checkout-success-barcode" style={{ maxWidth: '100%', height: '50px' }}></svg>
                <div style={{ fontSize: '0.725rem', color: '#666', fontFamily: 'monospace' }}>
                  Scan barcode at warehouse for instant item release
                </div>
              </div>
            </div>

            {/* Warehouse Pickup Address & Hours */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem'
            }}>
              <div style={{ fontWeight: 800, color: 'var(--emerald-primary)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} /> Warehouse Pickup Location Address:
              </div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {WAREHOUSE_PICKUP_DETAILS.facilityName} — {WAREHOUSE_PICKUP_DETAILS.bay}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {WAREHOUSE_PICKUP_DETAILS.fullAddress}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Hours: {WAREHOUSE_PICKUP_DETAILS.hours} • Phone: {WAREHOUSE_PICKUP_DETAILS.phone}
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Purchased Liquidation Items ({lastOrder.items.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {lastOrder.items.map(({ product, quantity }, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    background: 'var(--bg-card)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {quantity} • Condition: {product.condition} • {product.warehouseLocation || 'Bay 4'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {formatCurrency(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div style={{
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            marginBottom: '1.25rem'
          }}>
            <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(lastOrder.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
              <span>Taxes (13% HST):</span>
              <span className="font-mono">{formatCurrency(lastOrder.tax)}</span>
            </div>
            <div className="flex items-center justify-between" style={{ color: 'var(--emerald-primary)', fontWeight: 700 }}>
              <span>Your Total Savings:</span>
              <span className="font-mono">{formatCurrency(lastOrder.totalSavings)}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.25rem 0' }} />
            <div className="flex items-center justify-between" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total Paid via Stripe:</span>
              <span className="font-mono" style={{ color: 'var(--emerald-primary)' }}>
                {formatCurrency(lastOrder.grandTotal)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3" style={{ flexWrap: 'wrap' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Printer size={15} /> Print Receipt
              </button>

              <button
                onClick={handleDownloadInvoiceHtml}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--cyan-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={15} /> Download Invoice (.HTML)
              </button>
            </div>

            <button
              className="btn-buy-now"
              onClick={() => setIsCheckoutSuccessOpen(false)}
              style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}
            >
              Done &amp; Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
