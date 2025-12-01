import Groq from "groq-sdk";
import User from "../models/User.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Calculate macros based on user profile
const calculateMacros = (user) => {
    const { age, gender, weight, height, activityLevel, fitnessGoal } = user;

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very active': 1.9
    };

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    // Adjust calories based on fitness goal
    let targetCalories;
    if (fitnessGoal === 'weight loss') {
        targetCalories = tdee - 500; // 500 calorie deficit
    } else if (fitnessGoal === 'muscle gain') {
        targetCalories = tdee + 300; // 300 calorie surplus
    } else {
        targetCalories = tdee; // maintenance
    }

    // Calculate macro ranges
    // Protein: 1.6-2.2g per kg body weight
    const proteinPerKg = fitnessGoal === 'muscle gain' ? 2.0 : 1.8;
    const protein = weight * proteinPerKg;

    // Fat: 20-30% of total calories
    const fatCalories = targetCalories * 0.25;
    const fat = fatCalories / 9; // 9 calories per gram of fat

    // Carbs: remaining calories
    const carbCalories = targetCalories - (protein * 4) - (fat * 9);
    const carbs = carbCalories / 4; // 4 calories per gram of carbs

    return {
        calories: Math.round(targetCalories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
    };
};

export const getAIMealRecommendations = async (req, res) => {
    try {
        const { mealType } = req.query; // breakfast, lunch, or dinner

        // Get user profile
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if profile is completed
        if (!user.profileCompleted) {
            return res.status(400).json({ msg: "Please complete your profile first" });
        }

        // Calculate user's macros
        const macros = calculateMacros(user);

        // Determine meal calorie distribution
        const mealDistribution = {
            breakfast: 0.30, // 30% of daily calories
            lunch: 0.35,     // 35% of daily calories
            dinner: 0.35     // 35% of daily calories
        };

        const mealCalories = Math.round(macros.calories * (mealDistribution[mealType] || 0.33));
        const mealProtein = Math.round(macros.protein * (mealDistribution[mealType] || 0.33));
        const mealCarbs = Math.round(macros.carbs * (mealDistribution[mealType] || 0.33));
        const mealFat = Math.round(macros.fat * (mealDistribution[mealType] || 0.33));

        // Create prompt for LLaMA
        const prompt = `You are a nutrition AI assistant. Based on the following user profile, generate meal search parameters.

User Profile:
- Age: ${user.age}
- Gender: ${user.gender}
- Weight: ${user.weight}kg
- Height: ${user.height}cm
- Activity Level: ${user.activityLevel}
- Fitness Goal: ${user.fitnessGoal}
- Meal Type Preference: ${user.mealType}
- Allergies: ${user.allergies?.join(', ') || 'None'}
- Preferred Cuisines: ${user.preferredCuisines?.join(', ') || 'Any'}
- Meals Per Day: ${user.mealsPerDay}

Calculated Macros for ${mealType}:
- Calories: ${mealCalories} (±150 for flexibility)
- Protein: ${mealProtein}g (±15g for flexibility)
- Carbs: ${mealCarbs}g (±30g for flexibility)
- Fat: ${mealFat}g (±15g for flexibility)

IMPORTANT: Generate WIDE ranges to ensure recipes are found. The ranges should be flexible enough to return results.

Always respond ONLY with JSON in the following format:

{
  "mealType": "breakfast | lunch | dinner",
  "nutrientTargets": {
    "minCalories": number,
    "maxCalories": number,
    "minProtein": number,
    "maxProtein": number,
    "minCarbs": number,
    "maxCarbs": number,
    "minFat": number,
    "maxFat": number
  },
  "diet": "vegetarian | non-veg | vegan",
  "excludeIngredients": ["list", "of", "allergies"],
  "numberOfRecipes": 12
}

Do NOT include any text outside JSON.
Make the ranges WIDE (use the ± values provided) to ensure recipes are found.
For diet, use: "vegetarian" for veg, "" (empty string) for non-veg, "vegan" for vegan.`;

        // Call Groq LLaMA API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a nutrition expert AI that generates meal search parameters in JSON format only. Never include explanations or text outside the JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 500,
            response_format: { type: "json_object" }
        });

        const aiResponse = completion.choices[0]?.message?.content;

        if (!aiResponse) {
            return res.status(500).json({ msg: "Failed to generate recommendations" });
        }

        // Parse AI response
        const recommendations = JSON.parse(aiResponse);

        // Add user context
        const response = {
            ...recommendations,
            userMacros: macros,
            mealMacros: {
                calories: mealCalories,
                protein: mealProtein,
                carbs: mealCarbs,
                fat: mealFat
            }
        };

        res.json(response);

    } catch (err) {
        console.error("[AI_RECOMMENDATIONS_ERROR]", err);
        res.status(500).json({ msg: "Error generating meal recommendations" });
    }
};

export const getDailyMealPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profileCompleted) {
            return res.status(400).json({ msg: "Please complete your profile first" });
        }

        const macros = calculateMacros(user);
        const { mealsPerDay, dietPreference } = user;

        const prompt = `Generate a daily meal plan structure for a user with the following stats:
        - Daily Target: ${macros.calories} kcal
        - Protein: ${macros.protein}g
        - Carbs: ${macros.carbs}g
        - Fat: ${macros.fat}g
        - Meals per day: ${mealsPerDay}
        - Diet: ${dietPreference || 'Any'}

        Divide the daily macros into ${mealsPerDay} meals (e.g., Breakfast, Lunch, Dinner, Snacks).
        Provide specific nutrient ranges for each meal.

        Respond ONLY with JSON in this format:
        {
            "dailyTotals": { "calories": number, "protein": number, "carbs": number, "fat": number },
            "meals": [
                {
                    "name": "Breakfast",
                    "calories": "range (e.g. 400-500)",
                    "protein": "range",
                    "carbs": "range",
                    "fat": "range",
                    "suggestion": "Brief food suggestion (e.g. Oatmeal with whey)"
                },
                ...
            ]
        }`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a nutrition expert AI. Output JSON only." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const plan = JSON.parse(completion.choices[0]?.message?.content || "{}");
        res.json(plan);

    } catch (err) {
        console.error("[DAILY_PLAN_ERROR]", err);
        res.status(500).json({ msg: "Error generating daily plan" });
    }
};

export const getWeeklyPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profileCompleted) {
            return res.status(400).json({ msg: "Please complete your profile first" });
        }

        const macros = calculateMacros(user);

        const prompt = `Generate a 7-day nutritional plan for a user with:
        - Goal: ${user.fitnessGoal}
        - Daily Target: ${macros.calories} kcal
        - Diet: ${user.dietPreference || 'Any'}

        Provide a 7-day schedule. Vary the focus slightly if appropriate for the goal (e.g. Carb cycling for weight loss, or steady for maintenance).

        Respond ONLY with JSON in this format:
        {
            "weeklyOverview": "Brief summary of the week's strategy",
            "days": [
                {
                    "day": "Day 1",
                    "focus": "e.g. High Carb / Training Day",
                    "calories": number,
                    "protein": number,
                    "carbs": number,
                    "fat": number,
                    "tip": "Brief daily tip"
                },
                ... (7 days total)
            ]
        }`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a nutrition expert AI. Output JSON only." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const plan = JSON.parse(completion.choices[0]?.message?.content || "{}");
        res.json(plan);

    } catch (err) {
        console.error("[WEEKLY_PLAN_ERROR]", err);
        res.status(500).json({ msg: "Error generating weekly plan" });
    }
};
