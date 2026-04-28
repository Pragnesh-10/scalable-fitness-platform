const Plan = require('../models/Plan');
const Profile = require('../models/Profile');

const PLAN_TEMPLATES = {
  fat_loss: {
    beginner: ['HIIT Cardio 30min', 'Circuit Training', 'Rest', 'Jump Rope 30min', 'Rest', 'Light Run', 'Rest'],
    intermediate: ['HIIT 45min', 'Strength Circuit', 'Cardio 40min', 'Rest', 'HIIT 45min', 'Full Body', 'Rest'],
    advanced: ['HIIT 60min', 'Strength + Cardio', 'HIIT 60min', 'Rest', 'Full Body HIIT', 'Cardio 60min', 'Active Rest'],
  },
  muscle_gain: {
    beginner: ['Chest & Triceps', 'Rest', 'Back & Biceps', 'Rest', 'Legs & Shoulders', 'Rest', 'Rest'],
    intermediate: ['Chest & Triceps', 'Back & Biceps', 'Rest', 'Legs', 'Shoulders & Arms', 'Rest', 'Rest'],
    advanced: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Full Body', 'Rest'],
  },
  endurance: {
    beginner: ['Easy Run 20min', 'Rest', 'Cycling 30min', 'Rest', 'Tempo Run 20min', 'Rest', 'Rest'],
    intermediate: ['Tempo Run 40min', 'Cross-train', 'Long Run 50min', 'Rest', 'Interval Run', 'Long Ride', 'Rest'],
    advanced: ['Tempo 60min', 'Speed Work', 'Long Run 90min', 'Cross-train', 'Interval Run', 'Long Ride 120min', 'Rest'],
  },
  general_fitness: {
    beginner: ['Full Body 30min', 'Rest', 'Cardio 20min', 'Rest', 'Yoga & Stretch', 'Rest', 'Rest'],
    intermediate: ['Strength 45min', 'Cardio 30min', 'Rest', 'Full Body 45min', 'Cardio 30min', 'Rest', 'Rest'],
    advanced: ['Strength 60min', 'HIIT 45min', 'Cardio 60min', 'Strength 60min', 'HIIT 45min', 'Long Cardio', 'Rest'],
  },
};

const RECOMMENDATIONS = {
  fat_loss: ['Keep calorie deficit of 300-500 kcal/day', 'Prioritize protein (1.6g/kg body weight)', 'Stay hydrated — 3L+ water daily', 'Get 7-9 hours of sleep'],
  muscle_gain: ['Eat in a 300-500 kcal surplus', 'Consume 2g protein/kg body weight', 'Progressive overload — increase weight weekly', 'Rest 48-72h between same muscle groups'],
  endurance: ['Build mileage by no more than 10% per week', 'Include recovery runs and rest days', 'Fuel with complex carbs before long runs', 'Monitor heart rate zones during training'],
  general_fitness: ['Aim for 150 mins moderate activity/week', 'Mix cardio and strength training', 'Track daily steps — target 8,000–10,000', 'Prioritize sleep and recovery'],
};

const generatePlan = async (req, res) => {
  try {
    const { plan_type, difficulty, duration_weeks = 4 } = req.body;
    const profile = await Profile.findOne({ userId: req.user.id });

    const goal = plan_type || profile?.fitnessGoals || 'general_fitness';
    const level = difficulty || profile?.experienceLevel || 'beginner';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const template = PLAN_TEMPLATES[goal]?.[level] || PLAN_TEMPLATES.general_fitness.beginner;
    const durations = { beginner: 30, intermediate: 45, advanced: 60 };

    const schedule = {};
    for (let w = 1; w <= duration_weeks; w++) {
      schedule[`week_${w}`] = days.map((day, i) => ({
        day,
        type: template[i],
        duration: template[i] === 'Rest' ? 0 : durations[level],
        intensity: template[i] === 'Rest' ? null : level,
      }));
    }

    await Plan.updateMany({ userId: req.user.id }, { isActive: false });
    const plan = await Plan.create({
      userId: req.user.id,
      planType: goal,
      difficulty: level,
      durationWeeks: duration_weeks,
      schedule,
      recommendations: RECOMMENDATIONS[goal] || [],
    });

    res.status(201).json({ plan, summary: { goal, level, daysPerWeek: template.filter(d => d !== 'Rest').length } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Plan generation failed' }); }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const getActivePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ userId: req.user.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ plan: plan || null });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

module.exports = { generatePlan, getPlans, getActivePlan };
