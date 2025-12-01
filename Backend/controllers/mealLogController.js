import MealLog from '../models/MealLog.js';

// Log a meal
export const logMeal = async (req, res) => {
    try {
        const { recipeId, recipeName, recipeImage, calories, protein, carbs, fat, mealType } = req.body;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        const mealLog = new MealLog({
            userId: req.user.id,
            date: today,
            recipeId,
            recipeName,
            recipeImage,
            calories,
            protein,
            carbs,
            fat,
            mealType: mealType || 'snack'
        });

        await mealLog.save();

        res.json({ msg: 'Meal logged successfully', mealLog });
    } catch (err) {
        console.error('[LOG_MEAL_ERROR]', err);
        res.status(500).json({ msg: 'Error logging meal' });
    }
};

// Get today's meals
export const getTodaysMeals = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const meals = await MealLog.find({
            userId: req.user.id,
            date: today
        }).sort({ loggedAt: -1 });

        // Calculate totals
        const totals = meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        res.json({ meals, totals });
    } catch (err) {
        console.error('[GET_TODAYS_MEALS_ERROR]', err);
        res.status(500).json({ msg: 'Error fetching meals' });
    }
};

// Get meals by date
export const getMealsByDate = async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD format

        const meals = await MealLog.find({
            userId: req.user.id,
            date: date || new Date().toISOString().split('T')[0]
        }).sort({ loggedAt: -1 });

        const totals = meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        res.json({ meals, totals });
    } catch (err) {
        console.error('[GET_MEALS_BY_DATE_ERROR]', err);
        res.status(500).json({ msg: 'Error fetching meals' });
    }
};

// Delete a meal log
export const deleteMealLog = async (req, res) => {
    try {
        const { id } = req.params;

        const mealLog = await MealLog.findOne({ _id: id, userId: req.user.id });

        if (!mealLog) {
            return res.status(404).json({ msg: 'Meal log not found' });
        }

        await mealLog.deleteOne();

        res.json({ msg: 'Meal log deleted successfully' });
    } catch (err) {
        console.error('[DELETE_MEAL_LOG_ERROR]', err);
        res.status(500).json({ msg: 'Error deleting meal log' });
    }
};

// Get meal history (last 7 days)
export const getMealHistory = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const meals = await MealLog.find({
            userId: req.user.id,
            loggedAt: { $gte: sevenDaysAgo }
        }).sort({ loggedAt: -1 });

        // Group by date
        const mealsByDate = meals.reduce((acc, meal) => {
            if (!acc[meal.date]) {
                acc[meal.date] = {
                    meals: [],
                    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
                };
            }
            acc[meal.date].meals.push(meal);
            acc[meal.date].totals.calories += meal.calories;
            acc[meal.date].totals.protein += meal.protein;
            acc[meal.date].totals.carbs += meal.carbs;
            acc[meal.date].totals.fat += meal.fat;
            return acc;
        }, {});

        res.json({ mealsByDate });
    } catch (err) {
        console.error('[GET_MEAL_HISTORY_ERROR]', err);
        res.status(500).json({ msg: 'Error fetching meal history' });
    }
};
