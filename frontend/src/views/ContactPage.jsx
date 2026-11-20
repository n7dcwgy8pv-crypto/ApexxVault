import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ChevronRight,
  Send,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';
import { useNotification } from '../context/NotificationContext';

export const ContactPage = () => {
  const { showSuccess, showAlert } = useNotification();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Product / Lot Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formEmail || !formName || !formMessage) {
      showAlert('Please complete all required fields.');
      return;
    }
    setIsSent(true);
    showSuccess('Your message has been sent to our Scarborough warehouse desk!');
  };

  return (
    <div className="content-page-wrapper">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Contact &amp; Location</span>
        </div>

        <div className="content-header-card">
          <span className="section-eyebrow">CUSTOMER SUPPORT &amp; WAREHOUSE DESK</span>
          <h1 className="content-page-title">We're Here to Help</h1>
          <p className="content-page-lead">
            Have questions about an active liquidation lot, pallet manifest, or same-day pickup? Reach out to our Scarborough team directly via WhatsApp, Phone, or Email.
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div className="contact-cards-grid">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/14165716702?text=Hello%20ApexxVault,%20I%20have%20an%20inquiry%20regarding%20a%20liquidation%20lot."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-item whatsapp-card"
          >
            <div className="contact-card-icon-box" style={{ background: '#25D366', color: '#FFFFFF' }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <h3>Chat on WhatsApp</h3>
              <p>Instant answers on lots, holds, &amp; reservations.</p>
              <strong className="contact-card-link-text">+1 (416) 571-6702 &rarr;</strong>
            </div>
          </a>

          {/* Phone Card */}
          <a href="tel:+14165716702" className="contact-card-item">
            <div className="contact-card-icon-box">
              <Phone size={24} />
            </div>
            <div>
              <h3>Warehouse Phone</h3>
              <p>Direct line to Scarborough loading bay desk.</p>
              <strong className="contact-card-link-text">(416) 571-6702 &rarr;</strong>
            </div>
          </a>

          {/* Email Card */}
          <a href="mailto:support@apexxvault.com" className="contact-card-item">
            <div className="contact-card-icon-box">
              <Mail size={24} />
            </div>
            <div>
              <h3>Email Desk</h3>
              <p>For invoices, freight inquiries, &amp; corporate manifests.</p>
              <strong className="contact-card-link-text">support@apexxvault.com &rarr;</strong>
            </div>
          </a>

          {/* Scarborough Location Card */}
          <div className="contact-card-item">
            <div className="contact-card-icon-box">
              <MapPin size={24} />
            </div>
            <div>
              <h3>Scarborough Depot</h3>
              <p>{WAREHOUSE_PICKUP_DETAILS.street}, {WAREHOUSE_PICKUP_DETAILS.city}, ON</p>
              <strong className="contact-card-link-text">{WAREHOUSE_PICKUP_DETAILS.hours}</strong>
            </div>
          </div>
        </div>

        {/* Main Content Row: Form & Map Location */}
        <div className="contact-main-grid">
          {/* Contact Message Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Our customer service team typically replies within 1–2 business hours during warehouse operating days.
            </p>

            {isSent ? (
              <div className="contact-success-box">
                <CheckCircle2 size={36} color="var(--emerald-primary)" />
                <h3>Thank you, {formName}!</h3>
                <p>Your inquiry regarding "{formSubject}" has been delivered. We will respond to {formEmail} shortly.</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsSent(false)}
                  style={{ marginTop: '1rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-inner">
                <div className="checkout-fields-row">
                  <div className="checkout-field-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. David Miller"
                    />
                  </div>
                  <div className="checkout-field-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="checkout-fields-row">
                  <div className="checkout-field-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+1 (416) 000-0000"
                    />
                  </div>
                  <div className="checkout-field-group">
                    <label>Subject</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                    >
                      <option value="Product / Lot Inquiry">Product / Lot Inquiry</option>
                      <option value="Pickup / Warehouse Loading">Pickup / Warehouse Loading</option>
                      <option value="Bulk Pallet Wholesale">Bulk Pallet Wholesale</option>
                      <option value="Freight Shipping Estimate">Freight Shipping Estimate</option>
                      <option value="Returns & Warranty">Returns &amp; Warranty</option>
                    </select>
                  </div>
                </div>

                <div className="checkout-field-group">
                  <label>Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Provide lot numbers, SKU references, or any specific questions..."
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  <Send size={16} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Depot Location Details Card */}
          <div className="contact-location-sidebar">
            <div className="location-sidebar-card">
              <h3>Scarborough Facility Details</h3>

              <div className="location-detail-row">
                <Building size={18} className="loc-icon" />
                <div>
                  <strong>Address</strong>
                  <p>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</p>
                </div>
              </div>

              <div className="location-detail-row">
                <Clock size={18} className="loc-icon" />
                <div>
                  <strong>Warehouse &amp; Loading Hours</strong>
                  <p>Monday – Saturday: 11:00 AM – 6:00 PM EST</p>
                  <p>Sunday: 11:00 AM – 5:00 PM EST</p>
                </div>
              </div>

              <div className="location-detail-row">
                <MapPin size={18} className="loc-icon" />
                <div>
                  <strong>Customer Loading Dock</strong>
                  <p>Drive to <strong>Unit #32</strong> (East side loading ramp). Free parking for vans, pickup trucks, and commercial trailers.</p>
                </div>
              </div>

              {/* External Google Maps directions */}
              <a
                href="https://maps.google.com/?q=705+Progress+Ave+%2332,+Scarborough,+ON+M1H+2X1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
              >
                <span>Open in Google Maps &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
