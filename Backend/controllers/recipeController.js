import fetch from 'node-fetch';
import Recipe from '../models/Recipe.js';

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.SPOONACULAR_API_KEY || process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export const searchRecipes = async (req, res) => {
    try {
        const {
            query,
            minCalories,
            maxCalories,
            minProtein,
            maxProtein,
            minCarbs,
            maxCarbs,
            minFat,
            maxFat,
            diet,
            excludeIngredients,
            number = 12,
            offset = 0
        } = req.query;

        // 1. Search Spoonacular API
        let apiUrl = `${SPOONACULAR_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=${number}&offset=${offset}&addRecipeNutrition=true`;

        if (query) apiUrl += `&query=${encodeURIComponent(query)}`;
        if (minCalories) apiUrl += `&minCalories=${minCalories}`;
        if (maxCalories) apiUrl += `&maxCalories=${maxCalories}`;
        if (minProtein) apiUrl += `&minProtein=${minProtein}`;
        if (maxProtein) apiUrl += `&maxProtein=${maxProtein}`;
        if (minCarbs) apiUrl += `&minCarbs=${minCarbs}`;
        if (maxCarbs) apiUrl += `&maxCarbs=${maxCarbs}`;
        if (minFat) apiUrl += `&minFat=${minFat}`;
        if (maxFat) apiUrl += `&maxFat=${maxFat}`;
        if (diet) apiUrl += `&diet=${encodeURIComponent(diet)}`;
        if (excludeIngredients) apiUrl += `&excludeIngredients=${encodeURIComponent(excludeIngredients)}`;

        const apiPromise = fetch(apiUrl).then(res => res.json());

        // 2. Search Local Database
        const localQuery = {};
        if (query) {
            localQuery.$text = { $search: query };
        }

        // Map Spoonacular diet to local fields
        if (diet) {
            const dietLower = diet.toLowerCase();
            if (dietLower.includes('vegetarian')) localQuery.vegetarian = true;
            if (dietLower.includes('vegan')) localQuery.vegan = true;
            if (dietLower.includes('gluten free')) localQuery.glutenFree = true;
            // Add more mappings if needed
        }

        // Nutrition filters for local DB
        if (minCalories) localQuery['nutrition.calories'] = { $gte: parseInt(minCalories) };
        if (maxCalories) localQuery['nutrition.calories'] = { ...localQuery['nutrition.calories'], $lte: parseInt(maxCalories) };
        if (minProtein) localQuery['nutrition.protein'] = { $gte: parseInt(minProtein) };
        if (maxProtein) localQuery['nutrition.protein'] = { ...localQuery['nutrition.protein'], $lte: parseInt(maxProtein) };
        // ... add other macros similarly if needed

        const localPromise = Recipe.find(localQuery)
            .limit(parseInt(number))
            .skip(parseInt(offset))
            .lean();

        const localCountPromise = Recipe.countDocuments(localQuery);

        // 3. Execute all searches
        const [apiData, localRecipes, localTotal] = await Promise.all([apiPromise, localPromise, localCountPromise]);

        if (apiData.status === 'failure' || apiData.code) {
            console.error('[SPOONACULAR_ERROR]', apiData);
            // If API fails, return only local recipes formatted
            return res.json({
                results: localRecipes.map(formatLocalRecipe),
                offset: parseInt(offset),
                number: parseInt(number),
                totalResults: localTotal
            });
        }

        // 4. Format Local Recipes to match Spoonacular structure
        const formattedLocalRecipes = localRecipes.map(recipe => ({
            id: `user-${recipe._id}`, // Prefix ID to distinguish
            title: recipe.title,
            image: recipe.image,
            imageType: 'jpg',
            nutrition: {
                nutrients: [
                    { name: "Calories", amount: recipe.nutrition.calories, unit: "kcal" },
                    { name: "Protein", amount: recipe.nutrition.protein, unit: "g" },
                    { name: "Fat", amount: recipe.nutrition.fat, unit: "g" },
                    { name: "Carbohydrates", amount: recipe.nutrition.carbs, unit: "g" }
                ]
            },
            summary: recipe.summary,
            diets: [
                recipe.vegetarian ? "vegetarian" : null,
                recipe.vegan ? "vegan" : null,
                recipe.glutenFree ? "gluten free" : null,
                recipe.dairyFree ? "dairy free" : null
            ].filter(Boolean)
        }));

        // 5. Merge Results (Local first, then API)
        const mergedResults = [...formattedLocalRecipes, ...apiData.results];

        res.json({
            ...apiData,
            results: mergedResults,
            totalResults: apiData.totalResults + localTotal
        });

    } catch (err) {
        console.error('[SEARCH_RECIPES_ERROR]', err);
        res.status(500).json({ msg: 'Server error searching recipes' });
    }
};

// Helper to format local recipe if API fails
const formatLocalRecipe = (recipe) => ({
    id: `user-${recipe._id}`,
    title: recipe.title,
    image: recipe.image,
    nutrition: {
        nutrients: [
            { name: "Calories", amount: recipe.nutrition.calories, unit: "kcal" },
            { name: "Protein", amount: recipe.nutrition.protein, unit: "g" },
            { name: "Fat", amount: recipe.nutrition.fat, unit: "g" },
            { name: "Carbohydrates", amount: recipe.nutrition.carbs, unit: "g" }
        ]
    }
});

