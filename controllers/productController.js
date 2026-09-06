import { Product } from '../models/Product.js';

// @desc    Get all products with filters, sorting, and search
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, condition, search, sortBy, priceMax, eventId, inStockOnly } = req.query;

    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (condition && condition !== 'all') {
      const conditionsArray = condition.split(',');
      query.condition = { $in: conditionsArray };
    }

    if (eventId && eventId !== 'evt-all') {
      query.eventId = eventId;
    }

    if (inStockOnly === 'true') {
      query.stockQty = { $gt: 0 };
    }

    if (priceMax && !isNaN(priceMax)) {
      query.price = { $lte: Number(priceMax) };
    }

    if (search && search.trim().length > 0) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { sku: searchRegex },
        { description: searchRegex },
        { conditionNotes: searchRegex },
        { warehouseLocation: searchRegex },
        { category: searchRegex }
      ];
    }

    let sortOptions = { createdAt: -1 };

    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'newly_added') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'stock') {
      sortOptions = { stockQty: -1 };
    } else if (sortBy === 'sales') {
      sortOptions = { salesCount: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    // Compute catalog statistics
    const totalCount = products.length;
    const totalRetailValue = products.reduce((acc, p) => acc + (p.retailMSRP || p.price), 0);
    const totalStoreValue = products.reduce((acc, p) => acc + p.price, 0);
    const totalSavings = Math.max(0, totalRetailValue - totalStoreValue);
    const inStockUnits = products.reduce((acc, p) => acc + p.stockQty, 0);

    res.json({
      success: true,
      count: totalCount,
      stats: {
        totalCount,
        totalRetailValue,
        totalStoreValue,
        totalSavings,
        inStockUnits
      },
      data: products
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create single product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    1-Click Bulk Upload Product Manifest into MongoDB
// @route   POST /api/products/bulk
export const bulkUploadProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, error: 'Products array is required' });
    }

    const cleanProducts = products.map((item, idx) => ({
      sku: item.sku || `SKU-${Date.now().toString().slice(-4)}-${idx + 1}`,
      title: item.title || 'Liquidation Item',
      category: item.category || 'general',
      condition: item.condition || 'Brand New',
      conditionNotes: item.conditionNotes || 'Inspected and verified',
      price: Number(item.price) || 0,
      retailMSRP: Number(item.retailMSRP) || Number(item.price) || 0,
      stockQty: Number(item.stockQty) || 1,
      warehouseLocation: item.warehouseLocation || 'Bay 4',
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&auto=format&fit=crop&q=60']),
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags : []
    }));

    const inserted = await Product.insertMany(cleanProducts, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${inserted.length} items to MongoDB`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    console.error('bulkUploadProducts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted from database' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Clear entire product inventory in MongoDB
// @route   DELETE /api/products/clear
export const clearAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({
      success: true,
      message: `Cleared all ${result.deletedCount} products from database`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Toggle or set 2-hour flash hold on a product
// @route   POST /api/products/:id/hold
export const holdProduct = async (req, res) => {
  try {
    const { durationMinutes = 120, user } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const now = new Date();
    const isCurrentlyHeld = product.holdUntil && new Date(product.holdUntil) > now;
    const isSameHolder = !product.heldBy?.email || (user?.email && product.heldBy.email.toLowerCase() === user.email.toLowerCase());
    const isAdminUser = user?.role === 'admin' || user?.email === 'gamot0105@gmail.com' || req.user?.role === 'admin';

    // If already held and not expired and not held by this user and not admin
    if (isCurrentlyHeld && !isSameHolder && !isAdminUser) {
      return res.status(409).json({
        success: false,
        error: 'This lot is currently on hold by another buyer. Please check back shortly.'
      });
    }

    // Set hold expiry
    const holdUntil = new Date(now.getTime() + durationMinutes * 60 * 1000);
    product.holdUntil = holdUntil;
    product.heldBy = user || { name: 'Verified Buyer' };
    await product.save();

    res.json({
      success: true,
      message: `Lot held for ${durationMinutes} minutes!`,
      data: product,
      holdUntil
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

