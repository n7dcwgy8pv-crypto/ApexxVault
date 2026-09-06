import express from 'express';
import {
  createOrder,
  getOrders,
  lookupOrder,
  releaseOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.get('/lookup', lookupOrder);
router.put('/:orderId/release', releaseOrder);

export default router;
