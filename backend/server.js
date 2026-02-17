import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import jobRoleRoutes from './routes/jobRoleRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { seedJobRoles } from './services/seedJobRoles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
      return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.get('/api/auth', (_, res) => res.json({ status: 'ok', message: 'Auth routes ready' }));

// 404 for unmatched API routes (helps debug)
app.use('/api', (_, res) => res.status(404).json({ error: 'API route not found' }));

// Start server immediately so it always responds (avoids "request failed" when MongoDB is slow)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-gap-platform';
  mongoose.connect(uri)
    .then(async () => {
      await seedJobRoles();
      console.log('MongoDB connected');
    })
    .catch((err) => console.error('MongoDB connection error:', err));
});
