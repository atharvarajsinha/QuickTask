import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory,} from "../controllers/categoryController.js";

const router = express.Router();

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getAllCategories);
router.get('/:id', authMiddleware, getCategoryById);
router.put('/:id/update', authMiddleware, updateCategory);
router.delete('/:id/delete', authMiddleware, deleteCategory);

export default router;
