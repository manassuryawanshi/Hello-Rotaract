import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, taskController.getTasks);
router.post('/', requireAuth, taskController.createTask);
router.patch('/:taskId/status', requireAuth, taskController.updateTaskStatus);
router.delete('/:taskId', requireAuth, taskController.deleteTask);

export default router;
