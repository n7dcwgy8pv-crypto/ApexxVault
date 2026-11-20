import React from 'react';
import {
  Building,
  ShieldCheck,
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';

export const AboutUsPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="content-page-wrapper">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">About ApexxVault</span>
        </div>

        {/* Hero Section */}
        <div className="content-header-card">
          <span className="section-eyebrow">OUR STORY &amp; DEPOT</span>
          <h1 className="content-page-title">Direct Tier-1 Liquidation &amp; Surplus Wholesale</h1>
          <p className="content-page-lead">
            ApexxVault was founded in Scarborough, Ontario with a singular mission: to eliminate retail price gouging and auction gimmicks by providing direct access to verified commercial surplus, overstock, and open-box equipment at liquidation prices.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="content-body-card">
          <h2>How We Do It</h2>
          <p>
            Every week, major Canadian and North American big-box retailers, corporate enterprises, and distribution centers liquidate pristine overstock inventory to make room for new seasonal shipments. Traditionally, these premium goods were locked behind private broker networks or unpredictable auction rooms with hidden buyer premiums.
          </p>
          <p>
            ApexxVault secures high-volume master contracts directly from tier-1 distribution hubs. We bring these assets straight to our Scarborough warehouse at <strong>705 Progress Ave #32</strong>, test and verify every lot individually, and pass the savings (up to 90% below retail MSRP) directly to Canadian consumers, contractors, and independent resellers.
          </p>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <ShieldCheck size={28} className="pillar-icon" />
              <h3>100% Verified Authenticity</h3>
              <p>
                Zero counterfeit or unverified items. Every unit is inspected by our warehouse technicians and graded with full condition disclosure.
              </p>
            </div>

            <div className="about-pillar-card">
              <PackageCheck size={28} className="pillar-icon" />
              <h3>Radical Transparency</h3>
              <p>
                We publish genuine retail MSRPs, verifiable SKUs, actual product photos, and graded condition benchmarks so you know exactly what you are purchasing.
              </p>
            </div>

            <div className="about-pillar-card">
              <Truck size={28} className="pillar-icon" />
              <h3>Local Loading &amp; Fast Courier</h3>
              <p>
                Pick up same-day at our dedicated customer loading dock in Scarborough or take advantage of fast Ontario courier delivery with free shipping over $99 CAD.
              </p>
            </div>
          </div>

          <h2>The Scarborough Pickup Experience</h2>
          <p>
            We designed our facility for seamless, professional loading. When you purchase online, you receive an instant Digital Pickup Pass with an automated barcode and QR code.
          </p>
          <ul>
            <li>
              <strong>Dedicated Customer Dock:</strong> Drive straight to Unit #32 at 705 Progress Ave. Free parking and commercial loading bays provided.
            </li>
            <li>
              <strong>Testing Bench on Site:</strong> Customers are invited to inspect and test open-box units on our diagnostic testing bench before leaving the depot.
            </li>
            <li>
              <strong>Fast Staff Release:</strong> Present your barcode on your phone with one matching piece of government ID. Most orders are loaded in under 3 minutes.
            </li>
          </ul>

          <div className="about-location-callout">
            <div className="flex items-center gap-3">
              <MapPin size={24} color="var(--accent-gold)" />
              <div>
                <strong>ApexxVault Scarborough Depot</strong>
                <p>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--ink-muted)' }}>
                  Operating Hours: {WAREHOUSE_PICKUP_DETAILS.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
