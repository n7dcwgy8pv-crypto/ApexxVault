import React from 'react';
import {
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';

export const ConditionGuidePage = () => {
  const { navigate } = useRouter();

  const conditionsList = [
    {
      title: 'Brand New (Factory Sealed)',
      tagClass: 'brand-new',
      summary: '100% factory sealed in pristine original retail manufacturer packaging.',
      details: [
        'Factory tape, seals, or shrink-wrap completely untouched.',
        'Zero cosmetic wear, handling marks, or usage.',
        'Includes all manufacturer warranties, documentation, and accessories.',
        'Direct retail overstock from major department and home improvement stores.'
      ]
    },
    {
      title: 'Appears New (Shelf Pull)',
      tagClass: 'appears-new',
      summary: 'Pristine, untouched merchandise where packaging may exhibit minor handling wear.',
      details: [
        'Outer retail carton may have minor handling scuffs, inventory barcode stickers, or opened outer flap for warehouse inspection.',
        'Product itself is 100% brand new, never energized or deployed.',
        'All standard retail accessories, cords, and hardware verified present.',
        'Massive savings (typically 40%–60% below retail MSRP).'
      ]
    },
    {
      title: 'Open Box (Inspected & Verified)',
      tagClass: 'open-box',
      summary: 'Item packaging was opened and unit has been power-tested and verified operational.',
      details: [
        'Tested by ApexxVault Scarborough technicians to ensure full functionality.',
        'Inspected for all essential components, chargers, and hardware.',
        'May show very light handling or fingerprint marks from technician inspection.',
        'Eligible for on-site testing on our customer diagnostic bench in Scarborough prior to loading.'
      ]
    },
    {
      title: 'Customer Return (Tested & Functional)',
      tagClass: 'customer-return',
      summary: 'Store return inventory that has undergone functionality testing.',
      details: [
        'Powered on and checked for essential core operations.',
        'May exhibit minor cosmetic marks or non-essential accessories may be substituted.',
        'Any specific notes or cosmetic blemishes are clearly disclosed in the lot notes.',
        'Sold at deep clearance rates (up to 75%–85% below retail MSRP).'
      ]
    },
    {
      title: 'Salvage / Repair / As-Is',
      tagClass: 'salvage',
      summary: 'Untested or non-functional lots designated strictly for parts, repair, or scrap salvage.',
      details: [
        'Sold strictly on an AS-IS, WHERE-IS basis with zero guarantees or returns.',
        'Intended for professional repair shops, mechanics, or scrap recovery.',
        'Offered at fraction-of-cost liquidation prices.'
      ]
    }
  ];

  return (
    <div className="content-page-wrapper">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Condition Grading Guide</span>
        </div>

        <div className="content-header-card">
          <span className="section-eyebrow">QUALITY ASSURANCE STANDARDS</span>
          <h1 className="content-page-title">Condition Grading Guide</h1>
          <p className="content-page-lead">
            At ApexxVault, we believe in radical transparency. Every lot in our Scarborough depot is individually classified by our technical team into standardized condition grades so you always know exactly what you are purchasing.
          </p>
        </div>

        <div className="conditions-cards-stack">
          {conditionsList.map((tier, idx) => (
            <div key={idx} className="condition-tier-card">
              <div className="condition-tier-header">
                <span className={`badge-condition ${tier.tagClass}`}>
                  {tier.title}
                </span>
                <p className="condition-tier-summary">{tier.summary}</p>
              </div>

              <div className="condition-tier-body">
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  What to Expect:
                </h4>
                <ul className="condition-checklist">
                  {tier.details.map((point, pIdx) => (
                    <li key={pIdx}>
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="condition-cta-footer">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3>Have questions about a specific lot's condition?</h3>
              <p>Our warehouse team can send you live photos or answer questions via WhatsApp.</p>
            </div>
            <Link to="/collections/all" className="btn-primary">
              <span>Browse All Graded Lots</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionGuidePage;
