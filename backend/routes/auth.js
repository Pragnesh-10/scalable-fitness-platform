const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, registerValidation, loginValidation } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter, authenticatedRateLimiter } = require('../middleware/security');

const methodNotAllowed = (req, res) =>
  res.status(405).json({ error: `Method ${req.method} not allowed on ${req.originalUrl}` });

router.post('/register', authRateLimiter, registerValidation, validate, register);
router.post('/login', authRateLimiter, loginValidation, validate, login);
router.post('/logout', authenticatedRateLimiter, logout);
router.get('/me', authenticate, authenticatedRateLimiter, getMe);
router.all('/register', methodNotAllowed);
router.all('/login', methodNotAllowed);
router.all('/logout', methodNotAllowed);
router.all('/me', methodNotAllowed);

module.exports = router;
