import express from 'express';
import { searchRecipes, getRecipeInformation, getRandomRecipes, getIngredientSubstitutes, searchRecipeVideos } from '../controllers/recipeController.js';
// Note: We might want to protect these routes, or leave them public depending on requirements.
// Since the frontend was calling them directly (publicly with key), we can leave them public or add optional auth.
// For now, I'll keep them open but we can add 'protect' middleware if needed.

const router = express.Router();

// GET /api/recipes/search
router.get('/search', searchRecipes);

// GET /api/recipes/random
router.get('/random', getRandomRecipes);

// GET /api/recipes/substitutes
router.get('/substitutes', getIngredientSubstitutes);

// GET /api/recipes/videos
router.get('/videos', searchRecipeVideos);

// GET /api/recipes/:id
router.get('/:id', getRecipeInformation);

export default router;
