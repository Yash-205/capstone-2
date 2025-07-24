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
      'Primal', 'Low FODMAP', 'Whole30',""
    ],
    default: ''
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
