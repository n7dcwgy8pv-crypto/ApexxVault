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
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { WAREHOUSE_PICKUP_DETAILS } from '../../utils/barcodeHelper';
import { useRouter, Link } from '../../context/RouterContext';
import { CATEGORIES } from '../../data/auctionEvents';

export const Footer = () => {
  const { navigate } = useRouter();

  return (
    <footer className="site-footer" aria-label="ApexxVault Footer">
      <div className="container">
        {/* Main Footer Links & Info Grid */}
        <div className="footer-columns-grid">
          {/* Col 1: Brand & Scarborough Hub */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-link" title="ApexxVault">
              <img
                src="/apexxvault-brand-logo.png"
                alt="ApexxVault"
                style={{ height: '48px', width: 'auto', maxWidth: '240px', objectFit: 'contain', display: 'block' }}
              />
            </Link>

            <p className="footer-about-text">
              Scarborough's premier direct liquidation depot for verified retail surplus, contractor tools, consumer electronics, and wholesale pallets. Inspected in-house, priced up to 75% below retail MSRP (CAD).
            </p>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} className="footer-icon-accent" />
                <span>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</span>
              </div>
              <div className="footer-contact-item">
                <Clock size={16} className="footer-icon-accent" />
                <span>{WAREHOUSE_PICKUP_DETAILS.hours}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} className="footer-icon-accent" />
                <a href="tel:+14165716702">(416) 571-6702</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="footer-icon-accent" />
                <a href="mailto:support@apexxvault.com">support@apexxvault.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><Link to="/collections/all">Shop All Inventory</Link></li>
              <li><Link to="/pages/categories">Browse Categories</Link></li>
              <li><Link to="/#deal-of-the-week">Deal of the Week</Link></li>
              <li><Link to="/pages/about-us">About Our Depot</Link></li>
              <li><Link to="/pages/contact">Contact &amp; Location</Link></li>
              <li><Link to="/pages/condition-guide">Condition Grading Guide</Link></li>
              <li><Link to="/pages/freight">Freight &amp; Pallet Estimator</Link></li>
              <li><Link to="/account">My Account &amp; Orders</Link></li>
              <li><Link to="/admin" style={{ opacity: 0.8 }}>Staff &amp; Admin Suite</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Departments</h4>
            <ul className="footer-nav-list">
              {CATEGORIES.filter(c => c.id !== 'all').slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/collections/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Warehouse Policies & Trust */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Policies</h4>
            <ul className="footer-nav-list">
              <li><Link to="/policies/privacy">Privacy Policy (PIPEDA)</Link></li>
              <li><Link to="/policies/terms">Terms of Service</Link></li>
              <li><Link to="/policies/as-is">As-Is Liquidation Disclosure</Link></li>
              <li><Link to="/policies/shipping">Shipping &amp; Local Pickup Policy</Link></li>
              <li><Link to="/policies/returns">30-Day Return &amp; Warranty Policy</Link></li>
            </ul>

            <div className="footer-security-box">
              <div className="flex items-center gap-2" style={{ color: 'var(--ink-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Lock size={15} color="var(--accent-gold)" />
                <span>Bank-Grade 256-bit SSL</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '0.35rem' }}>
                All payments processed securely via Stripe. CAD currency with Ontario 13% HST.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location Note */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} ApexxVault Inc. All rights reserved. 705 Progress Ave #32, Scarborough, ON M1H 2X1.
          </p>
          <div className="footer-bottom-badges">
            <span className="footer-badge-pill">Ontario HST Registered</span>
            <span className="footer-badge-pill">100% Authentic Guaranteed</span>
            <span className="footer-badge-pill">Scarborough Customer Depot</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
