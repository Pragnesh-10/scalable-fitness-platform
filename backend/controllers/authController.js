const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
];
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, role });
    await Profile.create({ userId: user._id });

    const token = generateToken(user);
    res.status(201).json({ message: 'Account created!', token, user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ message: 'Login successful', token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// GET /auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getMe, registerValidation, loginValidation };
