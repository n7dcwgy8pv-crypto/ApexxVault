import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  bulkUploadProducts,
  updateProduct,
  deleteProduct,
  clearAllProducts,
  holdProduct
} from '../controllers/productController.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.post('/bulk', bulkUploadProducts);
router.delete('/clear', clearAllProducts);
router.post('/:id/hold', holdProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
