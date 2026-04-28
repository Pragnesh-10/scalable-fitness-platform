const cron = require('node-cron');
const { query } = require('../config/database');

// Simulate wearable data sync (replace with real API calls)
const syncWearableData = async () => {
  console.log('🔄 Running wearable sync job...');
  try {
    // TODO: Replace with real Apple HealthKit / Google Fit / Fitbit API calls
    // Pattern: fetch user tokens → call wearable APIs → upsert into metrics table
    const usersResult = await query(
      `SELECT id FROM users WHERE updated_at >= NOW() - INTERVAL '30 days'`
    );

    for (const user of usersResult.rows) {
      // Placeholder: In production, fetch from HealthKit/Google Fit APIs using stored OAuth tokens
      console.log(`  Syncing user ${user.id}...`);
    }

    console.log('✅ Wearable sync completed');
  } catch (err) {
    console.error('❌ Wearable sync failed:', err.message);
  }
};

// Run every 6 hours
const startWearableSync = () => {
  cron.schedule('0 */6 * * *', syncWearableData, {
    scheduled: true,
    timezone: 'UTC',
  });
  console.log('⏰ Wearable sync cron job started (every 6 hours)');
};

module.exports = { startWearableSync, syncWearableData };
