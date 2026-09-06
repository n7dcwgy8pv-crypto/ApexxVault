import Papa from 'papaparse';

/**
 * Common column header synonyms for automatic product manifest mapping
 */
const COLUMN_MAPPINGS = {
  sku: ['sku', 'item #', 'item number', 'lot', 'lot number', 'id', 'product id', 'model #', 'barcode'],
  title: ['title', 'item name', 'name', 'product name', 'description title', 'item title', 'product'],
  category: ['category', 'cat', 'dept', 'department', 'type'],
  condition: ['condition', 'item condition', 'grade', 'status'],
  retailMSRP: ['msrp', 'retail', 'retail price', 'retail msrp', 'est retail', 'est msrp', 'original price', 'val'],
  price: ['price', 'liquidation price', 'sale price', 'buy now price', 'buy now', 'cost', 'store price', 'direct price'],
  stockQty: ['stock', 'qty', 'quantity', 'stock qty', 'units', 'count', 'available'],
  warehouseLocation: ['location', 'bay', 'aisle', 'warehouse location', 'bin location', 'dock', 'pallet'],
  images: ['image', 'image url', 'images', 'image_url', 'photo', 'picture', 'photo url'],
  conditionNotes: ['description', 'condition notes', 'notes', 'inspection notes', 'details', 'comment', 'manifest notes']
};

/**
 * Automatically maps raw CSV header strings to standard field names
 */
