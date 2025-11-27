import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

dotenv.config();
connectDB();

const app = express();

// // Dynamic CORS origin matching
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin || // allow mobile/postman
      origin.includes('localhost') ||
      origin.startsWith('https://recipe-finder') // matches all recipe-finder Vercel preview URLs
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/favorites', favoriteRoutes);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
