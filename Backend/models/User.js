// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dietPreference: {
    type: String,
    enum: ['', 'Vegetarian', 'Vegan'], // '' = Omnivore
    default: ''
  },
  shoppingList: [{ type: String }],

  // 🧡 Favorites Array
  favorites: [
    {
      id: String,     // recipe ID from API
      title: String,  // recipe title
      image: String   // recipe image
    }
  ],

  // 🏋️ Profile Completion Status
  profileCompleted: {
    type: Boolean,
    default: false
  },

  // 👤 Personal Information
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', '']
  },
  height: {
    type: Number, // in cm
    min: 50,
    max: 300
  },
  weight: {
    type: Number, // in kg
    min: 20,
    max: 500
  },

  // 💪 Fitness Information
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very active', ''],
    default: ''
  },
  fitnessGoal: {
    type: String,
    enum: ['weight loss', 'balanced', 'muscle gain', ''],
    default: ''
  },

  // 🍽️ Meal Preferences
  allergies: [{
    type: String
  }],
  preferredCuisines: [{
    type: String
  }],
  mealsPerDay: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
