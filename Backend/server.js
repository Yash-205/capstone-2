import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';
dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'https://recipe-finder-orpin-pi.vercel.app',
  'https://recipe-finder-9i8xcppd4-yash-205s-projects.vercel.app/',
  "https://recipe-finder-cdavlr7zl-yash-205s-projects.vercel.app/",
  "https://recipe-finder-deciwpi68-yash-205s-projects.vercel.app/"
];
// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/shopping-list', shoppingListRoutes);


// Server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
