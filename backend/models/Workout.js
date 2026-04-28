const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reps: Number,
  sets: Number,
  weight: Number,
  durationSeconds: Number,
  distanceKm: Number,
  orderIndex: { type: Number, default: 0 },
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['cardio', 'strength', 'hiit', 'yoga', 'running', 'cycling', 'swimming', 'other'] },
  title: String,
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: Number,
  notes: String,
  exercises: [exerciseSchema],
  date: { type: Date, default: Date.now },
  source: { type: String, default: 'manual' }, // manual, fitbit, apple_health, etc.
}, { timestamps: true });

workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
