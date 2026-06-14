import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Member routes
router.get('/me', requireAuth, paymentController.getMyDues);
router.post('/submit', requireAuth, paymentController.submitPaymentProof);

// Treasurer/Admin routes
router.get('/pending', requireAuth, requireRole(['TREASURER', 'ADMIN']), paymentController.getPendingPayments);
router.post('/verify', requireAuth, requireRole(['TREASURER', 'ADMIN']), paymentController.verifyPayment);

export default router;
