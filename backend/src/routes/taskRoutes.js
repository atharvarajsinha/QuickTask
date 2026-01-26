import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, updateTaskStatus, exportTasksCSV } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id/update', authMiddleware, updateTask);
router.delete('/:id/delete', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);
router.get('/export/csv', authMiddleware, exportTasksCSV);

export default router;