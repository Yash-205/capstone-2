import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'recipe-images',
                transformation: [{ width: 800, height: 600, crop: 'limit' }]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// Create a new recipe
export const createRecipe = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Recipe image is required' });
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer);

        // Parse JSON fields from form data
        const ingredients = JSON.parse(req.body.ingredients);
        const instructions = JSON.parse(req.body.instructions);
        const nutrition = JSON.parse(req.body.nutrition);

        // Create recipe
        const recipe = new Recipe({
            author: req.user.id,
            title: req.body.title,
            summary: req.body.summary,
            image: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
            servings: parseInt(req.body.servings),
            readyInMinutes: parseInt(req.body.readyInMinutes),
            ingredients,
            instructions,
            nutrition,
            vegetarian: req.body.vegetarian === 'true',
            vegan: req.body.vegan === 'true',
            glutenFree: req.body.glutenFree === 'true',
            dairyFree: req.body.dairyFree === 'true',
            pricePerServing: req.body.pricePerServing ? parseFloat(req.body.pricePerServing) : 0
        });

        await recipe.save();

        // Populate author info
        await recipe.populate('author', 'name email');

        res.status(201).json(recipe);
    } catch (err) {
        console.error('[CREATE_RECIPE_ERROR]', err);
        res.status(500).json({ msg: 'Server error creating recipe' });
    }
};

// Get all user recipes (public - for browse page)
export const getAllUserRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 12, search, vegetarian, vegan, glutenFree, dairyFree } = req.query;

        const query = {};

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Dietary filters
        if (vegetarian === 'true') query.vegetarian = true;
        if (vegan === 'true') query.vegan = true;
        if (glutenFree === 'true') query.glutenFree = true;
        if (dairyFree === 'true') query.dairyFree = true;

        const recipes = await Recipe.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Recipe.countDocuments(query);

        res.json({
            recipes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (err) {
        console.error('[GET_ALL_USER_RECIPES_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching recipes' });
    }
};

// Get logged-in user's recipes
export const getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.user.id })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (err) {
        console.error('[GET_MY_RECIPES_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching your recipes' });
    }
};

// Get single recipe by ID
export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'name email');

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (err) {
        console.error('[GET_RECIPE_BY_ID_ERROR]', err);
        res.status(500).json({ msg: 'Server error fetching recipe' });
    }
};

// Update recipe (owner only)
export const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Check ownership
        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to update this recipe' });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            if (recipe.cloudinaryId) {
                await cloudinary.uploader.destroy(recipe.cloudinaryId);
            }

            // Upload new image
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            recipe.image = uploadResult.secure_url;
            recipe.cloudinaryId = uploadResult.public_id;
        }

        // Update fields
        if (req.body.title) recipe.title = req.body.title;
        if (req.body.summary) recipe.summary = req.body.summary;
        if (req.body.servings) recipe.servings = parseInt(req.body.servings);
        if (req.body.readyInMinutes) recipe.readyInMinutes = parseInt(req.body.readyInMinutes);
        if (req.body.ingredients) recipe.ingredients = JSON.parse(req.body.ingredients);
        if (req.body.instructions) recipe.instructions = JSON.parse(req.body.instructions);
        if (req.body.nutrition) recipe.nutrition = JSON.parse(req.body.nutrition);
        if (req.body.vegetarian !== undefined) recipe.vegetarian = req.body.vegetarian === 'true';
        if (req.body.vegan !== undefined) recipe.vegan = req.body.vegan === 'true';
        if (req.body.glutenFree !== undefined) recipe.glutenFree = req.body.glutenFree === 'true';
        if (req.body.dairyFree !== undefined) recipe.dairyFree = req.body.dairyFree === 'true';
        if (req.body.pricePerServing) recipe.pricePerServing = parseFloat(req.body.pricePerServing);

        await recipe.save();
        await recipe.populate('author', 'name email');

        res.json(recipe);
    } catch (err) {
        console.error('[UPDATE_RECIPE_ERROR]', err);
        res.status(500).json({ msg: 'Server error updating recipe' });
    }
};

// Delete recipe (owner only)
export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Check ownership
        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this recipe' });
        }

        // Delete image from Cloudinary
        if (recipe.cloudinaryId) {
            await cloudinary.uploader.destroy(recipe.cloudinaryId);
        }

        await Recipe.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Recipe deleted successfully' });
    } catch (err) {
        console.error('[DELETE_RECIPE_ERROR]', err);
        res.status(500).json({ msg: 'Server error deleting recipe' });
    }
};
