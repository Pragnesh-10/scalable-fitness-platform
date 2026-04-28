const User = require('../models/User');
const Profile = require('../models/Profile');
const Workout = require('../models/Workout');
const Metrics = require('../models/Metrics');
const mongoose = require('mongoose');

const getProfile = async (req, res) => {
  try {
    const [user, profile] = await Promise.all([
      User.findById(req.user.id),
      Profile.findOne({ userId: req.user.id }),
    ]);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ user: user.toSafeObject(), profile });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const updateProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const profileFields = ['age', 'weight', 'height', 'fitnessGoals', 'experienceLevel', 'preferences', 'deviceConnections'];
    const profileUpdate = {};
    profileFields.forEach(f => { if (req.body[f] !== undefined) profileUpdate[f] = req.body[f]; });

    const [user, profile] = await Promise.all([
      name ? User.findByIdAndUpdate(req.user.id, { name }, { new: true }) : User.findById(req.user.id),
      Profile.findOneAndUpdate({ userId: req.user.id }, profileUpdate, { new: true, upsert: true }),
    ]);
    res.json({ user: user.toSafeObject(), profile });
  } catch (err) { res.status(500).json({ error: 'Update failed' }); }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const [workoutStats, metricStats, recentWorkouts] = await Promise.all([
      Workout.aggregate([
        { $match: { userId: userObjectId, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: 1 }, totalCalories: { $sum: '$caloriesBurned' }, totalMinutes: { $sum: '$duration' } } },
      ]),
      Metrics.aggregate([
        { $match: { userId: userObjectId, date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, avgHR: { $avg: '$heartRate' }, totalSteps: { $sum: '$steps' }, avgSleep: { $avg: '$sleepHours' } } },
      ]),
      Workout.countDocuments({ userId, date: { $gte: thirtyDaysAgo } }),
    ]);

    const ws = workoutStats[0] || {};
    const ms = metricStats[0] || {};
    res.json({
      totalWorkouts: ws.total || 0,
      totalCalories: ws.totalCalories || 0,
      totalMinutes: ws.totalMinutes || 0,
      avgHeartRate: Math.round(ms.avgHR || 0),
      totalSteps: ms.totalSteps || 0,
      avgSleep: parseFloat((ms.avgSleep || 0).toFixed(1)),
      streak: recentWorkouts,
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Stats failed' }); }
};

module.exports = { getProfile, updateProfile, getStats };
