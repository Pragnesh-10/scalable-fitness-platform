const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: String,
  type: String,
  duration: Number,
  intensity: String,
  exercises: [{ name: String, sets: Number, reps: String, rest: String }],
});

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planType: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  durationWeeks: { type: Number, default: 4 },
  schedule: { type: Map, of: [daySchema] },
  recommendations: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
