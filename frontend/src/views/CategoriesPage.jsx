import React from 'react';
import { Layers, ChevronRight, Sparkles, ArrowRight, PackageCheck, Mail } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuction } from '../context/AuctionContext';
import { CATEGORIES } from '../data/auctionEvents';

export const CategoriesPage = () => {
  const { navigate } = useRouter();
  const { products, categoryCounts, setIsDropAlertOpen } = useAuction();

  const categoryDetails = [
    {
      id: 'tools',
      name: 'Power Tools & Hardware',
      description: 'Contractor drills, impact drivers, table saws, combo toolkits & accessories from DeWalt, Milwaukee, Makita & Bosch.',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700',
      count: categoryCounts ? (categoryCounts['tools'] ?? 0) : 0
    },
    {
      id: 'electronics',
      name: 'Consumer Electronics & Audio',
      description: 'OLED tablets, noise-canceling headphones, smart monitors, laptops & gaming gear from Apple, Sony, Samsung & Dyson.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
      count: categoryCounts ? (categoryCounts['electronics'] ?? 0) : 0
    },
    {
      id: 'appliances',
      name: 'Kitchen & Home Appliances',
      description: 'Air fryers, multicookers, robot vacuums, blenders & coffee machines from Ninja, Dyson, Instant Pot & Philips.',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=700',
      count: categoryCounts ? (categoryCounts['appliances'] ?? 0) : 0
    },
    {
      id: 'furniture',
      name: 'Ergonomic Office & Living',
      description: 'Pellicle mesh chairs, motorized standing desks, storage cabinets & commercial office surplus from Herman Miller & Steelcase.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700',
      count: categoryCounts ? (categoryCounts['furniture'] ?? 0) : 0
    },
    {
      id: 'health_beauty',
      name: 'Health, Beauty & Personal Care',
      description: 'Sonic pressure toothbrushes, grooming equipment, wellness kits & personal care surplus from Oral-B & Philips Sonicare.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700',
      count: categoryCounts ? (categoryCounts['health_beauty'] ?? 0) : 0
    },
    {
      id: 'pets',
      name: 'Pet Supplies & Smart Cameras',
      description: 'Deshedding gloves, enrichment toys, smart treat-tossing cameras & grooming tools for dogs and cats.',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700',
      count: categoryCounts ? (categoryCounts['pets'] ?? 0) : 0
    },
    {
      id: 'pallets',
      name: 'Wholesale & Mystery Pallets',
      description: 'Full shrink-wrapped liquidation pallets, electronics overstock lots & manifests for eBay/Amazon resellers and stores.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700',
      count: categoryCounts ? (categoryCounts['pallets'] ?? 0) : 0
    },
    {
      id: 'apparel',
      name: 'Apparel & Workwear Footwear',
      description: 'CSA safety work boots, contractor jackets, outdoor apparel & footwear surplus from Timberland PRO, Carhartt & Nike.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
      count: categoryCounts ? (categoryCounts['apparel'] ?? 0) : 0
    },
    {
      id: 'outdoor',
      name: 'Sports, Patio & Outdoor',
      description: 'Heavy camping gear, portable power stations, patio heaters & sports surplus from top outdoor brands.',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700',
      count: categoryCounts ? (categoryCounts['outdoor'] ?? 0) : 0
    }
  ];

  return (
    <div className="categories-page-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Departments &amp; Categories</span>
        </div>

        {/* Page Header */}
        <div className="categories-header-block">
          <div className="section-eyebrow">
            <Layers size={14} />
            <span>CATALOGUE DIRECTORY</span>
          </div>
          <h1 className="categories-main-title">Browse by Department</h1>
          <p className="categories-subtitle">
            Explore authentic retail surplus across 8 core liquidation categories. Every asset is inspected at our Scarborough depot with same-day local pickup and fast delivery.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-overview-grid">
          {categoryDetails.map((cat) => (
            <div
              key={cat.id}
              className="category-overview-card"
              onClick={() => navigate(`/collections/${cat.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="category-overview-img-wrap">
                <img src={cat.image} alt={cat.name} className="category-overview-img" />
                <span className="category-count-badge">{cat.count} Lots</span>
              </div>
              <div className="category-overview-body">
                <h3 className="category-overview-title">{cat.name}</h3>
                <p className="category-overview-desc">{cat.description}</p>
                <div className="category-overview-cta">
                  <span>Explore Lots</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deal & Drop Alerts Block */}
        <div className="category-drop-alert-banner">
          <div className="flex items-center gap-4">
            <div className="drop-alert-icon-box">
              <Sparkles size={28} />
            </div>
            <div>
              <h3>Want early access to specific department drops?</h3>
              <p>Set personalized drop alerts and be the first to know when new tier-1 lots land in Scarborough.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsDropAlertOpen(true)}
          >
            <Mail size={16} />
            <span>Set Drop Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
