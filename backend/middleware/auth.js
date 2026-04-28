const jwt = require('jsonwebtoken');

const getCookieValue = (cookieHeader, key) => {
  if (!cookieHeader || typeof cookieHeader !== 'string') return null;

  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (rawKey === key) {
      return decodeURIComponent(rawValue.join('='));
    }
  }

  return null;
};

const authenticate = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Authentication is not configured' });
  }

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const cookieToken = getCookieValue(req.headers.cookie, 'fitpulse_token');
  const token = bearerToken && bearerToken !== authHeader.trim() ? bearerToken : cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
