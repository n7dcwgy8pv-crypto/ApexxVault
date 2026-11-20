import express from 'express';
import {
  createOrder,
  getOrders,
  lookupOrder,
  releaseOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, requireAdmin, getOrders)
  .post(createOrder);

router.get('/lookup', lookupOrder);
router.put('/:orderId/release', protect, requireAdmin, releaseOrder);
router.put('/:orderId/status', protect, requireAdmin, updateOrderStatus);

export default router;
