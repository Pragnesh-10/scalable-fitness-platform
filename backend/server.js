require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');
const connectDB = require('./config/database');
const mongoose = require('mongoose');
const { validateEnvironment } = require('./config/env');
const { corsOptions, globalIpRateLimiter, allowedOrigins } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const analyticsRoutes = require('./routes/analytics');
const planRoutes = require('./routes/plans');
const communityRoutes = require('./routes/community');
const coachRoutes = require('./routes/coach');
const { startWearableSync } = require('./services/wearableSync');

const app = express();
let envConfig;
try {
  envConfig = validateEnvironment();
} catch (error) {
  console.error('❌ Startup validation failed:', error.message);
  process.exit(1);
}

// Connect MongoDB
connectDB();
app.set('trust proxy', envConfig.trustProxy);

// ============ SECURITY MIDDLEWARE ============
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.disable('x-powered-by');

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors(corsOptions)(req, res, next);
  }

  return next();
});
app.use(globalIpRateLimiter);
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});
morgan.token('request_id', (req) => req.requestId);
morgan.token('client_ip', (req) => req.ip);
const productionLogFormat = JSON.stringify({
  time: ':date[iso]',
  requestId: ':request_id',
  method: ':method',
  path: ':url',
  status: ':status',
  responseTimeMs: ':response-time',
  contentLength: ':res[content-length]',
  ip: ':client_ip',
  userAgent: ':user-agent',
});
app.use(morgan(envConfig.isProduction ? productionLogFormat : 'dev', {
  skip: (req) => req.path === '/health' || req.path === '/health/live',
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health/live', (req, res) => {
  res.json({
    status: 'UP',
    service: 'fitpulse-api',
    timestamp: new Date().toISOString(),
  });
});
app.get('/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  const status = dbReady ? 'UP' : 'DEGRADED';

  res.status(dbReady ? 200 : 503).json({
    status,
    service: 'fitpulse-api',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      database: dbReady ? 'UP' : 'DOWN',
    },
  });
});

// ============ API ROUTES ============
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'FitPulse API is running',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/logout', '/api/auth/me'],
      user: ['/api/user/profile', '/api/user/stats'],
      workouts: ['/api/workouts'],
      analytics: ['/api/analytics/weekly', '/api/analytics/monthly'],
      plans: ['/api/plans/active', '/api/plans/generate'],
      community: ['/api/community/leaderboard', '/api/community/challenges'],
      coach: ['/api/coach/clients', '/api/coach/assign-plan'],
    },
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/analytics', analyticsRoutes); // Primary endpoint for analytics
app.use('/api/plans', planRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/coach', coachRoutes);

// ============ ERROR HANDLING ============
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error', {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
    message: err.message,
  });
  
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
  console.log(`✅ Environment: ${envConfig.nodeEnv}`);
  console.log(`✅ Trust Proxy: ${envConfig.trustProxy}`);
  startWearableSync();
});

module.exports = app;
