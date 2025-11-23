// controllers/favoriteController.js
import User from '../models/User.js';

// ✅ Add favorite
export const addFavorite = async (req, res) => {
  try {
    const { id, title, image } = req.body;

    if (!id || !title)
      return res.status(400).json({ msg: 'Recipe ID and title are required' });

    const user = await User.findById(req.user.id);

    // Prevent duplicates
    const already = user.favorites.find(fav => fav.id === id);
    if (already)
      return res.status(400).json({ msg: 'Recipe already in favorites' });

    user.favorites.push({ id, title, image });
    await user.save();

    res.status(201).json({ msg: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Get all favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(fav => fav.id !== id);
    await user.save();

    res.status(200).json({ msg: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
