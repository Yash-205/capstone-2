import express from 'express';
import {
    createRecipe,
    getAllUserRecipes,
    getMyRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe
} from '../controllers/userRecipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getAllUserRecipes); // Browse all user recipes
router.get('/:id', getRecipeById); // Get single recipe

// Protected routes
router.post('/', protect, upload.single('image'), createRecipe); // Create recipe
router.get('/my/recipes', protect, getMyRecipes); // Get user's own recipes
router.put('/:id', protect, upload.single('image'), updateRecipe); // Update recipe
router.delete('/:id', protect, deleteRecipe); // Delete recipe

export default router;
