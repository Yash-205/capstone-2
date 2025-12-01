import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    recipeId: {
        type: Number,
        required: true
    },
    recipeName: {
        type: String,
        required: true
    },
    recipeImage: {
        type: String
    },
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
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        default: 'snack'
    },
    loggedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
mealLogSchema.index({ userId: 1, date: 1 });

export default mongoose.model('MealLog', mealLogSchema);
