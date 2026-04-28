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
const { startWearableSync } = require('./services/wearableSync');

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/metrics', analyticsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/community', communityRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
// Error handler
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: 'Internal server error' }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FitPulse API → http://localhost:${PORT}`);
  startWearableSync();
});

module.exports = app;
