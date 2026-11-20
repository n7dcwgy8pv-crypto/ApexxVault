import React from 'react';
import {
  PackageCheck,
  ShieldCheck,
  Truck,
  Building,
  Mail,
  Phone,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';

export const Footer = () => {
  return (
    <footer className="footer-wrapper" aria-label="Store Footer">
      <div className="container">
        {/* Trust Badges 4-Column Grid */}
        <div className="footer-trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <PackageCheck size={22} />
            </div>
            <div>
              <h4>Direct Liquidation</h4>
              <p>Instant buyout on overstock &amp; brand-new surplus with zero bidding delays.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box" style={{ background: 'var(--blue-bg)', color: 'var(--blue-light)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4>Verified Inspection</h4>
              <p>Every lot tested and classified: Brand New, Appears New, Open Box, or Return.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box" style={{ background: 'var(--gold-bg)', color: 'var(--gold-light)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4>Same-Day Pickup</h4>
              <p>Pick up same-day at our local hub or arrange express courier freight.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box" style={{ background: 'var(--emerald-bg)', color: 'var(--emerald-light)' }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <h4>Direct Seller DM</h4>
              <p>Instant direct communication via Phone, SMS, or WhatsApp for reservations.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content: Brand Details & Interactive Location Map */}
        <div className="footer-main-grid">
          {/* Brand & Warehouse Contact Details */}
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
              <img
                src="/logo-icon.png"
                alt="ApexxVault Emblem"
                className="brand-logo-emblem"
                style={{ height: '48px', width: '48px' }}
              />
              <span className="brand-logo-text" style={{ fontSize: '1.45rem' }}>APEXXVAULT</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Ontario's premier direct wholesale and liquidation marketplace for tier-1 overstock, contractor equipment, and retail pallets at up to 90% below MSRP.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <Building size={14} color="var(--emerald-light)" />
                <span>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} color="var(--emerald-light)" />
                <span>{WAREHOUSE_PICKUP_DETAILS.phone} (Warehouse Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} color="var(--emerald-light)" />
                <span>{WAREHOUSE_PICKUP_DETAILS.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} color="var(--emerald-light)" />
                <span>{WAREHOUSE_PICKUP_DETAILS.hours}</span>
              </div>
            </div>
          </div>

          {/* Interactive Google Map of Warehouse Location */}
          <div className="footer-map-col" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.85rem' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)' }}>
                <MapPin size={16} color="var(--emerald-light)" />
                <span>Warehouse Location (Scarborough)</span>
              </h5>
              <a
                href="https://maps.google.com/?q=705+Progress+Ave+%2332,+Scarborough,+ON+M1H+2X1,+Canada"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--emerald-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none',
                  background: 'var(--emerald-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
                }}
              >
                <Navigation size={12} />
                <span>Directions in Google Maps</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Map Frame */}
            <div
              style={{
                flex: 1,
                minHeight: '200px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1.5px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}
            >
              <iframe
                title="ApexxVault Scarborough Location Map"
                src="https://maps.google.com/maps?q=705+Progress+Ave+%2332,+Scarborough,+ON+M1H+2X1,+Canada&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: '200px',
                  width: '100%',
                  display: 'block'
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Unit #32 (Loading Dock &amp; Customer Pickups)</span>
              <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>Free On-Site Parking</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} ApexxVault Direct Liquidation Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)' }}>AS-IS Sales Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
