import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    // Author information
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Basic recipe information
    title: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        required: true
    },
    cloudinaryId: {
        type: String // For deletion from Cloudinary
    },

    // Cooking details
    servings: {
        type: Number,
        required: true,
        min: 1
    },
    readyInMinutes: {
        type: Number,
        required: true,
        min: 1
    },

    // Ingredients
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }],

    // Instructions
    instructions: [{
        step: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        }
    }],

    // Nutrition information
    nutrition: {
        calories: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        carbs: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        }
    },

    // Dietary flags
    vegetarian: {
        type: Boolean,
        default: false
    },
    vegan: {
        type: Boolean,
        default: false
    },
    glutenFree: {
        type: Boolean,
        default: false
    },
    dairyFree: {
        type: Boolean,
        default: false
    },

    // Price (optional)
    pricePerServing: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search
recipeSchema.index({ title: 'text', summary: 'text' });
recipeSchema.index({ author: 1 });
recipeSchema.index({ vegetarian: 1, vegan: 1, glutenFree: 1, dairyFree: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
