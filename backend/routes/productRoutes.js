import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  bulkUploadProducts,
  updateProduct,
  deleteProduct,
  clearAllProducts,
  holdProduct,
  sanitizeAndDeduplicateCatalog
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

router.post('/bulk', protect, requireAdmin, bulkUploadProducts);
router.delete('/clear', protect, requireAdmin, clearAllProducts);
router.post('/sanitize-catalog', protect, requireAdmin, sanitizeAndDeduplicateCatalog);
router.post('/:id/hold', holdProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

export default router;
