import React from 'react';
import { ShieldCheck, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';

export const PolicyPage = ({ policySlug = null }) => {
  const { matchRoute } = useRouter();

  const routeMatch = matchRoute('/policies/:policy');
  const activeSlug = policySlug || routeMatch?.params?.policy || 'privacy';

  const policiesData = {
    privacy: {
      title: 'ApexxVault Privacy Policy',
      subtitle: 'Compliance with the Canadian Personal Information Protection and Electronic Documents Act (PIPEDA)',
      updated: 'November 20, 2026',
      content: (
        <>
          <h3>1. Our Commitment to Your Privacy</h3>
          <p>
            ApexxVault Inc. ("ApexxVault", "we", "us", or "our") operates the website https://www.apexxvault.com and the physical liquidation warehouse depot located at 705 Progress Ave #32, Scarborough, ON M1H 2X1. We respect your privacy and are committed to protecting personal information in full compliance with PIPEDA and applicable Ontario provincial privacy laws.
          </p>

          <h3>2. Information We Collect</h3>
          <p>
            When you purchase liquidation assets, place an order hold, make a wholesale offer, or subscribe to drop alerts, we collect:
          </p>
          <ul>
            <li><strong>Contact Identifiers:</strong> First name, last name, email address, telephone number, and Canadian postal address.</li>
            <li><strong>Fulfillment & Verification Records:</strong> Digital order pickup barcodes, pickup QR codes, and government photo ID verification at Unit #32 for asset release.</li>
            <li><strong>Transaction & Payment Details:</strong> Subtotals, Ontario HST calculations, and tokenized payment identifiers handled securely by Stripe. We never store raw credit card numbers on our servers.</li>
          </ul>

          <h3>3. How We Use Your Information</h3>
          <p>
            We use collected information solely for:
          </p>
          <ul>
            <li>Processing asset reservations, customer pickup passes, and freight delivery.</li>
            <li>Dispatching digital order invoices, tracking codes, and SMS pickup readiness notices.</li>
            <li>Communicating responses to buyer counter-offers and wholesale inquiries.</li>
            <li>Preventing fraudulent warehouse loading and maintaining inventory security.</li>
          </ul>

          <h3>4. Zero Third-Party Sale Guarantee</h3>
          <p>
            We do not sell, rent, lease, or monetize your contact information or browsing data to third-party data brokers or marketing agencies. Information is shared only with verified logistics partners (such as courier carriers for delivery) strictly necessary to fulfill your order.
          </p>
        </>
      )
    },
    terms: {
      title: 'Terms of Service & Auction Agreement',
      subtitle: 'Commercial terms governing sales, reservations, holds, and depot pickups',
      updated: 'November 20, 2026',
      content: (
        <>
          <h3>1. General Agreement</h3>
          <p>
            By accessing ApexxVault.com or completing a purchase through our online portal or warehouse desk, you agree to these Terms of Service. All transactions are priced in Canadian Dollars (CAD) and subject to 13% Ontario Harmonized Sales Tax (HST).
          </p>

          <h3>2. Asset Descriptions & Graded Conditions</h3>
          <p>
            ApexxVault specializes in the wholesale redistribution of tier-1 retail overstock, open-box merchandise, and commercial surplus. Each lot is cataloged with an official SKU, stated condition grade, and estimated retail MSRP. Buyers are advised to review the specific grading notes associated with each lot.
          </p>

          <h3>3. 2-Hour Flash Holds & Cart Reservations</h3>
          <p>
            To promote fair access to high-demand inventory, customers may place a 2-hour Flash Hold on select single lots. During the active hold period, the item is reserved exclusively for the holder. Holds may be voluntarily cancelled by the buyer at any time from their Customer Account Hub. If not checked out within the duration, the lot automatically returns to open catalog status.
          </p>

          <h3>4. Warehouse Pickup & Loading Obligations</h3>
          <p>
            Buyers selecting Scarborough Local Pickup must retrieve purchases within 7 calendar days at 705 Progress Ave #32, Scarborough, ON. Valid photo ID and the digital pickup pass barcode are required for release. Orders remaining unclaimed after 14 days without notice may be subject to restocking.
          </p>
        </>
      )
    },
    'as-is': {
      title: 'As-Is Liquidation Disclosure & Guarantee',
      subtitle: 'Clear terms on surplus condition tiers, testing benches, and guarantees',
      updated: 'November 20, 2026',
      content: (
        <>
          <h3>1. Radical Transparency Disclosure</h3>
          <p>
            Unlike traditional retail stores that sell exclusively brand-new factory inventory at full markup, ApexxVault operates as a premier direct liquidation depot. We acquire surplus inventory from major commercial retailers, store shelf-pulls, and overstock pallets.
          </p>

          <h3>2. Testing Bench On Site</h3>
          <p>
            We provide a dedicated customer diagnostic testing bench at Unit #32 in Scarborough. For all Open Box, Appears New, and Customer Return electronics, appliances, and power tools, customers picking up locally are encouraged to power on and verify operational capability prior to loading.
          </p>

          <h3>3. Grading Accuracy Commitment</h3>
          <p>
            If any item marked "Brand New" or "Appears New" is discovered upon pickup to have undisclosed damage or missing core components not stated in the lot notes, our warehouse manager will immediately issue a 100% full refund or replacement lot of equal or greater value.
          </p>
        </>
      )
    },
    shipping: {
      title: 'Shipping, Freight & Local Pickup Policy',
      subtitle: 'Scarborough loading dock procedures and Ontario courier guidelines',
      updated: 'November 20, 2026',
      content: (
        <>
          <h3>1. Free Local Pickup in Scarborough</h3>
          <p>
            Local customer pickup is 100% free with zero handling fees. Our warehouse depot is located at:
            <br />
            <strong>{WAREHOUSE_PICKUP_DETAILS.fullAddress}</strong>
            <br />
            <strong>Hours:</strong> {WAREHOUSE_PICKUP_DETAILS.hours}
          </p>
          <p>
            Pickup orders are typically ready within 2 hours of online checkout. Please bring your Order Barcode and matching photo ID.
          </p>

          <h3>2. Free Ontario Courier Delivery ($99+ Orders)</h3>
          <p>
            All parcel orders with a subtotal of $99 CAD or greater qualify for <strong>FREE courier delivery</strong> across Ontario. Orders under $99 CAD are shipped at a flat standard rate of $15.00 CAD.
          </p>

          <h3>3. Heavy Pallet & LTL Freight Logistics</h3>
          <p>
            Full uninspected pallets, industrial equipment, and wholesale machinery exceeding standard courier weight limits are shipped via our LTL freight carrier partners (Day &amp; Ross, Fastfrate). Commercial dock and residential hydraulic liftgate options are available.
          </p>
        </>
      )
    },
    returns: {
      title: '30-Day Return & Warranty Policy',
      subtitle: 'Fair, transparent return terms for verified retail merchandise',
      updated: 'November 20, 2026',
      content: (
        <>
          <h3>1. 30-Day Hassle-Free Return Policy</h3>
          <p>
            Merchandise categorized as <strong>Brand New (Factory Sealed)</strong>, <strong>Appears New</strong>, or <strong>Open Box</strong> is eligible for return or exchange within 30 days of purchase or courier delivery.
          </p>

          <h3>2. Return Criteria</h3>
          <ul>
            <li>Item must be returned in the condition received, complete with all original accessories, cords, manuals, and retail packaging.</li>
            <li>Returns may be brought in-person to our Scarborough Depot at Unit #32 for immediate inspection and refund processing.</li>
            <li>For shipped orders, customer support will issue a prepaid return authorization upon review of technical defect.</li>
          </ul>

          <h3>3. Exclusions</h3>
          <p>
            Items specifically designated as "Salvage / Parts / As-Is" or custom-quoted wholesale full pallets are sold strictly as final clearance and are non-returnable.
          </p>
        </>
      )
    }
  };

  const currentPolicy = policiesData[activeSlug] || policiesData.privacy;

  return (
    <div className="content-page-wrapper">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/policies/privacy">Policies</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">{currentPolicy.title}</span>
        </div>

        {/* Policy Header */}
        <div className="content-header-card">
          <span className="section-eyebrow">OFFICIAL WAREHOUSE POLICY</span>
          <h1 className="content-page-title">{currentPolicy.title}</h1>
          <p className="content-page-lead">{currentPolicy.subtitle}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '0.5rem' }}>
            Effective Date: {currentPolicy.updated} • ApexxVault Scarborough Depot
          </p>
        </div>

        {/* Policy Switcher Tabs */}
        <div className="policy-switcher-tabs">
          {[
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'as-is', label: 'As-Is Disclosure' },
            { id: 'shipping', label: 'Shipping & Pickup' },
            { id: 'returns', label: '30-Day Returns' }
          ].map(p => (
            <Link
              key={p.id}
              to={`/policies/${p.id}`}
              className={`policy-pill-tab ${activeSlug === p.id ? 'active' : ''}`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        {/* Policy Content */}
        <div className="content-body-card policy-prose">
          {currentPolicy.content}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
