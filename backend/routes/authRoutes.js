import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  changePassword
} from '../controllers/authController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin-only user management (Finding A13, Security Review)
router.get('/users', protect, requireAdmin, getAllUsers);
router.delete('/users/:id', protect, requireAdmin, deleteUser);
router.put('/users/:id/role', protect, requireAdmin, updateUserRole);

export default router;
