import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/admin/approvals', requireAuth, requireRole(['ADMIN']), authController.getPendingApprovals);
router.post('/admin/approve', requireAuth, requireRole(['ADMIN']), authController.approveMember);

export default router;
