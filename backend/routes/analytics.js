const express = require('express');
const router = express.Router();
const { getMetrics, createMetric, getWeeklyAnalytics, getMonthlyAnalytics } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getMetrics);
router.post('/', createMetric);
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly', getMonthlyAnalytics);

module.exports = router;
