import express from 'express';
import upload from '../config/multer.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, uploadFile, changePassword, deleteUserAccount, toggleDarkMode } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile',   authMiddleware, getUserProfile);
router.put('/profile',  authMiddleware, updateUserProfile);
router.post('/profile/upload', authMiddleware, upload.single('file'), uploadFile);
router.post('/change-password', authMiddleware, changePassword);
router.delete('/delete-account', authMiddleware, deleteUserAccount);
router.patch('/toggle-mode', authMiddleware, toggleDarkMode);

export default router;