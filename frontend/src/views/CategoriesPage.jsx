import React from 'react';
import { Layers, ChevronRight, Sparkles, ArrowRight, PackageCheck, Mail } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuction } from '../context/AuctionContext';
import { CATEGORIES } from '../data/auctionEvents';

export const CategoriesPage = () => {
  const { navigate } = useRouter();
  const { products, setIsDropAlertOpen } = useAuction();

  const categoryDetails = [
    {
      id: 'tools',
      name: 'Power Tools & Hardware',
      description: 'Contractor drills, impact drivers, table saws, combo toolkits & accessories from DeWalt, Milwaukee, Makita & Bosch.',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700',
      count: products.filter(p => p.category === 'tools').length || 24
    },
    {
      id: 'electronics',
      name: 'Consumer Electronics & Audio',
      description: 'OLED tablets, noise-canceling headphones, smart monitors, laptops & gaming gear from Apple, Sony, Samsung & Dyson.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
      count: products.filter(p => p.category === 'electronics').length || 32
    },
    {
      id: 'appliances',
      name: 'Kitchen & Home Appliances',
      description: 'Air fryers, multicookers, robot vacuums, blenders & coffee machines from Ninja, Dyson, Instant Pot & Philips.',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=700',
      count: products.filter(p => p.category === 'appliances').length || 18
    },
    {
      id: 'furniture',
      name: 'Ergonomic Office & Living',
      description: 'Pellicle mesh chairs, motorized standing desks, storage cabinets & commercial office surplus from Herman Miller & Steelcase.',
      image: 'https://images.unsplash.com/photo-1580481077195-cabb094ef400?w=700',
      count: products.filter(p => p.category === 'furniture').length || 10
    },
    {
      id: 'health_beauty',
      name: 'Health, Beauty & Personal Care',
      description: 'Sonic pressure toothbrushes, grooming equipment, wellness kits & personal care surplus from Oral-B & Philips Sonicare.',
      image: 'https://images.unsplash.com/photo-1559591937-e102202b21a8?w=700',
      count: products.filter(p => p.category === 'health_beauty').length || 22
    },
    {
      id: 'pallets',
      name: 'Wholesale & Mystery Pallets',
      description: 'Full shrink-wrapped liquidation pallets, electronics overstock lots & manifests for eBay/Amazon resellers and stores.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700',
      count: products.filter(p => p.category === 'pallets').length || 6
    },
    {
      id: 'apparel',
      name: 'Apparel & Workwear Footwear',
      description: 'CSA safety work boots, contractor jackets, outdoor apparel & footwear surplus from Timberland PRO, Carhartt & Nike.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
      count: products.filter(p => p.category === 'apparel').length || 8
    },
    {
      id: 'outdoor',
      name: 'Sports, Patio & Outdoor',
      description: 'Heavy camping gear, portable power stations, patio heaters & sports surplus from top outdoor brands.',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700',
      count: products.filter(p => p.category === 'outdoor').length || 9
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
