import express from 'express';
import {
  getShoppingList,
  addItemToShoppingList,
  removeItemFromShoppingList,
} from '../controllers/shoppingListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getShoppingList);
router.post('/', protect, addItemToShoppingList);
router.delete('/', protect, removeItemFromShoppingList);

export default router;
