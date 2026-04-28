const Metrics = require('../models/Metrics');
const Workout = require('../models/Workout');
const mongoose = require('mongoose');

const toObjId = (id) => new mongoose.Types.ObjectId(id);

// POST /metrics
const createMetric = async (req, res) => {
  try {
    const metric = await Metrics.create({ userId: req.user.id, ...req.body });
    res.status(201).json({ metric });
  } catch (err) { res.status(500).json({ error: 'Create failed' }); }
};

// GET /metrics
const getMetrics = async (req, res) => {
  try {
    const { from, to, limit = 30 } = req.query;
    const filter = { userId: req.user.id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const metrics = await Metrics.find(filter).sort({ date: -1 }).limit(parseInt(limit));
    res.json({ metrics });
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
};

// GET /analytics/weekly
const getWeeklyAnalytics = async (req, res) => {
  try {
    const uid = toObjId(req.user.id);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [weeklyCalories, weeklyWorkouts, dailyMetrics, weekSummary] = await Promise.all([
      Workout.aggregate([
        { $match: { userId: uid, date: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, calories: { $sum: '$caloriesBurned' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Workout.aggregate([
        { $match: { userId: uid, date: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, totalDuration: { $sum: '$duration' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Metrics.find({ userId: uid, date: { $gte: sevenDaysAgo } }).sort({ date: 1 }),
      Metrics.aggregate([
        { $match: { userId: uid, date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, avgHR: { $avg: '$heartRate' }, totalSteps: { $sum: '$steps' }, avgSleep: { $avg: '$sleepHours' }, avgCadence: { $avg: '$cadence' } } },
      ]),
    ]);

    res.json({ weeklyCalories, weeklyWorkouts, dailyMetrics, summary: weekSummary[0] || {} });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Analytics failed' }); }
};

// GET /analytics/monthly
const getMonthlyAnalytics = async (req, res) => {
  try {
    const uid = toObjId(req.user.id);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [monthlyWorkouts, progressByType, monthlyCalories] = await Promise.all([
      Workout.aggregate([
        { $match: { userId: uid, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $week: '$date' }, count: { $sum: 1 }, totalMinutes: { $sum: '$duration' } } },
        { $sort: { _id: 1 } },
      ]),
      Workout.aggregate([
        { $match: { userId: uid, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$type', count: { $sum: 1 }, avgDuration: { $avg: '$duration' }, totalCalories: { $sum: '$caloriesBurned' } } },
      ]),
      Workout.aggregate([
        { $match: { userId: uid, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $week: '$date' }, calories: { $sum: '$caloriesBurned' } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ monthlyWorkouts, progressByType, monthlyCalories });
  } catch (err) { res.status(500).json({ error: 'Monthly analytics failed' }); }
};

module.exports = { createMetric, getMetrics, getWeeklyAnalytics, getMonthlyAnalytics };
