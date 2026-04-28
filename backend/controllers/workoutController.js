const Workout = require('../models/Workout');
const mongoose = require('mongoose');

const toObjId = (id) => new mongoose.Types.ObjectId(id);

// POST /workouts
const createWorkout = async (req, res) => {
  try {
    const { type, title, duration, caloriesBurned, notes, date, exercises } = req.body;
    const workout = await Workout.create({
      userId: req.user.id, type, title, duration, caloriesBurned, notes,
      date: date ? new Date(date) : new Date(), exercises: exercises || [],
    });
    res.status(201).json({ workout, message: 'Workout logged!' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Create failed' }); }
};

// GET /workouts
const getWorkouts = async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, from, to } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const [workouts, total] = await Promise.all([
      Workout.find(filter).sort({ date: -1 }).skip(parseInt(offset)).limit(parseInt(limit)),
      Workout.countDocuments(filter),
    ]);
    res.json({ workouts, total });
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
};

// GET /workouts/:id
const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id });
    if (!workout) return res.status(404).json({ error: 'Not found' });
    res.json({ workout });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

// PUT /workouts/:id
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body }, { new: true }
    );
    if (!workout) return res.status(404).json({ error: 'Not found' });
    res.json({ workout });
  } catch (err) { res.status(500).json({ error: 'Update failed' }); }
};

// DELETE /workouts/:id
const deleteWorkout = async (req, res) => {
  try {
    const result = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Delete failed' }); }
};

module.exports = { createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout };
