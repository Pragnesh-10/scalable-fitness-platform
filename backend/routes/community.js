const express = require('express');
const router = express.Router();
const {
  getGroups, createGroup, joinGroup, leaveGroup, getGroupPosts, createPost,
  getChallenges, createChallenge, joinChallenge, getLeaderboard
} = require('../controllers/communityController');
const { authenticate } = require('../middleware/auth');
const { authenticatedRateLimiter } = require('../middleware/security');

router.use(authenticate, authenticatedRateLimiter);

// Groups
router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.post('/groups/:id/join', joinGroup);
router.post('/groups/:id/leave', leaveGroup);
router.get('/groups/:id/posts', getGroupPosts);
router.post('/groups/:id/posts', createPost);

// Challenges
router.get('/challenges', getChallenges);
router.post('/challenges', createChallenge);
router.post('/challenges/:id/join', joinChallenge);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
