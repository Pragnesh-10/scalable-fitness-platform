const express = require('express');
const router = express.Router();
const { generatePlan, getPlans, getActivePlan } = require('../controllers/planController');
const { authenticate } = require('../middleware/auth');
const { authenticatedRateLimiter } = require('../middleware/security');

router.use(authenticate, authenticatedRateLimiter);
router.post('/generate', generatePlan);
router.get('/', getPlans);
router.get('/active', getActivePlan);

module.exports = router;
