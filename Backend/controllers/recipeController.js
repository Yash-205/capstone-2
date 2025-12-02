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
            cuisine,        // NEW: Filter by cuisine (e.g., Italian, Mexican)
            type,           // NEW: Filter by dish type (e.g., main course, dessert)
            maxReadyTime,   // NEW: Filter by max cooking time
            page = 1,
            limit = 3, // Changed to 3 items per page as requested
            sortBy  // NEW: Extract sorting parameter
        } = req.query;

        // 1. Fetch ALL results from Spoonacular API (max 100)
        let apiUrl = `${SPOONACULAR_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=100&offset=0&addRecipeNutrition=true`;

        if (query) apiUrl += `&query=${encodeURIComponent(query)}`;
        if (minCalories) apiUrl += `&minCalories=${minCalories}`;
        if (maxCalories) apiUrl += `&maxCalories=${maxCalories}`;
        if (minProtein) apiUrl += `&minProtein=${minProtein}`;
        if (maxProtein) apiUrl += `&maxProtein=${maxProtein}`;
        if (minCarbs) apiUrl += `&minCarbs=${minCarbs}`;
        if (maxCarbs) apiUrl += `&maxCarbs=${maxCarbs}`;
        if (minFat) apiUrl += `&minFat=${minFat}`;
        if (maxFat) apiUrl += `&maxFat=${maxFat}`;
        // REMOVED: diet parameter from API call - we filter locally now
        if (excludeIngredients) apiUrl += `&excludeIngredients=${encodeURIComponent(excludeIngredients)}`;

        const apiPromise = fetch(apiUrl).then(res => res.json());

        // 2. Fetch ALL matching user recipes from local database
        const localQuery = {};
        if (query) {
            localQuery.$text = { $search: query };
        }

        // Map diet preference to local fields (simplified to 3 options)
        if (diet) {
            // diet can be: 'Vegetarian' or 'Vegan' (empty/omnivore = no filter)
            if (diet === 'Vegetarian') {
                localQuery.vegetarian = true;
            } else if (diet === 'Vegan') {
                localQuery.vegan = true;
            }
        }

        // Nutrition filters for local DB
        if (minCalories) localQuery['nutrition.calories'] = { $gte: parseInt(minCalories) };
        if (maxCalories) localQuery['nutrition.calories'] = { ...localQuery['nutrition.calories'], $lte: parseInt(maxCalories) };
        if (minProtein) localQuery['nutrition.protein'] = { $gte: parseInt(minProtein) };
        if (maxProtein) localQuery['nutrition.protein'] = { ...localQuery['nutrition.protein'], $lte: parseInt(maxProtein) };
        // ... add other macros similarly if needed

        // Fetch ALL user recipes without pagination
        const localPromise = Recipe.find(localQuery).lean();
        const localCountPromise = Recipe.countDocuments(localQuery);

        // 3. Execute all searches in parallel
        const [apiData, localRecipes, localTotal] = await Promise.all([apiPromise, localPromise, localCountPromise]);

        if (apiData.status === 'failure' || apiData.code) {
            console.error('[SPOONACULAR_ERROR]', apiData);
            // If API fails, use only local recipes
            const startIndex = (parseInt(page) - 1) * parseInt(limit);
            const endIndex = startIndex + parseInt(limit);
            const paginatedLocal = localRecipes.slice(startIndex, endIndex);

            return res.json({
                results: paginatedLocal.map(formatLocalRecipe),
                page: parseInt(page),
                limit: parseInt(limit),
                totalResults: localTotal,
                totalPages: Math.ceil(localTotal / parseInt(limit))
            });
        }

        // 4. Format Local Recipes to match Spoonacular structure
        const formattedLocalRecipes = localRecipes.map(recipe => ({
            id: `user-${recipe._id}`, // Prefix ID to distinguish
            title: recipe.title,
            image: recipe.image,
            imageType: 'jpg',
            readyInMinutes: recipe.readyInMinutes,
            cuisines: recipe.cuisines || [],
            dishTypes: recipe.dishTypes || [],
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

        // Filter API results locally based on diet
        let apiResults = apiData.results || [];
        if (diet) {
            apiResults = apiResults.filter(recipe => {
                if (diet === 'Vegetarian') return recipe.vegetarian;
                if (diet === 'Vegan') return recipe.vegan;
                return true;
            });
        }

        // 5. Merge ALL results (Local first, then Filtered API)
        const allResults = [...formattedLocalRecipes, ...apiResults];

        // 5.5. Apply custom backend filtering (not passed to Spoonacular)
        let filteredResults = allResults;

        // Filter by cuisine
        if (cuisine) {
            filteredResults = filteredResults.filter(recipe => {
                const recipeCuisines = recipe.cuisines || [];
                return recipeCuisines.some(c =>
                    c.toLowerCase().includes(cuisine.toLowerCase())
                );
            });
        }

        // Filter by dish type (e.g., main course, dessert, appetizer)
        if (type) {
            filteredResults = filteredResults.filter(recipe => {
                const recipeDishTypes = recipe.dishTypes || [];
                return recipeDishTypes.some(dt =>
                    dt.toLowerCase().includes(type.toLowerCase())
                );
            });
        }

        // Filter by max cooking time
        if (maxReadyTime) {
            filteredResults = filteredResults.filter(recipe => {
                return recipe.readyInMinutes && recipe.readyInMinutes <= parseInt(maxReadyTime);
            });
        }

        // 5.6. Apply sorting (after filtering, before pagination)
        if (sortBy) {
            switch (sortBy) {
                case 'name-asc':
                    filteredResults.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    filteredResults.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'time-asc':
                    filteredResults.sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
                    break;
                case 'time-desc':
                    filteredResults.sort((a, b) => (b.readyInMinutes || 0) - (a.readyInMinutes || 0));
                    break;
                case 'calories-asc':
                    filteredResults.sort((a, b) => {
                        const caloriesA = a.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0;
                        const caloriesB = b.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0;
                        return caloriesA - caloriesB;
                    });
                    break;
                case 'calories-desc':
                    filteredResults.sort((a, b) => {
                        const caloriesA = a.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0;
                        const caloriesB = b.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0;
                        return caloriesB - caloriesA;
                    });
                    break;
                default:
                    // No sorting or invalid sortBy value
                    break;
            }
        }

        const totalResults = filteredResults.length;

        // 6. Paginate in backend
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedResults = filteredResults.slice(startIndex, endIndex);

        res.json({
            results: paginatedResults,
            page: parseInt(page),
            limit: parseInt(limit),
            totalResults: totalResults,
            totalPages: Math.ceil(totalResults / parseInt(limit))
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
            console.warn(`[SPOONACULAR_API_FAIL] Status: ${response.status}. Falling back to local recipes.`);

            // Fallback to local recipes
            const limit = parseInt(number) || 1;
            const pipeline = [];

            // Match tags if provided (assuming tags map to dishTypes or cuisines)
            if (tags) {
                const tagList = tags.split(',').map(t => t.trim().toLowerCase());
                pipeline.push({
                    $match: {
                        $or: [
                            { dishTypes: { $in: tagList } },
                            { cuisines: { $in: tagList } }
                        ]
                    }
                });
            }

            // Random sample
            pipeline.push({ $sample: { size: limit } });

            const localRecipes = await Recipe.aggregate(pipeline);

            // Format local recipes to match Spoonacular structure partially if needed
            // The frontend likely expects { recipes: [...] }
            return res.json({
                recipes: localRecipes,
                source: 'local_fallback'
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[GET_RANDOM_RECIPES_ERROR]', err);
        // Even on server error, try to return local recipes as last resort
        try {
            const limit = parseInt(req.query.number) || 1;
            const localRecipes = await Recipe.aggregate([{ $sample: { size: limit } }]);
            return res.json({ recipes: localRecipes, source: 'local_fallback_error' });
        } catch (dbErr) {
            console.error('[LOCAL_FALLBACK_ERROR]', dbErr);
            res.status(500).json({ msg: 'Server error fetching random recipes' });
        }
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
