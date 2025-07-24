import User from '../models/User.js';

// GET /api/shopping-list
export const getShoppingList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('shoppingList');
    res.json({ shoppingList: user.shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to get shopping list' });
  }
};

// POST /api/shopping-list
export const addItemToShoppingList = async (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ msg: 'Item is required' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { shoppingList: item } },
      { new: true }
    );
    res.json({ shoppingList: user.shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add item' });
  }
};

// DELETE /api/shopping-list
export const removeItemFromShoppingList = async (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ msg: 'Item is required' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { shoppingList: item } },
      { new: true }
    );
    res.json({ shoppingList: user.shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to remove item' });
  }
};
