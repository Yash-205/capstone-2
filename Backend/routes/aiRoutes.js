import express from 'express';
import { getAIMealRecommendations, getDailyMealPlan, getWeeklyPlan } from '../controllers/aiRecommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/ai/recommendations?mealType=breakfast|lunch|dinner
router.get('/recommendations', protect, getAIMealRecommendations);

// GET /api/ai/daily-plan
router.get('/daily-plan', protect, getDailyMealPlan);

// GET /api/ai/weekly-plan
router.get('/weekly-plan', protect, getWeeklyPlan);

export default router;
