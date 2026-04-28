const rateLimit = require('express-rate-limit');

const { ipKeyGenerator } = rateLimit;

const parseCsvEnv = (value) =>
  (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const unique = (values) => [...new Set(values.filter(Boolean))];

const normalizeOrigin = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).origin;
  } catch {
    // Fall back for malformed values that are still usable as host strings.
    return trimmed.replace(/\/+$/, '');
  }
};

const toInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = unique([
  ...parseCsvEnv(process.env.CORS_ALLOWED_ORIGINS),
  process.env.FRONTEND_URL,
  process.env.PROD_FRONTEND_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  !isProduction ? 'http://localhost:3000' : null,
  !isProduction ? 'http://127.0.0.1:3000' : null,
  !isProduction ? 'http://localhost:5173' : null,
  !isProduction ? 'http://127.0.0.1:5173' : null,
].map(normalizeOrigin));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: ${normalizedOrigin || origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: [
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 86400,
};

const createRateLimiter = ({ windowMs, limit, message, keyGenerator }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: true,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
    skip: (req) => req.method === 'OPTIONS',
    keyGenerator,
    handler: (req, res, _next, options) => {
      // #region agent log
      fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H7',location:'backend/middleware/security.js:83',message:'rate limiter blocked request',data:{path:req.path,method:req.method,ip:req.ip,windowMs:options.windowMs},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      });
    },
  });

const globalIpRateLimiter = createRateLimiter({
  windowMs: toInteger(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  limit: toInteger(process.env.RATE_LIMIT_MAX, 100),
  message: 'Too many requests, please try again later.',
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});

const authRateLimiter = createRateLimiter({
  windowMs: toInteger(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60_000),
  limit: toInteger(process.env.AUTH_RATE_LIMIT_MAX, 10),
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});

const authenticatedRateLimiter = createRateLimiter({
  windowMs: toInteger(process.env.AUTHENTICATED_RATE_LIMIT_WINDOW_MS, 60_000),
  limit: toInteger(process.env.AUTHENTICATED_RATE_LIMIT_MAX, 300),
  message: 'Too many requests for this account, please slow down.',
  keyGenerator: (req) => (req.user?.id ? `user:${req.user.id}` : `ip:${ipKeyGenerator(req.ip)}`),
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return next();
};

module.exports = {
  allowedOrigins,
  authRateLimiter,
  authenticatedRateLimiter,
  corsOptions,
  globalIpRateLimiter,
  requireRole,
};