export const getRecipeInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const { includeNutrition = true } = req.query;

        // Check if it's a user recipe
        if (id.startsWith('user-')) {
            const localId = id.replace('user-', '');
            const recipe = await Recipe.findById(localId).populate('author', 'name');

            if (!recipe) {
                return res.status(404).json({ msg: 'Recipe not found' });
            }

            // Format local recipe to match Spoonacular detailed response
            const formattedRecipe = {
                id: id,
                authorId: recipe.author ? recipe.author._id.toString() : null, // Add author ID for ownership check
                title: recipe.title,
                image: recipe.image,
                imageType: 'jpg',
                servings: recipe.servings,
                readyInMinutes: recipe.readyInMinutes,
                sourceName: recipe.author ? recipe.author.name : 'Community User',
                sourceUrl: null,
                spoonacularSourceUrl: null,
                aggregateLikes: 0,
                healthScore: 0,
                spoonacularScore: 0,
                pricePerServing: recipe.pricePerServing || 0,
                cheap: false,
                creditsText: recipe.author ? recipe.author.name : 'Community User',
                cuisines: [],
                dairyFree: recipe.dairyFree,
                diets: [
                    recipe.vegetarian ? "vegetarian" : null,
                    recipe.vegan ? "vegan" : null,
                    recipe.glutenFree ? "gluten free" : null,
                    recipe.dairyFree ? "dairy free" : null
                ].filter(Boolean),
                gaps: "no",
                glutenFree: recipe.glutenFree,
                instructions: recipe.instructions.map(i => i.step).join('\n'),
                ketogenic: false,
                lowFodmap: false,
                occasions: [],
                sustainable: false,
                vegan: recipe.vegan,
                vegetarian: recipe.vegetarian,
                veryHealthy: false,
                veryPopular: false,
                whole30: false,
                weightWatcherSmartPoints: 0,
                dishTypes: [],
                extendedIngredients: recipe.ingredients.map(ing => ({
                    id: null,
                    aisle: null,
                    image: null,
                    consistency: "SOLID",
                    name: ing.name,
                    nameClean: ing.name,
                    original: `${ing.amount} ${ing.unit} ${ing.name}`,
                    originalName: ing.name,
                    amount: ing.amount,
                    unit: ing.unit,
                    meta: [],
                    measures: {
                        us: { amount: ing.amount, unitShort: ing.unit, unitLong: ing.unit },
                        metric: { amount: ing.amount, unitShort: ing.unit, unitLong: ing.unit }
                    }
                })),
                summary: recipe.summary,
                winePairing: {},
                analyzedInstructions: [
                    {
                        name: "",
                        steps: recipe.instructions.map(inst => ({
                            number: inst.number,
                            step: inst.step,
                            ingredients: [],
                            equipment: []
                        }))
                    }
                ],
                nutrition: {
                    nutrients: [
                        { name: "Calories", amount: recipe.nutrition.calories, unit: "kcal" },
                        { name: "Protein", amount: recipe.nutrition.protein, unit: "g" },
                        { name: "Fat", amount: recipe.nutrition.fat, unit: "g" },
                        { name: "Carbohydrates", amount: recipe.nutrition.carbs, unit: "g" }
                    ],
                    properties: [],
                    flavonoids: [],
                    ingredients: [],
                    caloricBreakdown: {
                        percentProtein: 0,
                        percentFat: 0,
                        percentCarbs: 0
                    },
                    weightPerServing: { amount: 0, unit: "g" }
                }
            };

            return res.json(formattedRecipe);
        }

        // Fetch from Spoonacular
        const apiUrl = `${SPOONACULAR_BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=${includeNutrition}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[SPOONACULAR_ERROR]', errorData);
            return res.status(response.status).json({ msg: 'Error fetching recipe details', error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[GET_RECIPE_INFO_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching recipe details' });
    }
};

export const getRandomRecipes = async (req, res) => {
    try {
        const { number = 1, tags } = req.query;

        let apiUrl = `${SPOONACULAR_BASE_URL}/random?apiKey=${API_KEY}&number=${number}`;

        if (tags) apiUrl += `&tags=${encodeURIComponent(tags)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[SPOONACULAR_ERROR]', errorData);
            return res.status(response.status).json({ msg: 'Error fetching random recipes', error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[GET_RANDOM_RECIPES_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching random recipes' });
    }
};

export const getIngredientSubstitutes = async (req, res) => {
    try {
        const { ingredientName } = req.query;

        const apiUrl = `https://api.spoonacular.com/food/ingredients/substitutes?apiKey=${API_KEY}&ingredientName=${encodeURIComponent(ingredientName)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[SPOONACULAR_ERROR]', errorData);
            return res.status(response.status).json({ msg: 'Error fetching substitutes', error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[GET_SUBSTITUTES_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching substitutes' });
    }
};

export const searchRecipeVideos = async (req, res) => {
    try {
        const { query, number = 10, offset = 0 } = req.query;

        const apiUrl = `https://api.spoonacular.com/food/videos/search?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=${number}&offset=${offset}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[SPOONACULAR_ERROR]', errorData);
            return res.status(response.status).json({ msg: 'Error fetching videos', error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[SEARCH_VIDEOS_ERROR]', err);
        res.status(500).json({ msg: 'Server error searching videos' });
    }
};
