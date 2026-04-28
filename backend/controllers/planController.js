const { query } = require('../config/database');

// Rule-based plan generator
const generatePlanSchedule = (goal, level, durationWeeks) => {
  const daysPerWeek = { beginner: 3, intermediate: 5, advanced: 6 }[level] || 3;

  const goalWorkouts = {
    fat_loss: ['HIIT Cardio', 'Circuit Training', 'Running', 'Jump Rope', 'Cycling'],
    muscle_gain: ['Chest & Triceps', 'Back & Biceps', 'Legs & Shoulders', 'Full Body Strength', 'Arms & Core'],
    endurance: ['Long Run', 'Cycling', 'Swimming', 'Rowing', 'Tempo Run'],
    general_fitness: ['Full Body Workout', 'Cardio Session', 'Strength Training', 'Yoga & Flexibility', 'HIIT'],
    weight_maintenance: ['Moderate Cardio', 'Light Strength', 'Yoga', 'Walking', 'Pilates'],
  };

  const workoutPool = goalWorkouts[goal] || goalWorkouts.general_fitness;
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const restDays = allDays.length - daysPerWeek;

  // Distribute workout days evenly
  const schedule = {};
  for (let week = 1; week <= durationWeeks; week++) {
    schedule[`week_${week}`] = allDays.map((day, idx) => {
      const isRest = idx >= daysPerWeek;
      return {
        day,
        type: isRest ? 'Rest' : workoutPool[idx % workoutPool.length],
        duration: isRest ? 0 : (level === 'beginner' ? 30 : level === 'intermediate' ? 45 : 60),
        intensity: isRest ? null : (level === 'beginner' ? 'Low' : level === 'intermediate' ? 'Moderate' : 'High'),
      };
    });
  }

  return { schedule, daysPerWeek, restDays };
};

// POST /plans/generate
const generatePlan = async (req, res) => {
  try {
    const { plan_type, difficulty, duration_weeks = 4 } = req.body;
    const userId = req.user.id;

    // Get user profile
    const userResult = await query('SELECT fitness_goal, experience_level FROM users WHERE id=$1', [userId]);
    const user = userResult.rows[0];

    const goal = plan_type || user?.fitness_goal || 'general_fitness';
    const level = difficulty || user?.experience_level || 'beginner';

    const { schedule, daysPerWeek } = generatePlanSchedule(goal, level, duration_weeks);

    // Deactivate previous plans
    await query('UPDATE plans SET is_active=false WHERE user_id=$1', [userId]);

    const result = await query(
      `INSERT INTO plans (user_id, plan_type, difficulty, duration_weeks, schedule)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, goal, level, duration_weeks, JSON.stringify(schedule)]
    );

    res.status(201).json({
      plan: result.rows[0],
      summary: { goal, level, daysPerWeek, totalWeeks: duration_weeks },
    });
  } catch (err) {
    console.error('Generate plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /plans
const getPlans = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM plans WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ plans: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /plans/active
const getActivePlan = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM plans WHERE user_id=$1 AND is_active=true ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
    res.json({ plan: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { generatePlan, getPlans, getActivePlan };
