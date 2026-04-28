const { query } = require('../config/database');

// GET /groups
const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT g.*, 
        CASE WHEN gm.user_id IS NOT NULL THEN true ELSE false END as is_member
       FROM groups g
       LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = $1
       ORDER BY g.member_count DESC`,
      [userId]
    );
    res.json({ groups: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /groups
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const result = await query(
      'INSERT INTO groups (name, description, created_by, member_count) VALUES ($1,$2,$3,1) RETURNING *',
      [name, description, userId]
    );
    const group = result.rows[0];

    await query('INSERT INTO group_members (group_id, user_id) VALUES ($1,$2)', [group.id, userId]);
    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /groups/:id/join
const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await query('INSERT INTO group_members (group_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [id, userId]);
    await query('UPDATE groups SET member_count = member_count + 1 WHERE id = $1', [id]);
    res.json({ message: 'Joined group!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /groups/:id/leave
const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM group_members WHERE group_id=$1 AND user_id=$2', [id, req.user.id]);
    await query('UPDATE groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = $1', [id]);
    res.json({ message: 'Left group' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /groups/:id/posts
const getGroupPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.*, u.name as author_name, u.avatar_url as author_avatar
       FROM group_posts p JOIN users u ON u.id = p.user_id
       WHERE p.group_id = $1 ORDER BY p.created_at DESC LIMIT 50`,
      [id]
    );
    res.json({ posts: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /groups/:id/posts
const createPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const result = await query(
      'INSERT INTO group_posts (group_id, user_id, content) VALUES ($1,$2,$3) RETURNING *',
      [id, req.user.id, content]
    );
    res.status(201).json({ post: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /challenges
const getChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT c.*, cp.current_progress, cp.completed,
        CASE WHEN cp.user_id IS NOT NULL THEN true ELSE false END as is_joined
       FROM challenges c
       LEFT JOIN challenge_participants cp ON cp.challenge_id = c.id AND cp.user_id = $1
       WHERE c.end_date >= CURRENT_DATE ORDER BY c.start_date`,
      [userId]
    );
    res.json({ challenges: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /challenges
const createChallenge = async (req, res) => {
  try {
    const { title, description, goal_type, goal_value, start_date, end_date } = req.body;
    const result = await query(
      'INSERT INTO challenges (title, description, goal_type, goal_value, start_date, end_date, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, description, goal_type, goal_value, start_date, end_date, req.user.id]
    );
    res.status(201).json({ challenge: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /challenges/:id/join
const joinChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      'INSERT INTO challenge_participants (challenge_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [id, req.user.id]
    );
    res.json({ message: 'Joined challenge!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { challenge_id } = req.query;
    let result;

    if (challenge_id) {
      result = await query(
        `SELECT u.name, u.avatar_url, cp.current_progress, cp.completed
         FROM challenge_participants cp JOIN users u ON u.id = cp.user_id
         WHERE cp.challenge_id = $1 ORDER BY cp.current_progress DESC LIMIT 20`,
        [challenge_id]
      );
    } else {
      result = await query(
        `SELECT u.name, u.avatar_url, COUNT(w.id) as workout_count,
         COALESCE(SUM(w.calories_burned),0) as total_calories
         FROM users u LEFT JOIN workouts w ON w.user_id = u.id AND w.date >= NOW()-INTERVAL '30 days'
         GROUP BY u.id, u.name, u.avatar_url ORDER BY workout_count DESC LIMIT 20`
      );
    }

    res.json({ leaderboard: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getGroups, createGroup, joinGroup, leaveGroup, getGroupPosts, createPost, getChallenges, createChallenge, joinChallenge, getLeaderboard };
