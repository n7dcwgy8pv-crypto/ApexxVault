import { Settings } from '../models/Settings.js';

// @desc    Get store settings (Stripe & Email configs)
// @route   GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'store_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'store_settings' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update store settings in MongoDB
// @route   PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: 'store_settings' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Settings saved to MongoDB', data: settings });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
