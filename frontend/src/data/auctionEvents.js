export const AUCTION_EVENTS = [
  {
    id: 'evt-all',
    name: 'All ApexxVault Asset Hubs',
    code: 'ALL',
    location: 'All Distribution Centers',
    totalLots: 124,
    status: 'ACTIVE',
    badge: 'Live Now',
    endsInHours: 4,
    bannerImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    description: 'Browse all lots currently available across our regional liquidation hubs.'
  },
  {
    id: 'evt-402',
    name: 'Central Warehouse Overstock',
    code: 'WHL-402',
    location: 'Bay 4 — Toronto Logistics Central',
    totalLots: 56,
    status: 'ACTIVE',
    badge: 'Active Hub',
    endsInHours: 2,
    bannerImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&auto=format&fit=crop&q=80',
    description: 'Major retailer overstock, consumer electronics, premium power tools, and home appliances.'
  },
  {
    id: 'evt-403',
    name: 'Premium Tech & Audio Vault',
    code: 'TECH-403',
    location: 'Unit #32 — Scarborough Depot (705 Progress Ave #32)',
    totalLots: 42,
    status: 'ACTIVE',
    badge: 'Live Now',
    endsInHours: 8,
    bannerImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    description: 'Tablets, 4K displays, noise-canceling headphones, gaming consoles, and smart home systems.'
  },
  {
    id: 'evt-404',
    name: 'Industrial Pallets & Heavy Lots',
    code: 'PLT-404',
    location: 'Dock 7 — Brampton Depot',
    totalLots: 26,
    status: 'ACTIVE',
    badge: 'Wholesale Depot',
    endsInHours: 24,
    bannerImage: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&auto=format&fit=crop&q=80',
    description: 'Full uninspected liquidation pallets, contractor tool chests, industrial generators, and heavy equipment.'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid', count: 124 },
  { id: 'electronics', name: 'Consumer Electronics', icon: 'Smartphone', count: 38 },
  { id: 'tools', name: 'Power Tools & Hardware', icon: 'Hammer', count: 29 },
  { id: 'appliances', name: 'Home & Kitchen Appliances', icon: 'Coffee', count: 24 },
  { id: 'pallets', name: 'Wholesale & Mystery Pallets', icon: 'Boxes', count: 12 },
  { id: 'outdoor', name: 'Sports, Patio & Outdoor', icon: 'Tent', count: 11 },
  { id: 'furniture', name: 'Furniture & Living', icon: 'Armchair', count: 10 }
];

export const CONDITIONS = [
  {
    id: 'Brand New',
    label: 'Brand New (Sealed)',
    badgeColor: 'brand-new',
    description: 'Factory sealed in original retail box. Zero cosmetic or functional flaws.'
  },
  {
    id: 'Appears New',
    label: 'Appears New (Shelf Pull)',
    badgeColor: 'appears-new',
    description: 'Open packaging inspected by warehouse staff. Unit is pristine with all accessories.'
  },
  {
    id: 'Open Box',
    label: 'Open Box (Inspected)',
    badgeColor: 'open-box',
    description: 'Tested and verified operational. May show minor retail handling or repackaging.'
  },
  {
    id: 'Customer Return',
    label: 'Customer Return (Tested)',
    badgeColor: 'customer-return',
    description: 'Power-tested inventory. May exhibit light signs of prior handling or missing manual.'
  },
  {
    id: 'Salvage / Parts',
    label: 'Salvage / Repair / As-Is',
    badgeColor: 'salvage',
    description: 'Sold 100% strictly as-is for parts, repair, or refurbishment.'
  }
];
