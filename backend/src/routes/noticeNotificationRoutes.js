import express from 'express';
import * as noticeController from '../controllers/noticeController.js';
import * as notificationController from '../controllers/notificationController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Notices
router.get('/notices', requireAuth, noticeController.getNotices);
router.post('/notices', requireAuth, requireRole(['ADMIN']), noticeController.createNotice);

// Notifications
router.get('/notifications', requireAuth, notificationController.getMyNotifications);
router.patch('/notifications/read', requireAuth, notificationController.markAllAsRead);

export default router;
