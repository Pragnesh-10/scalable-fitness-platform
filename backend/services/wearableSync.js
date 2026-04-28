const cron = require('node-cron');
const Metrics = require('../models/Metrics');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Simulate fetching wearable data — replace with real API calls
const simulateWearableData = (userId) => ({
  userId,
  heartRate: Math.floor(Math.random() * 40) + 60,
  steps: Math.floor(Math.random() * 5000) + 3000,
  caloriesBurned: Math.floor(Math.random() * 300) + 100,
  sleepHours: parseFloat((Math.random() * 3 + 5).toFixed(1)),
  source: 'simulated',
  date: new Date(),
});

const syncWearableData = async () => {
  console.log('🔄 Running wearable sync...');
  try {
    const profiles = await Profile.find({
      'deviceConnections.isActive': true,
    }).populate('userId', '_id');

    for (const profile of profiles) {
      const data = simulateWearableData(profile.userId._id);
      await Metrics.create(data);
    }
    console.log(`✅ Synced ${profiles.length} users`);
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  }
};

const startWearableSync = () => {
  cron.schedule('0 */6 * * *', syncWearableData, { scheduled: true, timezone: 'UTC' });
  console.log('⏰ Wearable sync cron started (every 6h)');
};

module.exports = { startWearableSync, syncWearableData };
