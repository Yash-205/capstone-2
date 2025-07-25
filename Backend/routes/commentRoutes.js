import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get comments by foodId with user name
router.get('/:foodId', async (req, res) => {
  try {
    const comments = await Comment.find({ foodId: req.params.foodId })
      .sort({ createdAt: -1 })
      .populate('user', 'name'); 

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create comment (only if logged in)
router.post('/', protect, async (req, res) => {
  const { foodId, text } = req.body;

  if (!text || !foodId) return res.status(400).json({ msg: 'Text and Food ID required' });

  try {
    const newComment = await Comment.create({
      foodId,
      text,
      user: req.user.id, 
    });

    const populatedComment = await newComment.populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ msg: 'Could not post comment' });
  }
});

export default router;
