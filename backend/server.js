require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const analyticsRoutes = require('./routes/analytics');
const planRoutes = require('./routes/plans');
const communityRoutes = require('./routes/community');
const coachRoutes = require('./routes/coach');
const { startWearableSync } = require('./services/wearableSync');

const app = express();

// Connect MongoDB
connectDB();

// ============ SECURITY MIDDLEWARE ============
app.use(helmet()); // Security headers
app.use(compression()); // Response compression

// CORS Configuration - Tightened & Robust
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.PROD_FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: ${origin} is not allowed`));
    }
  },
  credentials: true, // Allow cookies & auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours - preflight cache
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/analytics', analyticsRoutes); // Primary endpoint for analytics
app.use('/api/plans', planRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/coach', coachRoutes);

// ============ ERROR HANDLING ============
// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found', path: req.path }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FitPulse API → http://localhost:${PORT}`);
  console.log(`✅ CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
  startWearableSync();
});

module.exports = app;
