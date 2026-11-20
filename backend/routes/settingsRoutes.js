import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, requireAdmin, updateSettings);

export default router;
