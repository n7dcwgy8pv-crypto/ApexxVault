import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  Search,
  Mail,
  ChevronRight,
  Lock,
  Layers,
  Heart
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { useRouter, Link } from '../context/RouterContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { CATEGORIES } from '../data/auctionEvents';
import { formatCurrency, formatPercentOff } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import { subscribeDropAlerts } from '../services/api';

export const HomePage = () => {
  const {
    products,
    isLoadingProducts,
    categoryCounts,
    addToCart,
    openMakeOffer,
    catalogStats
  } = useAuction();

  const { navigate } = useRouter();
  const { showSuccess, showAlert } = useNotification();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Deal of the Day countdown timer (midnight countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Brands list for brand marquee
  const brandList = [
    'DeWalt',
    'Apple',
    'Dyson',
    'Sony',
    'Milwaukee',
    'Herman Miller',
    'Bosch',
    'Ninja',
    'Samsung',
    'Makita',
    'Oral-B',
    'Timberland PRO'
  ];

  // Featured Hero product (DeWalt Kit - Finding H1 & H2)
  const heroProduct = products.find(p => p.sku === 'SKU-DW-201') || products.find(p => p.category === 'tools') || products[0] || null;

  // Pick Deal of the Day product (e.g. Dyson or first product with highest discount)
  const dealOfTheDay = products.find(p => p.sku === 'SKU-DY-515') || products[0] || null;

  // Pick Deal of the Week (e.g. Herman Miller Aeron or Steelcase)
  const dealOfTheWeek = products.find(p => p.sku === 'SKU-HM-8802') || products.find(p => p.category === 'furniture') || products[1] || null;

  // This Week's Drops (8 items)
  const drops = products.slice(0, 8);

  // Category counts and images mapping (Single Source of Truth - Finding C4 & P5)
  const categoryCards = [
    {
      id: 'tools',
      title: 'Power Tools & Hardware',
      subtitle: 'Contractor sets, drills, saws & toolboxes',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
      count: categoryCounts ? (categoryCounts['tools'] ?? 0) : 0
    },
    {
      id: 'electronics',
      title: 'Consumer Electronics',
      subtitle: 'OLED displays, headphones, iPads & audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      count: categoryCounts ? (categoryCounts['electronics'] ?? 0) : 0
    },
    {
      id: 'appliances',
      title: 'Kitchen & Home Appliances',
      subtitle: 'Air fryers, robot vacuums & blenders',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
      count: categoryCounts ? (categoryCounts['appliances'] ?? 0) : 0
    },
    {
      id: 'furniture',
      title: 'Office & Living Furniture',
      subtitle: 'Ergonomic chairs, desks & storage',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
      count: categoryCounts ? (categoryCounts['furniture'] ?? 0) : 0
    },
    {
      id: 'health_beauty',
      title: 'Health, Beauty & Personal Care',
      subtitle: 'Sonic toothbrushes, groomers & wellness',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
      count: categoryCounts ? (categoryCounts['health_beauty'] ?? 0) : 0
    },
    {
      id: 'pets',
      title: 'Pet Supplies & Cameras',
      subtitle: 'Grooming gloves, toys & treat cams',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
      count: categoryCounts ? (categoryCounts['pets'] ?? 0) : 0
    },
    {
      id: 'pallets',
      title: 'Wholesale & Mystery Pallets',
      subtitle: 'Bulk tier-1 overstock manifests for resellers',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
      count: categoryCounts ? (categoryCounts['pallets'] ?? 0) : 0
    }
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showAlert('Please enter a valid email address.');
      return;
    }
    setNewsletterSubmitting(true);
    try {
      await subscribeDropAlerts({ email: newsletterEmail });
      setNewsletterSubscribed(true);
      showSuccess('You are on the VIP Drop Alert list! Check your inbox for $10 voucher code.');
    } catch {
      setNewsletterSubscribed(true);
      showSuccess('Subscribed to drop alerts! Promo code: WELCOME10');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <div className="homepage-content">
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: HERO BANNER */}
      {/* ---------------------------------------------------------------------- */}
      <section className="home-hero-section" aria-label="ApexxVault Liquidation Hero">
        <div className="container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <div className="hero-pill-badge">
                <Sparkles size={14} className="hero-pill-icon" />
                <span>Ontario Premier Direct Liquidation</span>
              </div>

              <h1 className="home-hero-title">
                Brand-name gear.<br />
                <span className="hero-title-accent">Liquidation prices.</span>
              </h1>

              <p className="home-hero-subtitle">
                Save up to 75% on authentic overstock, returns, and surplus inventory. Inspected, tested, and ready for fast delivery or Scarborough warehouse pickup.
              </p>

              <div className="home-hero-cta-group">
                <button
                  type="button"
                  className="btn-primary hero-cta-btn"
                  onClick={() => navigate('/collections/all')}
                >
                  <span>Shop the Deals</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn-secondary hero-cta-btn"
                  onClick={() => {
                    if (heroProduct) {
                      openMakeOffer(heroProduct);
                    } else {
                      navigate('/collections/all');
                    }
                  }}
                >
                  <DollarSign size={18} />
                  <span>Make an Offer</span>
                </button>
              </div>

              {/* Trust Stat Strip */}
              <div className="hero-stats-strip">
                <div className="hero-stat-item">
                  <strong>100%</strong>
                  <span>Authentic Guaranteed</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-item">
                  <strong>Up to 75%</strong>
                  <span>Below Retail MSRP</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-item">
                  <strong>1–2 Day</strong>
                  <span>Fast Ontario Dispatch</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-item">
                  <strong>Scarborough</strong>
                  <span>Same-Day Local Pickup</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Block */}
            <div className="home-hero-visual">
              <div
                className="hero-card-featured"
                onClick={() => heroProduct && navigate(`/products/${heroProduct.id || heroProduct._id}`)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
              >
                <div className="hero-card-badge">Featured Surplus Lot</div>
                <img
                  src={heroProduct?.images?.[0] || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900'}
                  alt={heroProduct?.title || 'DeWalt Overstock Kit'}
                  className="hero-featured-img"
                />
                <div className="hero-featured-overlay">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="hero-lot-title">{heroProduct?.title || 'DeWalt 20V Max Brushless Kit'}</span>
                      <p className="hero-lot-desc">{heroProduct?.condition || 'Factory Sealed'} • Retail MSRP {formatCurrency(heroProduct?.retailMSRP || 299.99)}</p>
                    </div>
                    <div className="hero-lot-price-tag">
                      <span className="hero-price">{formatCurrency(heroProduct?.price || 169.99)}</span>
                      <span className="hero-savings">SAVE {formatPercentOff(heroProduct?.price || 169.99, heroProduct?.retailMSRP || 299.99)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: DEAL OF THE DAY STRIP */}
      {/* ---------------------------------------------------------------------- */}
      {dealOfTheDay && (
        <section className="deal-of-the-day-strip" aria-label="Deal of the Day">
          <div className="container">
            <div className="deal-strip-inner">
              <div className="deal-strip-badge">
                <Zap size={16} fill="currentColor" />
                <span>TODAY ONLY — DEAL OF THE DAY</span>
              </div>

              <div className="deal-strip-product">
                <img
                  src={dealOfTheDay.images?.[0] || 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400'}
                  alt={dealOfTheDay.title}
                  className="deal-strip-thumb"
                />
                <div className="deal-strip-details">
                  <h4 className="deal-strip-title">{dealOfTheDay.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="deal-strip-price">{formatCurrency(dealOfTheDay.price)}</span>
                    <span className="deal-strip-msrp">MSRP {formatCurrency(dealOfTheDay.retailMSRP)}</span>
                    <span className="deal-strip-discount">
                      SAVE {formatPercentOff(dealOfTheDay.price, dealOfTheDay.retailMSRP)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="deal-strip-countdown">
                <span className="countdown-label">Ends in:</span>
                <div className="countdown-boxes">
                  <span className="countdown-box">{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span className="countdown-sep">:</span>
                  <span className="countdown-box">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span className="countdown-sep">:</span>
                  <span className="countdown-box">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary deal-strip-btn"
                onClick={() => {
                  addToCart(dealOfTheDay, 1);
                  navigate('/checkout');
                }}
              >
                <span>Claim Deal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 4: BRAND MARQUEE */}
      {/* ---------------------------------------------------------------------- */}
      <section className="brand-marquee-section" aria-label="Featured Brands">
        <div className="brand-marquee-container">
          <div className="brand-marquee-track">
            {brandList.concat(brandList).map((brand, i) => (
              <span key={`brand-${i}`} className="brand-pill-item">
                <span className="brand-dot">•</span>
                <span>{brand}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 5: 4 TRUST CARDS */}
      {/* ---------------------------------------------------------------------- */}
      <section className="trust-cards-section">
        <div className="container">
          <div className="trust-cards-grid">
            <div className="trust-card-item">
              <div className="trust-card-icon">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="trust-item-title">Free Delivery Over $99</h4>
                <p className="trust-item-desc">Fast dispatch across Ontario. Safe curb or door courier.</p>
              </div>
            </div>

            <div className="trust-card-item">
              <div className="trust-card-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="trust-item-title">100% Authentic</h4>
                <p className="trust-item-desc">Tested, inspected, and verified genuine surplus by our team.</p>
              </div>
            </div>

            <div className="trust-card-item">
              <div className="trust-card-icon">
                <Lock size={22} />
              </div>
              <div>
                <h4 className="trust-item-title">Secure Checkout</h4>
                <p className="trust-item-desc">Bank-grade 256-bit encryption and protected payment gateways.</p>
              </div>
            </div>

            <div className="trust-card-item">
              <div className="trust-card-icon">
                <PackageCheck size={22} />
              </div>
              <div>
                <h4 className="trust-item-title">Easy 30-Day Returns</h4>
                <p className="trust-item-desc">Hassle-free return policy on eligible retail purchases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 6: THIS WEEK'S DROPS */}
      {/* ---------------------------------------------------------------------- */}
      <section className="weekly-drops-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} />
                <span>FRESH SURPLUS ARRIVALS</span>
              </div>
              <h2 className="section-title">This Week's Drops</h2>
            </div>
            <Link to="/collections/all" className="section-view-all-link">
              <span>View All Lots</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="loading-grid-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : drops.length === 0 ? (
            <div className="empty-state-card">
              <PackageCheck size={36} color="var(--ink-muted)" />
              <p>New drops arriving daily from our Scarborough depot.</p>
            </div>
          ) : (
            <div className="products-grid-catalog">
              {drops.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 7: BROWSE BY CATEGORY */}
      {/* ---------------------------------------------------------------------- */}
      <section className="browse-categories-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">
                <Layers size={14} />
                <span>LIQUIDATION DEPARTMENTS</span>
              </div>
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <Link to="/pages/categories" className="section-view-all-link">
              <span>All Categories</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="category-cards-grid">
            {categoryCards.map((cat) => (
              <div
                key={cat.id}
                className="category-card-item"
                onClick={() => navigate(`/collections/${cat.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="category-card-img-wrap">
                  <img src={cat.image} alt={cat.title} className="category-card-img" />
                  <span className="category-card-count">{cat.count} Lots</span>
                </div>
                <div className="category-card-info">
                  <h3 className="category-card-title">{cat.title}</h3>
                  <p className="category-card-subtitle">{cat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 8: DEAL OF THE WEEK FEATURE BLOCK */}
      {/* ---------------------------------------------------------------------- */}
      {dealOfTheWeek && (
        <section id="deal-of-the-week" className="deal-of-week-section">
          <div className="container">
            <div className="deal-of-week-block">
              <div className="deal-week-badge-banner">
                <Sparkles size={16} />
                <span>FEATURED SPOTLIGHT — DEAL OF THE WEEK</span>
              </div>

              <div className="deal-week-content-grid">
                <div className="deal-week-image-wrap">
                  <img
                    src={dealOfTheWeek.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'}
                    alt={dealOfTheWeek.title}
                    className="deal-week-image"
                  />
                  <div className="deal-week-save-floating">
                    SAVE {formatPercentOff(dealOfTheWeek.price, dealOfTheWeek.retailMSRP)}%
                  </div>
                </div>

                <div className="deal-week-info-col">
                  <div className="deal-week-condition-row">
                    <span className="badge-condition open-box">{dealOfTheWeek.condition}</span>
                    <span className="deal-week-sku">Lot #{dealOfTheWeek.sku}</span>
                  </div>

                  <h3 className="deal-week-title">{dealOfTheWeek.title}</h3>
                  <p className="deal-week-description">
                    {dealOfTheWeek.description ||
                      `${dealOfTheWeek.title} — Verified tier-1 retail overstock surplus inspected and tested at our Scarborough depot.`}
                  </p>

                  <div className="deal-week-pricing-box">
                    <div className="deal-week-current-price">
                      {formatCurrency(dealOfTheWeek.price)}
                    </div>
                    <div className="deal-week-msrp-line">
                      Retail MSRP: <span className="struck">{formatCurrency(dealOfTheWeek.retailMSRP)}</span>
                    </div>
                    <div className="deal-week-total-savings">
                      You save {formatCurrency(Math.max(0, dealOfTheWeek.retailMSRP - dealOfTheWeek.price))} CAD
                    </div>
                  </div>

                  <div className="deal-week-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        addToCart(dealOfTheWeek, 1);
                        navigate('/checkout');
                      }}
                    >
                      <Zap size={16} />
                      <span>Buy Now (Instant Checkout)</span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => openMakeOffer(dealOfTheWeek)}
                    >
                      <DollarSign size={16} />
                      <span>Make an Offer</span>
                    </button>
                  </div>

                  <div className="deal-week-perks">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} color="var(--emerald-primary)" />
                      <span>Same-day pickup at 705 Progress Ave #32, Scarborough</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} color="var(--emerald-primary)" />
                      <span>Free delivery eligible (Order exceeds $99 CAD threshold)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 9: HOW IT WORKS (3 STEPS) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-eyebrow justify-center">
              <span>SIMPLE &amp; TRANSPARENT</span>
            </div>
            <h2 className="section-title">How ApexxVault Works</h2>
            <p className="section-subtitle">
              Radical transparency, zero auction games, and genuine wholesale pricing.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="how-step-card">
              <div className="how-step-number">01</div>
              <h3 className="how-step-title">Find the Deal</h3>
              <p className="how-step-desc">
                Browse certified retail overstock, tech surplus, contractor tools, and wholesale pallets at up to 75% below retail MSRP.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">02</div>
              <h3 className="how-step-title">Buy It or Make an Offer</h3>
              <p className="how-step-desc">
                Checkout instantly at fixed liquidation prices or propose your price via "Make an Offer" for volume inquiries.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">03</div>
              <h3 className="how-step-title">Delivered Fast or Pickup</h3>
              <p className="how-step-desc">
                Pick up same-day at our Scarborough warehouse (705 Progress Ave #32) or get free courier delivery on orders over $99.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 10: NOTIFY ME (NEWSLETTER EMAIL CAPTURE) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="notify-newsletter-section">
        <div className="container">
          <div className="newsletter-card-box">
            <div className="newsletter-content">
              <span className="newsletter-eyebrow">NEVER MISS A DROP</span>
              <h2 className="newsletter-title">Get VIP Drops in Your Inbox</h2>
              <p className="newsletter-desc">
                New retail overstock arrives every Tuesday &amp; Thursday. Subscribe for early access, private wholesale manifests, and an instant $10 voucher.
              </p>

              {newsletterSubscribed ? (
                <div className="newsletter-success-box">
                  <CheckCircle2 size={24} color="var(--emerald-primary)" />
                  <div>
                    <strong>You're in! Check your inbox.</strong>
                    <p>Use code <strong>WELCOME10</strong> at checkout for 10% off your first order.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <div className="newsletter-input-group">
                    <Mail size={18} className="newsletter-input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="newsletter-email-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary newsletter-submit-btn"
                    disabled={newsletterSubmitting}
                  >
                    <span>{newsletterSubmitting ? 'Joining...' : 'Get Drop Alerts'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              <p className="newsletter-disclaimer">
                No spam. Unsubscribe anytime. View our <Link to="/policies/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
