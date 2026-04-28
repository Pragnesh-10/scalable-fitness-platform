const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getStats } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authenticatedRateLimiter } = require('../middleware/security');

router.use(authenticate, authenticatedRateLimiter);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);

module.exports = router;
