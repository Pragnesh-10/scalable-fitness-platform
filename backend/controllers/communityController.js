const { Group, Post, Challenge } = require('../models/Community');
const User = require('../models/User');
const Workout = require('../models/Workout');

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('createdBy', 'name avatar_url').sort({ createdAt: -1 });
    const withMembership = groups.map(g => ({
      ...g.toObject(),
      is_member: g.members.some(m => m.toString() === req.user.id),
      member_count: g.members.length,
    }));
    res.json({ groups: withMembership });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const createGroup = async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, createdBy: req.user.id, members: [req.user.id] });
    res.status(201).json({ group });
  } catch (err) { res.status(500).json({ error: 'Create failed' }); }
};

const joinGroup = async (req, res) => {
  try {
    await Group.findByIdAndUpdate(req.params.id, { $addToSet: { members: req.user.id } });
    res.json({ message: 'Joined!' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const leaveGroup = async (req, res) => {
  try {
    await Group.findByIdAndUpdate(req.params.id, { $pull: { members: req.user.id } });
    res.json({ message: 'Left group' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const getGroupPosts = async (req, res) => {
  try {
    const posts = await Post.find({ groupId: req.params.id })
      .populate('userId', 'name avatar_url').sort({ createdAt: -1 }).limit(50);
    res.json({ posts });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create({ groupId: req.params.id, userId: req.user.id, content: req.body.content });
    await post.populate('userId', 'name avatar_url');
    res.status(201).json({ post });
  } catch (err) { res.status(500).json({ error: 'Create failed' }); }
};

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ endDate: { $gte: new Date() } })
      .populate('createdBy', 'name').sort({ startDate: 1 });
    const withStatus = challenges.map(c => ({
      ...c.toObject(),
      is_joined: c.participants.some(p => p.userId?.toString() === req.user.id),
      participant_count: c.participants.length,
    }));
    res.json({ challenges: withStatus });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ challenge });
  } catch (err) { res.status(500).json({ error: 'Create failed' }); }
};

const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Not found' });
    const alreadyJoined = challenge.participants.some(p => p.userId?.toString() === req.user.id);
    if (!alreadyJoined) {
      challenge.participants.push({ userId: req.user.id });
      await challenge.save();
    }
    res.json({ message: 'Joined challenge!' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const getLeaderboard = async (req, res) => {
  try {
    const { challenge_id } = req.query;
    if (challenge_id) {
      const challenge = await Challenge.findById(challenge_id)
        .populate('participants.userId', 'name avatar_url');
      const sorted = [...challenge.participants].sort((a, b) => b.progress - a.progress);
      return res.json({ leaderboard: sorted });
    }
    // Global leaderboard by workout count
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const leaderboard = await Workout.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$userId', workoutCount: { $sum: 1 }, totalCalories: { $sum: '$caloriesBurned' } } },
      { $sort: { workoutCount: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', avatar_url: '$user.avatar_url', workoutCount: 1, totalCalories: 1 } },
    ]);
    res.json({ leaderboard });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

module.exports = { getGroups, createGroup, joinGroup, leaveGroup, getGroupPosts, createPost, getChallenges, createChallenge, joinChallenge, getLeaderboard };
