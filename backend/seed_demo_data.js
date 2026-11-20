import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Offer } from './models/Offer.js';
import { Subscriber } from './models/Subscriber.js';
import { Settings } from './models/Settings.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_universe';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  // 1. Setup Admin Accounts
  console.log('\n--- SETTING UP ADMIN ACCOUNTS ---');
  // Hash password directly to ensure 100% guarantee
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);
  const strictHash = await bcrypt.hash('ApexxVault@2026!Admin', salt);

  // Remove existing admins if any to avoid hash mismatch
  await User.deleteMany({ email: { $in: ['admin@apexxvault.com', 'gamot0105@gmail.com'] } });

  // Create primary admin (admin@apexxvault.com)
  const primaryAdmin = await User.create({
    firstName: 'ApexxVault',
    lastName: 'Administrator',
    email: 'admin@apexxvault.com',
    phone: '+1 (416) 571-6702',
    street: '705 Progress Ave #32',
    city: 'Scarborough',
    province: 'Ontario',
    postalCode: 'M1H 2X1',
    password: 'Password123!',
    role: 'admin'
  });
  console.log('Created Admin 1:', primaryAdmin.email, 'password: Password123!');

  // Create secondary admin (gamot0105@gmail.com)
  const secondaryAdmin = await User.create({
    firstName: 'Store',
    lastName: 'Owner',
    email: 'gamot0105@gmail.com',
    phone: '+1 (416) 571-6702',
    street: '705 Progress Ave #32',
    city: 'Scarborough',
    province: 'Ontario',
    postalCode: 'M1H 2X1',
    password: 'Password123!',
    role: 'admin'
  });
  console.log('Created Admin 2:', secondaryAdmin.email, 'password: Password123!');

  // Verify comparePassword works
  const match1 = await primaryAdmin.comparePassword('Password123!');
  console.log('Verified Admin 1 login test:', match1 ? 'PASS ✅' : 'FAIL ❌');

  // Also create a sample customer user
  await User.deleteMany({ email: 'customer@example.com' });
  const demoCustomer = await User.create({
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'customer@example.com',
    phone: '+1 (416) 882-9401',
    street: '1240 Ellesmere Rd',
    city: 'Scarborough',
    province: 'Ontario',
    postalCode: 'M1P 2X4',
    password: 'Password123!',
    role: 'customer'
  });
  console.log('Created Sample Customer:', demoCustomer.email, 'password: Password123!');

  // 2. Setup Store Settings
  console.log('\n--- SETTING UP STORE SETTINGS ---');
  await Settings.deleteMany({});
  await Settings.create({
    business: {
      name: 'ApexxVault Liquidation Depot',
      tagline: 'Ontario Premier Tier-1 Liquidation & Surplus Wholesale Hub',
      phone: '+1 (416) 571-6702',
      email: 'support@apexxvault.com',
      address: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
      hours: 'Mon – Sat: 11:00 AM – 6:00 PM | Sun: 11:00 AM – 5:00 PM',
      taxRate: 0.13,
      currency: 'CAD'
    },
    privacyPolicy: 'ApexxVault complies fully with the Canadian Personal Information Protection and Electronic Documents Act (PIPEDA). We collect customer contact data solely for pickup notifications, invoices, and warehouse security verifications. We never sell or distribute your private information to third parties.',
    termsOfService: 'All lots listed on ApexxVault are commercial overstock, retail customer returns, open-box items, or surplus assets. Purchases are subject to our 48-hour pickup reservation window at 705 Progress Ave #32, Scarborough. Prices are quoted in Canadian Dollars (CAD) and subject to 13% Ontario HST.',
    asIsAgreement: 'Unless explicitly marked as "Brand New (Sealed)", all liquidation merchandise is sold strictly on an AS-IS basis. Buyers are encouraged to inspect open-box and customer-return goods on our dedicated testing bench prior to loading.',
    pickupPolicy: 'Orders must be picked up within 48 hours of reservation at Unit #32, 705 Progress Ave, Scarborough. Please present your digital order confirmation barcode and matching photo ID. Free loading dock and on-site customer parking provided.'
  });
  console.log('Store settings initialized.');

  // 3. Populate Rich Catalog Products
  console.log('\n--- SEEDING CATALOG INVENTORY ---');
  await Product.deleteMany({});

  const sampleProducts = [
    {
      title: 'DeWalt 20V Max Brushless Cordless Drill & Impact Driver Combo Kit',
      brand: 'DeWalt',
      modelNumber: 'DCK280C2',
      sku: 'SKU-DW-201',
      category: 'tools',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed retail box. Includes two 20V batteries, charger, and contractor carrying bag.',
      price: 169.99,
      retailMSRP: 299.99,
      costPrice: 85.0,
      stockQty: 3,
      warehouseLocation: 'Bay A-01',
      barcode: '885911245601',
      images: [
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800'
      ],
      description: 'Compact and ergonomic lightweight design. High-speed transmission delivers 2 speeds (0-450 & 1,500 rpm) for a range of fastening and drilling applications.',
      supplier: 'Home Depot Overstock Liquidation'
    },
    {
      title: 'Apple iPad Pro 11-inch M4 OLED 256GB Wi-Fi Space Black',
      brand: 'Apple',
      modelNumber: 'MVX23LL/A',
      sku: 'SKU-AP-1104',
      category: 'electronics',
      condition: 'Appears New',
      conditionNotes: 'Store shelf pull. Pristine condition with factory screen wrap intact. Verified 100% battery health.',
      price: 949.99,
      retailMSRP: 1399.0,
      costPrice: 650.0,
      stockQty: 2,
      warehouseLocation: 'Bay B-04',
      barcode: '195949123456',
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800'
      ],
      description: 'Ultra Retina XDR display with groundbreaking tandem OLED technology. Phenomenal performance and game-changing graphics with the Apple M4 chip.',
      supplier: 'Best Buy Return Tech Pallet'
    },
    {
      title: 'Dyson V15 Detect Cordless Vacuum with Fluffy Optic Head',
      brand: 'Dyson',
      modelNumber: '368340-01',
      sku: 'SKU-DY-515',
      category: 'appliances',
      condition: 'Open Box',
      conditionNotes: 'Inspected and power-tested at Scarborough depot. Fully functional with all 7 accessories and wall dock.',
      price: 549.99,
      retailMSRP: 999.99,
      costPrice: 280.0,
      stockQty: 2,
      warehouseLocation: 'Bay C-02',
      barcode: '885609024012',
      images: [
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'
      ],
      description: 'Laser reveals invisible dust on hard floors. Piezo sensor continuously sizes and counts dust particles, automatically increasing suction power when needed.',
      supplier: 'Canadian Tire Surplus Overstock'
    },
    {
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones Silver',
      brand: 'Sony',
      modelNumber: 'WH1000XM5/S',
      sku: 'SKU-SN-1005',
      category: 'electronics',
      condition: 'Brand New',
      conditionNotes: 'Sealed manufacturer box with original barcode. 30-hour battery life with fast charging.',
      price: 299.99,
      retailMSRP: 549.99,
      costPrice: 160.0,
      stockQty: 3,
      warehouseLocation: 'Bay B-02',
      barcode: '027242923720',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ],
      description: 'Industry-leading noise cancellation optimized automatically based on your wearing conditions and environment.',
      supplier: 'Target Liquidations Canada'
    },
    {
      title: 'Milwaukee M18 FUEL Deep Cut Dual-Trigger Band Saw',
      brand: 'Milwaukee',
      modelNumber: '2729-20',
      sku: 'SKU-MW-1829',
      category: 'tools',
      condition: 'Appears New',
      conditionNotes: 'Display unit. Zero cuts made, blade clean and sharp. Includes hanging hook and shoe guide.',
      price: 289.99,
      retailMSRP: 499.0,
      costPrice: 140.0,
      stockQty: 1,
      warehouseLocation: 'Bay A-03',
      barcode: '045242358901',
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
      ],
      description: 'POWERSTATE Brushless Motor cuts faster than corded counterparts. 5-inch by 5-inch cut capacity handles rectangular and round stock.',
      supplier: 'Contractor Consignment Surplus'
    },
    {
      title: 'Herman Miller Aeron Ergonomic Office Chair Size B Graphite',
      brand: 'Herman Miller',
      modelNumber: 'AER-SZB-GR',
      sku: 'SKU-HM-8802',
      category: 'furniture',
      condition: 'Open Box',
      conditionNotes: 'Corporate tech office surplus. Fully functional posturefit SL lumbar support and forward tilt lock.',
      price: 799.99,
      retailMSRP: 1895.0,
      costPrice: 380.0,
      stockQty: 2,
      warehouseLocation: 'Bay E-01',
      barcode: '700123984512',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
      ],
      description: 'Pellicle 8Z breathable suspension seat and back creates eight zones of varying tension for optimal spinal support.',
      supplier: 'Downtown Toronto Corporate Liquidation'
    },
    {
      title: 'Ninja DualZone 8-Quart 2-Basket Air Fryer XL',
      brand: 'Ninja',
      modelNumber: 'DZ201',
      sku: 'SKU-NJ-802',
      category: 'appliances',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed. 2 independent baskets let you cook 2 foods, 2 ways, at the same time.',
      price: 119.99,
      retailMSRP: 229.99,
      costPrice: 55.0,
      stockQty: 3,
      warehouseLocation: 'Bay C-01',
      barcode: '622356562019',
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'
      ],
      description: 'Match Cook feature easily copies settings across zones for full 8-qt capacity meals. 6 cooking programs.',
      supplier: 'Walmart Overstock Lot'
    },
    {
      title: 'Oral-B iO Series 9 Electric Toothbrush with Smart Pressure Sensor',
      brand: 'Oral-B',
      modelNumber: 'iO-900',
      sku: 'SKU-OB-909',
      category: 'health_beauty',
      condition: 'Brand New',
      conditionNotes: 'Sealed package. Includes magnetic charger, Power2Go travel case, and 2 replacement heads.',
      price: 149.99,
      retailMSRP: 349.99,
      costPrice: 70.0,
      stockQty: 3,
      warehouseLocation: 'Bay D-01',
      barcode: '069055883011',
      images: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
      ],
      description: 'Revolutionary magnetic iO technology combines micro-vibrating bristles with dentist-inspired round brush head.',
      supplier: 'Shoppers Drug Mart Wholesale Lot'
    },
    {
      title: 'Method Gel Hand Wash Refill Sweet Water 34oz',
      brand: 'Method',
      modelNumber: 'MTH-SW-34',
      sku: 'SKU-MT-340',
      category: 'health_beauty',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed pouch. Naturally derived gel hand wash refill. PETA certified cruelty-free.',
      price: 8.99,
      retailMSRP: 16.99,
      costPrice: 3.5,
      stockQty: 12,
      warehouseLocation: 'Bay D-05',
      barcode: '817939005432',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'
      ],
      description: 'Biodegradable formula made with plant-based cleaners. Leaves hands clean, soft, and scented with cool sweet water.',
      supplier: 'Target Surplus Personal Care'
    },
    {
      title: 'Paula\'s Choice 2% BHA Liquid Exfoliant & Glycolic Resurfacing Pads',
      brand: 'Paula\'s Choice',
      modelNumber: 'PC-BHA-118',
      sku: 'SKU-PC-118',
      category: 'health_beauty',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed safety wrap. Unclogs & diminishes enlarged pores, smooths wrinkles, and evens skin tone.',
      price: 24.99,
      retailMSRP: 48.0,
      costPrice: 11.0,
      stockQty: 6,
      warehouseLocation: 'Bay D-06',
      barcode: '655439002014',
      images: [
        'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800'
      ],
      description: 'Gentle, leave-on exfoliant that unclogs pores, clears breakouts, and brightens dull skin texture without abrasives.',
      supplier: 'Sephora Shelf Pull Liquidation'
    },
    {
      title: 'French Hair Claw Clip Non-Slip Strong Hold 4-Pack',
      brand: 'ApexxVault Apparel',
      modelNumber: 'HC-CLAW-04',
      sku: 'SKU-HC-404',
      category: 'apparel',
      condition: 'Brand New',
      conditionNotes: 'Brand new in package. Matte finish strong-spring non-slip claw clips for all hair types.',
      price: 9.99,
      retailMSRP: 22.0,
      costPrice: 2.8,
      stockQty: 15,
      warehouseLocation: 'Bay D-07',
      barcode: '741258963012',
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800'
      ],
      description: 'Durable acrylic resin with soft rubberized coating. Powerful interlocking teeth hold thick or fine hair securely in place.',
      supplier: 'Nordstrom Overstock Lot'
    },
    {
      title: 'Pet Grooming Deshedding Glove & Gentle Brush Set',
      brand: 'ApexxVault Pets',
      modelNumber: 'PET-GLV-02',
      sku: 'SKU-PET-201',
      category: 'pets',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed package. Includes 1 pair breathable silicone grooming gloves and double-sided pin/bristle brush.',
      price: 12.99,
      retailMSRP: 28.0,
      costPrice: 4.0,
      stockQty: 8,
      warehouseLocation: 'Bay G-01',
      barcode: '852963741012',
      images: [
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800'
      ],
      description: '255 enhanced silicone grooming tips mimic the gentle touch of your hand for a relaxing massage while capturing loose shedding hair.',
      supplier: 'Petco Surplus Inventory'
    },
    {
      title: 'Furbo 360° Smart Dog Camera with Treat Tossing & Two-Way Audio',
      brand: 'Furbo',
      modelNumber: 'F360-WHT',
      sku: 'SKU-FB-360',
      category: 'pets',
      condition: 'Appears New',
      conditionNotes: 'Open box return verified at Scarborough depot. Full rotating 360 view, night vision, and Wi-Fi tested.',
      price: 119.99,
      retailMSRP: 249.0,
      costPrice: 55.0,
      stockQty: 2,
      warehouseLocation: 'Bay G-02',
      barcode: '850014234012',
      images: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'
      ],
      description: '360-degree rotating wide-angle view in full 1080p HD. Toss treats to your dog remotely via free phone app with real-time barking alerts.',
      supplier: 'Amazon Return Tech Pallet'
    },
    {
      title: 'Coleman Sundome 4-Person WeatherTec Camping Tent',
      brand: 'Coleman',
      modelNumber: '2000024582',
      sku: 'SKU-CL-400',
      category: 'outdoor',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed storage carry bag. WeatherTec system with patented welded floors and inverted seams.',
      price: 69.99,
      retailMSRP: 139.99,
      costPrice: 32.0,
      stockQty: 3,
      warehouseLocation: 'Bay F-02',
      barcode: '076501064012',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
      ],
      description: 'Quick 10-minute setup with snag-free continuous pole sleeves. Ground vent and large windows push warm air up and out for comfort.',
      supplier: 'Canadian Tire Outdoor Liquidation'
    },
    {
      title: 'Timberland PRO Men 6-Inch Pit Boss Steel Toe Work Boots Size 10.5',
      brand: 'Timberland PRO',
      modelNumber: 'TB033034001',
      sku: 'SKU-TB-606',
      category: 'apparel',
      condition: 'Brand New',
      conditionNotes: 'Brand new in original retail box with CSA Green Triangle safety certification tags.',
      price: 109.99,
      retailMSRP: 189.99,
      costPrice: 50.0,
      stockQty: 2,
      warehouseLocation: 'Bay D-03',
      barcode: '042283019283',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
      ],
      description: 'Rugged nubuck leather with slip-, oil-, and abrasion-resistant rubber outsole for heavy job site safety.',
      supplier: 'Marks Work Wearhouse Consignment'
    },
    {
      title: 'Full Pallet of Mixed Grade-A Tier 1 Electronics & Tech Overstock (42 Units)',
      brand: 'Wholesale Pallet Lot',
      modelNumber: 'PAL-TOR-42',
      sku: 'SKU-PAL-042',
      category: 'pallets',
      condition: 'Appears New',
      conditionNotes: 'Shrink-wrapped wholesale pallet. Manifest includes 42 units of tablets, wireless earbuds, smart plugs, and power stations.',
      price: 1499.0,
      retailMSRP: 5490.0,
      costPrice: 900.0,
      stockQty: 1,
      warehouseLocation: 'Rack P-01',
      barcode: 'PAL42TOR2026',
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
      ],
      description: 'High-manifest liquidation pallet ideal for eBay/Amazon resellers, flea market vendors, or retail liquidators. Detailed manifest available upon pickup.',
      supplier: 'Amazon Fulfillment Logistics Ontario'
    },
    {
      title: 'Bosch 12-Inch Dual-Bevel Glide Compact Miter Saw',
      brand: 'Bosch',
      modelNumber: 'GCM12SD',
      sku: 'SKU-BS-1201',
      category: 'tools',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed retail carton. Axial-Glide system offers wider cross-cuts and smooth alignment.',
      price: 529.99,
      retailMSRP: 899.99,
      costPrice: 280.0,
      stockQty: 2,
      warehouseLocation: 'Bay A-04',
      barcode: '000346432014',
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
      description: 'Axial-Glide system for durable precision. Up-front bevel controls with all-metal bevel lock lever and range selector.',
      supplier: 'Lowe Canada Store Closure Surplus'
    },
    {
      title: 'Samsung 34-Inch Odyssey OLED G8 Curved Gaming Monitor WQHD 175Hz',
      brand: 'Samsung',
      modelNumber: 'LS34BG850SNXZA',
      sku: 'SKU-SM-3408',
      category: 'electronics',
      condition: 'Open Box',
      conditionNotes: 'Power-tested, zero dead pixels. Includes Neo Quantum Processor, remote control, and VESA mount adapter.',
      price: 799.99,
      retailMSRP: 1499.99,
      costPrice: 450.0,
      stockQty: 2,
      warehouseLocation: 'Bay B-03',
      barcode: '887276689012',
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
      description: 'Mesmerizing OLED display with Neo Quantum Processor. Ultra-fast 0.03ms response time and 175Hz refresh rate for fluid gameplay.',
      supplier: 'Best Buy Surplus Pallet'
    },
    {
      title: 'Breville the Barista Touch Espresso Machine Stainless Steel',
      brand: 'Breville',
      modelNumber: 'BES880BSS',
      sku: 'SKU-BV-880',
      category: 'appliances',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed manufacturer packaging. Automated touchscreen operation, ThermoJet 3-second heating system.',
      price: 849.99,
      retailMSRP: 1499.95,
      costPrice: 420.0,
      stockQty: 3,
      warehouseLocation: 'Bay C-03',
      barcode: '021614056012',
      images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'],
      description: 'Automated touch screen technology allows you to easily swipe and select from classic café favorites. Integrated conical burr grinder.',
      supplier: 'Hudson Bay Liquidation Depot'
    },
    {
      title: 'Steelcase Gesture Ergonomic Office Chair with 360-Degree Arms',
      brand: 'Steelcase',
      modelNumber: 'GEST-BK-360',
      sku: 'SKU-SC-901',
      category: 'furniture',
      condition: 'Appears New',
      conditionNotes: 'Surplus corporate contract pull. Pristine condition with full 3D LiveBack contour and adjustable pneumatic lift.',
      price: 749.99,
      retailMSRP: 1680.0,
      costPrice: 340.0,
      stockQty: 2,
      warehouseLocation: 'Bay E-02',
      barcode: '792014882012',
      images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
      description: 'Designed to support user interaction with today smartphone, tablet, and multi-monitor setups. Core Equalizer lumbar support.',
      supplier: 'Commercial Tech Surplus Toronto'
    },
    {
      title: 'Philips Sonicare DiamondClean 9000 Connected Rechargeable Toothbrush',
      brand: 'Philips Sonicare',
      modelNumber: 'HX9914/54',
      sku: 'SKU-PS-9000',
      category: 'health_beauty',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed double pack with charging glass, USB travel case, and 4 C3 Premium Plaque Control brush heads.',
      price: 189.99,
      retailMSRP: 349.99,
      costPrice: 80.0,
      stockQty: 4,
      warehouseLocation: 'Bay D-02',
      barcode: '075020088019',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
      description: 'Removes up to 10x more plaque than a manual toothbrush. Built-in pressure sensor alerts you when brushing too hard.',
      supplier: 'Costco Wholesale Canada Overstock'
    },
    {
      title: 'Carhartt Men Loose Fit Firm Duck Insulated Flannel-Lined Active Jacket',
      brand: 'Carhartt',
      modelNumber: 'J140-BLK',
      sku: 'SKU-CH-140',
      category: 'apparel',
      condition: 'Brand New',
      conditionNotes: 'Original tags attached. Heavyweight 12-ounce 100% ring-spun cotton duck with quilted flannel body lining.',
      price: 89.99,
      retailMSRP: 159.99,
      costPrice: 42.0,
      stockQty: 3,
      warehouseLocation: 'Bay D-04',
      barcode: '035442189012',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800'],
      description: 'Legendary Carhartt durability with 3M Thinsulate insulation. Wind-resistant and water-repellent.',
      supplier: 'Retail Surplus Marks'
    },
    {
      title: 'EcoFlow DELTA 2 Portable Power Station 1024Wh LFP Battery',
      brand: 'EcoFlow',
      modelNumber: 'ZMD330-US',
      sku: 'SKU-EF-1024',
      category: 'outdoor',
      condition: 'Brand New',
      conditionNotes: 'Factory sealed box. 1800W AC output with X-Boost up to 2200W. 3000+ cycle LiFePO4 battery life.',
      price: 649.99,
      retailMSRP: 1299.0,
      costPrice: 350.0,
      stockQty: 2,
      warehouseLocation: 'Bay F-01',
      barcode: '842783109012',
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
      description: 'Fast AC recharge from 0-80% in 50 minutes. Powers 90% of home appliances during emergencies or outdoor camping.',
      supplier: 'Commercial Emergency Surplus'
    },
    {
      title: 'Pallet of Small Kitchen Appliances & Home Goods Surplus (58 Units)',
      brand: 'Wholesale Pallet Lot',
      modelNumber: 'PAL-KIT-58',
      sku: 'SKU-PAL-058',
      category: 'pallets',
      condition: 'Appears New',
      conditionNotes: 'Shrink-wrapped manifest of 58 small appliances including air fryers, blenders, toasters, and coffee makers.',
      price: 1199.0,
      retailMSRP: 4890.0,
      costPrice: 650.0,
      stockQty: 1,
      warehouseLocation: 'Rack P-02',
      barcode: 'PAL58TOR2026',
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
      description: 'High-manifest small appliance pallet ready for resale. Full itemized manifest provided with pickup release.',
      supplier: 'Home Depot Logistics Surplus'
    }
  ];

  for (const p of sampleProducts) {
    await Product.create(p);
  }
  console.log(`Successfully seeded ${sampleProducts.length} high-margin catalog assets!`);

  // 4. Populate Realistic Orders
  console.log('\n--- SEEDING SAMPLE ORDERS ---');
  await Order.deleteMany({});

  const sampleOrders = [
    {
      orderId: 'ORD-88201',
      pickupCode: 'PK-4921',
      date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      items: [
        {
          product: {
            title: 'DeWalt 20V Max Brushless Cordless Drill & Impact Driver Combo Kit',
            sku: 'SKU-DW-201',
            price: 169.99,
            retailMSRP: 299.99,
            condition: 'Brand New',
            warehouseLocation: 'Bay A-01'
          },
          quantity: 1,
          price: 169.99
        }
      ],
      subtotal: 169.99,
      tax: 22.1,
      grandTotal: 192.09,
      totalSavings: 130.0,
      pickupLocation: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
      paymentMethod: 'Direct Message (DM) / Reserve',
      status: 'Paid',
      customer: {
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.rostova@gmail.com',
        phone: '+1 (416) 431-8890',
        street: '88 Corporate Dr',
        city: 'Scarborough',
        province: 'Ontario',
        postalCode: 'M1H 3G6'
      }
    },
    {
      orderId: 'ORD-88202',
      pickupCode: 'PK-7734',
      date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      items: [
        {
          product: {
            title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones Silver',
            sku: 'SKU-SN-1005',
            price: 299.99,
            retailMSRP: 549.99,
            condition: 'Brand New',
            warehouseLocation: 'Bay B-02'
          },
          quantity: 1,
          price: 299.99
        }
      ],
      subtotal: 299.99,
      tax: 39.0,
      grandTotal: 338.99,
      totalSavings: 250.0,
      pickupLocation: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
      paymentMethod: 'Direct Message (DM) / Reserve',
      status: 'Ready for Pickup',
      customer: {
        firstName: 'Tariq',
        lastName: 'Al-Mansoor',
        email: 'tariq.mansoor@rogers.com',
        phone: '+1 (416) 902-3341',
        street: '1420 Markham Rd',
        city: 'Scarborough',
        province: 'Ontario',
        postalCode: 'M1B 2V9'
      }
    },
    {
      orderId: 'ORD-88203',
      pickupCode: 'PK-1029',
      date: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      items: [
        {
          product: {
            title: 'Dyson V15 Detect Cordless Vacuum with Fluffy Optic Head',
            sku: 'SKU-DY-515',
            price: 549.99,
            retailMSRP: 999.99,
            condition: 'Open Box',
            warehouseLocation: 'Bay C-02'
          },
          quantity: 1,
          price: 549.99
        }
      ],
      subtotal: 549.99,
      tax: 71.5,
      grandTotal: 621.49,
      totalSavings: 450.0,
      pickupLocation: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
      paymentMethod: 'Direct Message (DM) / Reserve',
      status: 'Picked Up',
      customer: {
        firstName: 'Liam',
        lastName: 'O’Connor',
        email: 'liam.oc@outlook.com',
        phone: '+1 (416) 712-4455',
        street: '3300 Lawrence Ave E',
        city: 'Scarborough',
        province: 'Ontario',
        postalCode: 'M1H 1A6'
      }
    }
  ];

  for (const o of sampleOrders) {
    await Order.create(o);
  }
  console.log(`Seeded ${sampleOrders.length} realistic customer orders.`);

  // 5. Populate Offers
  console.log('\n--- SEEDING SAMPLE OFFERS ---');
  await Offer.deleteMany({});
  await Offer.create({
    productId: 'SKU-DW-201',
    productTitle: 'DeWalt 20V Max Brushless Cordless Drill & Impact Driver Combo Kit',
    sku: 'SKU-DW-201',
    liquidationPrice: 169.99,
    offeredPrice: 145.0,
    quantity: 1,
    status: 'Pending',
    note: 'Can come pick up today at Scarborough depot with cash if accepted.',
    customer: {
      name: 'Samir Patel',
      phone: '+1 (416) 555-0192',
      email: 'samir.patel@gmail.com'
    }
  });

  await Offer.create({
    productId: 'SKU-HM-8802',
    productTitle: 'Herman Miller Aeron Ergonomic Office Chair Size B Graphite',
    sku: 'SKU-HM-8802',
    liquidationPrice: 799.99,
    offeredPrice: 700.0,
    quantity: 2,
    status: 'Countered',
    counterPrice: 750.0,
    note: 'Looking to purchase 2 chairs for our home office.',
    customer: {
      name: 'Jessica Wong',
      phone: '+1 (416) 555-8821',
      email: 'jess.wong@techcorp.ca'
    }
  });
  console.log('Seeded sample buyer offers.');

  // 6. Populate Subscribers
  console.log('\n--- SEEDING DROP LEADS ---');
  await Subscriber.deleteMany({});
  await Subscriber.create({
    phone: '+14165551234',
    email: 'localbuyer@gmail.com',
    channel: 'whatsapp',
    department: 'tools'
  });
  await Subscriber.create({
    phone: '+14165559876',
    email: 'reseller.ontario@gmail.com',
    channel: 'sms',
    department: 'pallets'
  });
  console.log('Seeded VIP restock leads.');

  console.log('\n======================================================');
  console.log('🎉 SEEDING COMPLETE! ALL SYSTEMS OPERATIONAL!');
  console.log('ADMIN LOGIN: admin@apexxvault.com OR gamot0105@gmail.com');
  console.log('PASSWORD   : Password123!');
  console.log('======================================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
