const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, trim: true },
  description: String,
  avatar_url: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const challengeSchema = new mongoose.Schema({
  challengeName: { type: String, required: true },
  description: String,
  goalType: { type: String, enum: ['steps', 'calories', 'workouts', 'duration'], required: true },
  goalValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Virtual leaderboard sorted by progress
challengeSchema.virtual('leaderboard').get(function () {
  return [...this.participants].sort((a, b) => b.progress - a.progress);
});

module.exports = {
  Group: mongoose.model('Group', groupSchema),
  Post: mongoose.model('Post', postSchema),
  Challenge: mongoose.model('Challenge', challengeSchema),
};
