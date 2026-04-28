const express = require('express');
const router = express.Router();
const { register, login, getMe, registerValidation, loginValidation } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter, authenticatedRateLimiter } = require('../middleware/security');

router.post('/register', authRateLimiter, registerValidation, validate, register);
router.post('/login', authRateLimiter, loginValidation, validate, login);
router.get('/me', authenticate, authenticatedRateLimiter, getMe);

module.exports = router;
