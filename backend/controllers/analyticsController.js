const { query } = require('../config/database');

// GET /metrics
const getMetrics = async (req, res) => {
  try {
    const { from, to, limit = 30 } = req.query;
    const userId = req.user.id;

    let sql = 'SELECT * FROM metrics WHERE user_id = $1';
    const params = [userId];
    let p = 2;

    if (from) { sql += ` AND date >= $${p++}`; params.push(from); }
    if (to) { sql += ` AND date <= $${p++}`; params.push(to); }
    sql += ` ORDER BY date DESC LIMIT $${p}`;
    params.push(parseInt(limit));

    const result = await query(sql, params);
    res.json({ metrics: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /metrics
const createMetric = async (req, res) => {
  try {
    const { heart_rate, steps, sleep_hours, calories_intake, calories_burned, water_ml, source, date } = req.body;
    const result = await query(
      `INSERT INTO metrics (user_id, heart_rate, steps, sleep_hours, calories_intake, calories_burned, water_ml, source, date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, heart_rate, steps, sleep_hours, calories_intake, calories_burned, water_ml, source || 'manual', date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ metric: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /analytics/weekly
const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [calories, workouts, steps, sleep] = await Promise.all([
      query(`SELECT date, SUM(calories_burned) as calories
             FROM workouts WHERE user_id=$1 AND date >= NOW()-INTERVAL '7 days'
             GROUP BY date ORDER BY date`, [userId]),
      query(`SELECT date, COUNT(*) as count, SUM(duration) as total_duration
             FROM workouts WHERE user_id=$1 AND date >= NOW()-INTERVAL '7 days'
             GROUP BY date ORDER BY date`, [userId]),
      query(`SELECT date, steps, heart_rate, sleep_hours
             FROM metrics WHERE user_id=$1 AND date >= NOW()-INTERVAL '7 days'
             ORDER BY date`, [userId]),
      query(`SELECT AVG(sleep_hours) as avg_sleep, AVG(heart_rate) as avg_hr, SUM(steps) as total_steps
             FROM metrics WHERE user_id=$1 AND date >= NOW()-INTERVAL '7 days'`, [userId]),
    ]);

    res.json({
      weeklyCalories: calories.rows,
      weeklyWorkouts: workouts.rows,
      dailyMetrics: steps.rows,
      summary: sleep.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /analytics/monthly
const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [monthlyWorkouts, monthlyCalories, progressByType] = await Promise.all([
      query(`SELECT DATE_TRUNC('week', date) as week, COUNT(*) as count, SUM(duration) as total_mins
             FROM workouts WHERE user_id=$1 AND date >= NOW()-INTERVAL '30 days'
             GROUP BY week ORDER BY week`, [userId]),
      query(`SELECT DATE_TRUNC('week', date) as week, SUM(calories_burned) as calories
             FROM workouts WHERE user_id=$1 AND date >= NOW()-INTERVAL '30 days'
             GROUP BY week ORDER BY week`, [userId]),
      query(`SELECT type, COUNT(*) as count, AVG(duration) as avg_duration, SUM(calories_burned) as calories
             FROM workouts WHERE user_id=$1 AND date >= NOW()-INTERVAL '30 days'
             GROUP BY type`, [userId]),
    ]);

    res.json({ monthlyWorkouts: monthlyWorkouts.rows, monthlyCalories: monthlyCalories.rows, progressByType: progressByType.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMetrics, createMetric, getWeeklyAnalytics, getMonthlyAnalytics };
