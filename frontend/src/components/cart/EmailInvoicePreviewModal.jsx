import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Mail,
  Printer,
  MapPin,
  Calendar,
  CheckCircle2,
  Send,
  Building,
  User,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { renderBarcodeSvg, generateOrderQrPayload, WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

export const EmailInvoicePreviewModal = () => {
  const {
    isEmailPreviewOpen,
    setIsEmailPreviewOpen,
    emailToPreview
  } = useAuction();

  const order = emailToPreview;

  useEffect(() => {
    if (order) {
      renderBarcodeSvg('email-invoice-barcode', order.orderId);
    }
  }, [order]);

  if (!isEmailPreviewOpen || !order) return null;

  const qrPayload = generateOrderQrPayload(order);
  const firstName = order.customer?.firstName || 'Valued';
  const lastName = order.customer?.lastName || 'Customer';
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="modal-backdrop" onClick={() => setIsEmailPreviewOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Email Header Bar */}
        <div className="modal-header" style={{ background: '#090d16' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 style={{ fontSize: '1.1rem' }}>Dispatched Email Invoice Preview</h3>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px'
                }}>
                  DELIVERED VIA RESEND
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sent to: <strong>{order.customer?.email || order.emailDispatchedTo}</strong>
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={() => setIsEmailPreviewOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Email Content Body */}
        <div style={{ padding: '1.75rem', background: '#0c1322' }}>
          {/* Email Container */}
          <div style={{
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            {/* Store Brand & Invoice Header */}
            <div className="flex items-center justify-between" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  APEX<span style={{ color: '#6366f1' }}>VAULT</span>
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  Asset &amp; Liquidation Marketplace
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                  INVOICE #{order.orderId}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Date: {formatDate(order.date)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                  Payment: PAID via Stripe ({order.cardBrand?.toUpperCase()} •••• {order.cardLast4 || '4242'})
                </div>
              </div>
            </div>

            {/* CUSTOMER PROFILE & RECORDS SECTION */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.65rem', borderBottom: '1px solid #bbf7d0', paddingBottom: '0.35rem' }}>
                👤 Customer Records &amp; Buyer Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>FULL NAME:</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{fullName}</div>

                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>EMAIL ADDRESS:</div>
                  <div style={{ fontWeight: 700, color: '#0369a1' }}>{order.customer?.email}</div>

                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>PHONE NUMBER:</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{order.customer?.phone}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>PHYSICAL BILLING / PICKUP ADDRESS:</div>
                  <div style={{ color: '#0f172a', marginTop: '0.2rem', lineHeight: '1.4' }}>
                    <strong>{order.customer?.street}</strong><br />
                    {order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}<br />
                    Canada
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Pickup Address */}
            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                📍 Warehouse Pickup Location
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                {WAREHOUSE_PICKUP_DETAILS.facilityName} — {WAREHOUSE_PICKUP_DETAILS.bay}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.15rem' }}>
                {WAREHOUSE_PICKUP_DETAILS.fullAddress}<br />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hours: {WAREHOUSE_PICKUP_DETAILS.hours} • Phone: {WAREHOUSE_PICKUP_DETAILS.phone}</span>
              </div>
            </div>

            {/* Scannable Barcode & QR Code Section */}
            <div style={{
              background: '#f1f5f9',
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '1.25rem',
              alignItems: 'center'
            }}>
              {/* QR Code */}
              <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Barcode SVG */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg id="email-invoice-barcode" style={{ maxWidth: '100%', height: '55px' }}></svg>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Pickup Pass: <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.pickupCode}</strong> • Scan at bay for fast item release
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Item Description</th>
                    <th style={{ padding: '0.6rem 0.75rem', width: '100px' }}>Condition</th>
                    <th style={{ padding: '0.6rem 0.75rem', width: '60px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.6rem 0.75rem', width: '90px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '0.6rem 0.75rem', width: '90px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(({ product, quantity }, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>
                        {product.title}
                        <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace' }}>
                          SKU: {product.sku} • Location: {product.warehouseLocation || 'Bay 4'}
                        </div>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>
                        {product.condition}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>
                        {quantity}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontFamily: 'monospace' }}>
                        {formatCurrency(product.price)}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                        {formatCurrency(product.price * quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <div style={{ width: '280px', fontSize: '0.85rem' }}>
                <div className="flex items-center justify-between" style={{ padding: '0.25rem 0', color: '#64748b' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between" style={{ padding: '0.25rem 0', color: '#64748b' }}>
                  <span>Tax (13% HST):</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between" style={{ padding: '0.25rem 0', color: '#059669', fontWeight: 700 }}>
                  <span>Liquidation Savings:</span>
                  <span style={{ fontFamily: 'monospace' }}>{formatCurrency(order.totalSavings)}</span>
                </div>
                <div style={{ height: '2px', background: '#0f172a', margin: '0.5rem 0' }} />
                <div className="flex items-center justify-between" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  <span>Grand Total:</span>
                  <span style={{ fontFamily: 'monospace', color: '#059669' }}>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
              Thank you for purchasing with ApexVault! For pickup inquiries or freight, contact support@apexvault.ca or visit Unit #32 during warehouse hours.
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between" style={{ marginTop: '1.25rem' }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> Print Email Invoice (PDF)
            </button>

            <button
              className="btn-buy-now"
              onClick={() => setIsEmailPreviewOpen(false)}
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
