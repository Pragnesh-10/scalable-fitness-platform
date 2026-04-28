const User = require('../models/User');
const Profile = require('../models/Profile');
const Plan = require('../models/Plan');
const Workout = require('../models/Workout');
const Metrics = require('../models/Metrics');

const getClients = async (req, res) => {
  try {
    if (req.user.role !== 'coach') return res.status(403).json({ error: 'Unauthorized' });

    // In a real app, there would be an "Assignment" collection connecting coach to user.
    // For this MVP, we fetch all 'user' roles to represent available clients for the coach.
    const clients = await User.find({ role: 'user' }).select('name email avatar_url');
    
    // Attach minimal latest metrics/profile
    const clientData = await Promise.all(clients.map(async (client) => {
       const profile = await Profile.findOne({ userId: client._id });
       const latestWorkout = await Workout.findOne({ userId: client._id }).sort({ date: -1 });
       return {
         ...client.toObject(),
         goal: profile?.fitnessGoals || 'None set',
         level: profile?.experienceLevel || 'beginner',
         lastWorkout: latestWorkout ? latestWorkout.date : null,
       };
    }));

    res.json({ clients: clientData });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching clients' });
  }
};

const assignPlan = async (req, res) => {
  try {
    if (req.user.role !== 'coach') return res.status(403).json({ error: 'Unauthorized' });
    const { clientId, planType, difficulty, weeks } = req.body;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};
    for(let w=1; w<=weeks; w++) {
      schedule[`week_${w}`] = days.map(day => ({ 
        day, type: 'Coach Assigned', duration: 45, intensity: difficulty 
      }));
    }

    await Plan.updateMany({ userId: clientId }, { isActive: false });
    const plan = await Plan.create({
      userId: clientId,
      coachId: req.user.id,
      planType,
      difficulty,
      durationWeeks: weeks,
      schedule,
      recommendations: ['Follow coach plan precisely', 'Check in weekly'],
    });

    res.status(201).json({ plan, message: 'Custom plan assigned successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign plan' });
  }
};

module.exports = { getClients, assignPlan };
