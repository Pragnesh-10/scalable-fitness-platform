const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: Number,
  weight: Number,
  height: Number,
  fitnessGoals: { type: String, enum: ['fat_loss', 'muscle_gain', 'endurance', 'general_fitness', 'weight_maintenance'], default: 'general_fitness' },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  preferences: { workoutTypes: [String], preferredTime: String },
  deviceConnections: [{
    deviceType: { type: String, enum: ['apple_health', 'google_fit', 'fitbit', 'garmin', 'manual'] },
    accessToken: String,
    refreshToken: String,
    connectedAt: Date,
    isActive: { type: Boolean, default: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
