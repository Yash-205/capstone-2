import express from 'express';
import { updateProfile, getProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/', protect, updateProfile);
router.get('/', protect, getProfile);

export default router;
