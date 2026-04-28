const express = require('express');
const router = express.Router();
const { getClients, assignPlan } = require('../controllers/coachController');
const { authenticate } = require('../middleware/auth');
const { authenticatedRateLimiter, requireRole } = require('../middleware/security');

router.use(authenticate, authenticatedRateLimiter, requireRole('coach'));
router.get('/clients', getClients);
router.post('/assign-plan', assignPlan);

module.exports = router;
