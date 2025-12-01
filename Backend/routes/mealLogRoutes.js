import express from 'express';
import { logMeal, getTodaysMeals, getMealsByDate, deleteMealLog, getMealHistory } from '../controllers/mealLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/meals - Log a meal
router.post('/', protect, logMeal);

// GET /api/meals/today - Get today's meals
router.get('/today', protect, getTodaysMeals);

// GET /api/meals/date?date=YYYY-MM-DD - Get meals by date
router.get('/date', protect, getMealsByDate);

// GET /api/meals/history - Get last 7 days
router.get('/history', protect, getMealHistory);

// DELETE /api/meals/:id - Delete a meal log
router.delete('/:id', protect, deleteMealLog);

export default router;
