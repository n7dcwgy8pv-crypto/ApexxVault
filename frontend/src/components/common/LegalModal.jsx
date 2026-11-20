import React from 'react';
import { X, ShieldCheck, FileText, Lock, MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

export const LegalModal = ({ isOpen, activePolicy = 'privacy', onClose, onSwitchPolicy }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop legal-modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
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
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                {activePolicy === 'privacy' && 'Privacy Policy (PIPEDA & CASL)'}
                {activePolicy === 'terms' && 'Terms of Service & Sales Agreement'}
                {activePolicy === 'as-is' && 'AS-IS Liquidation & Defect Warranty Policy'}
                {activePolicy === 'pickup' && 'Scarborough Warehouse Pickup Policy'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ApexxVault Direct Liquidation Inc. • Official Policies
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Policy Tab Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            flexShrink: 0
          }}
        >
          <button
            type="button"
            className={`tab-btn ${activePolicy === 'privacy' ? 'active' : ''}`}
            onClick={() => onSwitchPolicy && onSwitchPolicy('privacy')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className={`tab-btn ${activePolicy === 'terms' ? 'active' : ''}`}
            onClick={() => onSwitchPolicy && onSwitchPolicy('terms')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Terms of Service
          </button>
          <button
            type="button"
            className={`tab-btn ${activePolicy === 'as-is' ? 'active' : ''}`}
            onClick={() => onSwitchPolicy && onSwitchPolicy('as-is')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            AS-IS &amp; Defects
          </button>
          <button
            type="button"
            className={`tab-btn ${activePolicy === 'pickup' ? 'active' : ''}`}
            onClick={() => onSwitchPolicy && onSwitchPolicy('pickup')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Warehouse Pickup
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ padding: '1.75rem', lineHeight: '1.6', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {/* ============================================================== */}
          {/* 1. PRIVACY POLICY                                              */}
          {/* ============================================================== */}
          {activePolicy === 'privacy' && (
            <div>
              <div
                style={{
                  background: 'var(--emerald-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                <strong>Canadian Privacy Compliance:</strong> ApexxVault Direct Liquidation Inc. complies with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada's Anti-Spam Legislation (CASL).
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Collection of Personal Information</h4>
              <p style={{ marginBottom: '1rem' }}>
                We collect personal information necessary to facilitate liquidation lot reservations, process purchases, issue warehouse release codes, and prevent fraudulent claims. This includes your full legal name, email address, phone number, and physical city for pickup verification.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Use and Safeguards</h4>
              <p style={{ marginBottom: '1rem' }}>
                Your personal details are used solely to fulfill order reservations, transmit pickup pass barcodes, and communicate warehouse loading updates. We never sell, lease, or monetize customer information to third-party data brokers. Passwords are cryptographically salted and hashed using bcrypt.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Anti-Spam &amp; Notification Consent (CASL)</h4>
              <p style={{ marginBottom: '1rem' }}>
                Subscribing to VIP Liquidation Drop Alerts requires express consent. Every notification email and SMS text includes a 1-click unsubscribe mechanism. You may opt out of promotional alerts at any time while retaining transactional pickup notifications.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Customer Rights &amp; Access</h4>
              <p>
                Under PIPEDA, customers may request a copy of their stored account data or request permanent deletion of their account records by contacting our Privacy Officer at <strong style={{ color: 'var(--emerald-light)' }}>support@apexxvault.com</strong>.
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. TERMS OF SERVICE                                            */}
          {/* ============================================================== */}
          {activePolicy === 'terms' && (
            <div>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                <strong>Governing Jurisdiction:</strong> These Terms of Service are governed by the laws of the Province of Ontario and the applicable federal laws of Canada.
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Wholesale &amp; Liquidation Marketplace Nature</h4>
              <p style={{ marginBottom: '1rem' }}>
                ApexxVault operates a direct surplus liquidation depot in Scarborough, Ontario. Inventory consists of tier-1 overstock, retailer shelf pulls, certified customer returns, and wholesale pallets sourced from major North American distributors at up to 75% below retail MSRP.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Pricing &amp; Ontario HST Tax</h4>
              <p style={{ marginBottom: '1rem' }}>
                All prices displayed across the ApexxVault marketplace are in Canadian Dollars (CAD). In accordance with the Ontario Ministry of Finance and Canada Revenue Agency (CRA) guidelines, Ontario Harmonized Sales Tax (13% HST) is applied and itemized before final purchase and pickup. There is <strong>zero buyer's premium</strong> charged on ApexxVault purchases.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Order Reservations &amp; 2-Hour Flash Holds</h4>
              <p style={{ marginBottom: '1rem' }}>
                Placing a 2-Hour Flash Hold or completing a Direct DM reservation temporarily reserves inventory exclusively for you. If an order remains unpaid or unclaimed past the stated reservation window, ApexxVault reserves the right to release the lot back into public inventory.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Limitation of Liability</h4>
              <p>
                ApexxVault makes clear and honest condition grading disclosures on every listing. Total liability under any claim shall not exceed the amount actually paid by the purchaser for the specific lot in question.
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. AS-IS SALES AGREEMENT & DEFECT WARRANTY                    */}
          {/* ============================================================== */}
          {activePolicy === 'as-is' && (
            <div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  color: 'var(--gold-light)'
                }}
              >
                <strong>🛡️ 14-Day Functional Defect Warranty on Tested Items:</strong> Unlike blind auction houses that offer zero recourse, ApexxVault provides a 14-day warranty for dead-on-arrival (DOA) functional defects on all "Brand New" and "Open Box" classified lots.
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Condition Grading Standards</h4>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Brand New:</strong> Factory sealed in manufacturer packaging. Guaranteed 100% complete and pristine.</li>
                <li><strong>Appears New:</strong> Retail shelf pull or unsealed display model in mint condition. Inspected and operational.</li>
                <li><strong>Open Box:</strong> Power-tested and verified operational by ApexxVault technicians at our Scarborough depot.</li>
                <li><strong>Customer Return:</strong> Tested for fundamental operation. May exhibit minor cosmetic wear or non-original packaging.</li>
                <li><strong>Salvage / Repair / As-Is:</strong> Sold strictly as-is for technician salvage, parts, or repair. Non-refundable.</li>
              </ul>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. On-Site Inspection at Pickup</h4>
              <p style={{ marginBottom: '1rem' }}>
                Customers are invited and encouraged to inspect all items and power-test electronics at our Scarborough depot (Unit #32) before leaving the premises. Testing benches with AC power outlets are provided for buyer peace of mind.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Refund &amp; Exchange Process</h4>
              <p>
                In the rare event that a lot badged "Brand New" or "Open Box" experiences an unlisted hardware defect within 14 days of pickup, return the item with your original invoice and pickup code to Unit #32 for an immediate store credit or original payment method refund.
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. WAREHOUSE PICKUP POLICY                                     */}
          {/* ============================================================== */}
          {activePolicy === 'pickup' && (
            <div>
              <div
                style={{
                  background: 'var(--emerald-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                <strong>📍 Same-Day Scarborough Depot Pickup:</strong> Fast, contactless customer pickup available 7 days a week at our local distribution dock.
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Pickup Address &amp; Loading Dock</h4>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Address:</strong> {WAREHOUSE_PICKUP_DETAILS.fullAddress}<br />
                <strong>Dock:</strong> Unit #32 (Customer Pickup, Pallet Loading &amp; Inspection Desk)<br />
                <strong>Parking:</strong> Free on-site customer and contractor truck parking available directly in front of the bay door.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Hours of Operation</h4>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Monday through Saturday:</strong> 11:00 AM – 6:00 PM EST<br />
                <strong>Sunday:</strong> 11:00 AM – 5:00 PM EST<br />
                Same-day orders confirmed before 4:00 PM are ready for immediate collection within 30 minutes of reservation.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. What to Bring</h4>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Your Digital or Printed <strong>Pickup Code / Order Barcode</strong> (e.g. PK-XXXX).</li>
                <li>One piece of valid <strong>Government-issued Photo ID</strong> matching the order name.</li>
                <li>For wholesale pallet lots: ensure a suitable vehicle (SUV, pickup truck, or cargo van) for loading. Forklift assistance is provided by warehouse staff.</li>
              </ul>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Hold Periods &amp; No-Show Policy</h4>
              <p>
                Standard pickup reservations are held for <strong>48 hours</strong> following confirmation. If you anticipate a delay in collecting your lot, please notify the warehouse desk at <strong style={{ color: 'var(--emerald-light)' }}>{WAREHOUSE_PICKUP_DETAILS.phone}</strong> to extend your hold window. Unclaimed orders without notice may be released back into inventory.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '0.65rem 1.75rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: 'var(--shadow-emerald)'
            }}
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
