import fetch from 'node-fetch';

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

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[SPOONACULAR_ERROR]', errorData);
            return res.status(response.status).json({ msg: 'Error fetching recipes from Spoonacular', error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[SEARCH_RECIPES_ERROR]', err);
        res.status(500).json({ msg: 'Server error searching recipes' });
    }
};

export const getRecipeInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const { includeNutrition = true } = req.query;

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
