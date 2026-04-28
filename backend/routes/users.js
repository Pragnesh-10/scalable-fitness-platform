const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getStats } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);

module.exports = router;
