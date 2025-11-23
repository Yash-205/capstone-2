// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dietPreference: {
    type: String,
    enum: [
      'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
      'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo',
      'Primal', 'Low FODMAP', 'Whole30', ''
    ],
    default: ''
  },
  shoppingList: [{ type: String }],

  // 🧡 New Favorites Array
  favorites: [
    {
      id: String,     // recipe ID from API
      title: String,  // recipe title
      image: String   // recipe image
    }
  ]
});

export default mongoose.models.User || mongoose.model('User', userSchema);
