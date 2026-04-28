const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;
