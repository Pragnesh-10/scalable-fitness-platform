const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: Number,
  heartRateZone: { type: String, enum: ['rest', 'fat_burn', 'cardio', 'peak'] },
  steps: Number,
  cadence: Number,      // steps per minute
  volume: Number,       // total weight lifted (kg)
  sleepHours: Number,
  caloriesIntake: Number,
  caloriesBurned: Number,
  waterMl: Number,
  performanceScore: Number, // 0-100 composite score
  source: { type: String, default: 'manual' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

metricsSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Metrics', metricsSchema);