export const detectColumnMapping = (headers) => {
  const mapping = {};

  headers.forEach((header) => {
    const cleanHeader = header.trim().toLowerCase().replace(/[^a-z0-9 #_]/g, '');

    for (const [field, synonyms] of Object.entries(COLUMN_MAPPINGS)) {
      if (synonyms.some((syn) => cleanHeader === syn || cleanHeader.includes(syn))) {
        if (!mapping[field]) {
          mapping[field] = header;
          break;
        }
      }
    }
  });

  return mapping;
};

/**
 * Normalizes a condition string to standard supported conditions
 */
export const normalizeCondition = (rawCondition) => {
  if (!rawCondition) return 'Appears New';
  const c = rawCondition.toString().toLowerCase();

  if (c.includes('brand') || c.includes('sealed') || c.includes('factory') || c.includes('new in box') || c.includes('nib')) {
    return 'Brand New';
  }
  if (c.includes('appears') || c.includes('shelf') || c.includes('like new') || c.includes('mint')) {
    return 'Appears New';
  }
  if (c.includes('open') || c.includes('box') || c.includes('inspected') || c.includes('tested')) {
    return 'Open Box';
  }
  if (c.includes('return') || c.includes('customer') || c.includes('used')) {
    return 'Customer Return';
  }
  if (c.includes('salvage') || c.includes('parts') || c.includes('as is') || c.includes('asis') || c.includes('broken')) {
    return 'Salvage / Parts';
  }
  return 'Appears New';
};

/**
 * Normalizes category to internal category keys
 */
export const normalizeCategory = (rawCat) => {
  if (!rawCat) return 'electronics';
  const cat = rawCat.toString().toLowerCase();

  if (cat.includes('elect') || cat.includes('tech') || cat.includes('comput') || cat.includes('phone') || cat.includes('tv') || cat.includes('audio')) {
    return 'electronics';
  }
  if (cat.includes('tool') || cat.includes('hardw') || cat.includes('drill') || cat.includes('saw') || cat.includes('impact')) {
    return 'tools';
  }
  if (cat.includes('appliance') || cat.includes('kitchen') || cat.includes('vacuum') || cat.includes('cook') || cat.includes('grill') || cat.includes('fryer')) {
    return 'appliances';
  }
  if (cat.includes('pallet') || cat.includes('bulk') || cat.includes('skid') || cat.includes('wholesale') || cat.includes('gaylord')) {
    return 'pallets';
  }
  if (cat.includes('outdoor') || cat.includes('sport') || cat.includes('patio') || cat.includes('garden') || cat.includes('scooter')) {
    return 'outdoor';
  }
  if (cat.includes('furn') || cat.includes('chair') || cat.includes('table') || cat.includes('desk') || cat.includes('home')) {
    return 'furniture';
  }
  return 'electronics';
};

/**
 * Parse a CSV file or text with PapaParse
 */
export const parseCsvFile = (fileOrString) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileOrString, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn('CSV Parse Warnings:', results.errors);
        }
        resolve(results);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * Convert parsed rows into clean Product objects
 */
export const processManifestRows = (rows, customMapping = null, defaultEventId = 'evt-402') => {
  if (!rows || !rows.length) return [];

  const headers = Object.keys(rows[0]);
  const mapping = customMapping || detectColumnMapping(headers);

  const defaultImages = [
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
  ];

  return rows
    .filter((row) => {
      const titleVal = mapping.title ? row[mapping.title] : row['Title'] || row['title'] || row['Item Name'];
      const skuVal = mapping.sku ? row[mapping.sku] : row['SKU'] || row['sku'] || row['Lot Number'];
      return (titleVal && titleVal.toString().trim().length > 0) || (skuVal && skuVal.toString().trim().length > 0);
    })
    .map((row, index) => {
      const getVal = (field) => (mapping[field] ? row[mapping[field]] : null);

      const title = (getVal('title') || row['Title'] || row['title'] || `Liquidation Item #${index + 1}`).trim();
      const rawSku = getVal('sku') || row['SKU'] || row['sku'] || `MAN-${600 + index}`;
      const sku = rawSku.toString().trim();

      const rawCondition = getVal('condition') || row['Condition'] || 'Appears New';
      const condition = normalizeCondition(rawCondition);

      const rawCat = getVal('category') || row['Category'] || 'electronics';
      const category = normalizeCategory(rawCat);

      const retailMSRP = parseFloat(String(getVal('retailMSRP') || row['MSRP'] || 0).replace(/[^0-9.]/g, '')) || 99.99;
      const rawPrice = parseFloat(String(getVal('price') || row['Liquidation Price'] || row['Price'] || 0).replace(/[^0-9.]/g, ''));
      const price = rawPrice > 0 ? rawPrice : Math.round(retailMSRP * 0.45);
      const stockQty = parseInt(String(getVal('stockQty') || row['Stock Qty'] || row['Stock'] || 5).replace(/[^0-9]/g, ''), 10) || 5;

      const rawImg = getVal('images') || row['Image URL'] || row['image'];
      let images = [];
      if (rawImg && rawImg.startsWith('http')) {
        images = [rawImg.trim()];
      } else {
        images = [defaultImages[index % defaultImages.length]];
      }

      const conditionNotes = (getVal('conditionNotes') || row['Description'] || row['conditionNotes'] || `Manifest item verified. Condition classified as ${condition}.`).trim();
      const warehouseLocation = (getVal('warehouseLocation') || row['Warehouse Location'] || row['Location'] || `Bay 4 — Pallet M${(index % 15) + 1}`).trim();

      return {
        id: `prod-upload-${Date.now()}-${index}`,
        sku,
        title,
        category,
        condition,
        conditionNotes,
        price,
        retailMSRP,
        stockQty,
        warehouseLocation,
        featured: index === 0 || index % 5 === 0,
        eventId: defaultEventId,
        images,
        specs: {
          'Source': 'Bulk Warehouse Manifest',
          'Condition Tag': condition,
          'SKU / Item #': sku,
          'Estimated Retail': `$${retailMSRP.toFixed(2)}`,
          'Stock Available': `${stockQty} Units`
        },
        salesCount: Math.floor(Math.random() * 20) + 2
      };
    });
};

/**
 * Generate a clean downloadable CSV template for direct product store
 */
export const downloadSampleCsv = () => {
  const headers = ['SKU', 'Title', 'Category', 'Condition', 'Liquidation Price', 'MSRP', 'Stock Qty', 'Warehouse Location', 'Image URL', 'Description'];
  const sampleRows = [
    ['APL-MBA-301', 'Apple MacBook Air 13-inch M3 256GB Midnight', 'electronics', 'Brand New', '949.00', '1449.00', '4', 'Bay 4 - Cage 2', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Factory sealed box with standard 30W USB-C power adapter.'],
    ['MLW-SAW-302', 'Milwaukee M18 FUEL Deep Cut Band Saw Kit', 'tools', 'Appears New', '289.00', '449.00', '6', 'Bay 4 - Aisle 7', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800', 'Tested cutting action. Includes blade and hard carrying case.'],
    ['DLG-ESP-303', 'DeLonghi Magnifica S Automatic Espresso Machine', 'appliances', 'Open Box', '549.00', '899.95', '3', 'Bay 4 - Aisle 3', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800', 'Tested coffee extraction & steam wand. Repacked in retail box.'],
    ['PLT-TECH-304', 'Wholesale Pallet of 40 Return Consumer Electronics & Tech Gadgets', 'pallets', 'Customer Return', '1150.00', '3400.00', '1', 'Dock 7 - Skid 08', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', 'Uninspected mystery skid containing soundbars, tablets, smart plugs, and cables.']
  ];

  const csvContent = Papa.unparse({
    fields: headers,
    data: sampleRows
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'apexxvault_product_manifest_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate and download an itemized manifest CSV for a specific lot or pallet
 */
export const downloadProductManifestCsv = (product) => {
  if (!product) return;
  const headers = [
    'Lot SKU',
    'Asset Title',
    'Category',
    'Condition Grade',
    'Condition Inspection Notes',
    'Liquidation Price (CAD)',
    'Original Retail MSRP (CAD)',
    'Est. Savings ($)',
    'Units In Stock',
    'Warehouse Bay Location',
    'Verification Status'
  ];

  const savings = Math.max(0, (product.retailMSRP || 0) - (product.price || 0));

  const row = [
    product.sku || 'N/A',
    product.title || 'Liquidation Lot',
    product.category || 'General',
    product.condition || 'Open Box',
    product.conditionNotes || 'Inspected and power-tested by warehouse team.',
    (product.price || 0).toFixed(2),
    (product.retailMSRP || product.price || 0).toFixed(2),
    savings.toFixed(2),
    product.stockQty || 1,
    product.warehouseLocation || 'Scarborough Warehouse Bay',
    'Verified 100% Inspected & Tested'
  ];

  const csvContent = Papa.unparse({
    fields: headers,
    data: [row]
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ApexxVault_Manifest_${product.sku || 'Lot'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

