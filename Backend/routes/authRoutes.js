import express from 'express';
import { signup, login, getMe, logout,updateUserDiet  } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.put('/diet', protect, updateUserDiet); 

export default router;
