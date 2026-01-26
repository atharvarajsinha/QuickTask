import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, changePassword, deleteUserAccount, toggleDarkMode } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile',   authMiddleware, getUserProfile);
router.put('/profile',  authMiddleware, updateUserProfile);
router.post('/change-password', authMiddleware, changePassword);
router.delete('/delete-account', authMiddleware, deleteUserAccount);
router.patch('/toggle-mode', authMiddleware, toggleDarkMode);

export default router;