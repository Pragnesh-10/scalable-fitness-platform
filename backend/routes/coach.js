const express = require('express');
const router = express.Router();
const { getClients, assignPlan } = require('../controllers/coachController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/clients', getClients);
router.post('/assign-plan', assignPlan);

module.exports = router;
