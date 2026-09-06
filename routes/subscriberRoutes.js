import express from 'express';
import { Subscriber } from '../models/Subscriber.js';

const router = express.Router();

// POST /api/subscribers (Lead Capture / Drop Alerts)
router.post('/', async (req, res) => {
  try {
    const { email, phone, name, preferredCategories, notifyVia } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      existing.phone = phone || existing.phone;
      existing.name = name || existing.name;
      existing.preferredCategories = preferredCategories || existing.preferredCategories;
      existing.notifyVia = notifyVia || existing.notifyVia;
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'Your Drop Alert preferences have been updated!', subscriber: existing });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase().trim(),
      phone: (phone || '').trim(),
      name: (name || '').trim(),
      preferredCategories: Array.isArray(preferredCategories) && preferredCategories.length > 0 ? preferredCategories : ['all'],
      notifyVia: notifyVia || 'email'
    });

    return res.status(201).json({
      success: true,
      message: 'Subscribed to ApexxVault VIP Drop Alerts!',
      subscriber
    });
  } catch (err) {
    console.error('Subscriber error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/subscribers (Admin View)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
