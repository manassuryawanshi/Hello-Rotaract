import express from 'express';
import * as eventController from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, eventController.getAllEvents);
router.post('/', requireAuth, requireRole(['ADMIN', 'TREASURER']), eventController.createEvent);

router.get('/:eventId/attendance', requireAuth, eventController.getEventAttendance);
router.post('/:eventId/attendance', requireAuth, requireRole(['ADMIN']), eventController.markAttendance);
router.delete('/:eventId/attendance/:profileId', requireAuth, requireRole(['ADMIN']), eventController.removeAttendance);

export default router;
