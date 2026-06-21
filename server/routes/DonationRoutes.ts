import express from 'express';
import {
  createDonationOrder,
  verifyDonationPayment,
} from '../controllers/DonationController.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/create-order', authMiddleware, createDonationOrder);
router.post('/verify', authMiddleware, verifyDonationPayment);

export default router;
