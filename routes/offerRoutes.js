import express from 'express';
import { Offer } from '../models/Offer.js';

const router = express.Router();

// POST /api/offers (Make an Offer submission)
router.post('/', async (req, res) => {
  try {
    const { productId, productTitle, sku, liquidationPrice, retailMSRP, offeredPrice, quantity, note, customer } = req.body;

    if (!productId || !offeredPrice || !customer?.name || !customer?.phone) {
      return res.status(400).json({ success: false, error: 'Missing required offer details (Price, Name, Phone).' });
    }

    const offer = await Offer.create({
      productId,
      productTitle: productTitle || 'Item',
      sku: sku || 'N/A',
      liquidationPrice: Number(liquidationPrice) || 0,
      retailMSRP: Number(retailMSRP) || 0,
      offeredPrice: Number(offeredPrice),
      quantity: Number(quantity) || 1,
      note: (note || '').trim(),
      customer: {
        name: (customer.name || '').trim(),
        email: (customer.email || '').trim(),
        phone: (customer.phone || '').trim(),
        city: (customer.city || 'Scarborough').trim()
      },
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Your offer has been submitted to ApexxVault seller for review!',
      offer
    });
  } catch (err) {
    console.error('Create offer error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/offers (List all offers or filter by customer email)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email && email.trim()) {
      query['customer.email'] = new RegExp(`^${email.trim()}$`, 'i');
    }
    const offers = await Offer.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/offers/:id/status (Accept / Decline / Counter)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, counterPrice, adminResponseNote } = req.body;
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    if (status) offer.status = status;
    if (counterPrice !== undefined) offer.counterPrice = counterPrice;
    if (adminResponseNote !== undefined) offer.adminResponseNote = adminResponseNote;

    await offer.save();
    return res.json({ success: true, message: `Offer marked as ${status}`, offer });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/offers/:id (Delete offer)
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }
    return res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
