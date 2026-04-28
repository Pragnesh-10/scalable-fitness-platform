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

const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = process.env.AUTH_COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const maxAgeMs = Number.parseInt(process.env.AUTH_COOKIE_MAX_AGE_MS || '', 10) || 7 * 24 * 60 * 60 * 1000;

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: '/',
    maxAge: maxAgeMs,
  };

  if (process.env.AUTH_COOKIE_DOMAIN) {
    options.domain = process.env.AUTH_COOKIE_DOMAIN;
  }

  return options;
};

const clearAuthCookieOptions = () => {
  const options = getAuthCookieOptions();
  return {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  };
};

// POST /auth/register
const register = async (req, res) => {
  let createdUserId = null;

  try {
    const { name, email, password } = req.body;
    const requestedRole = String(req.body.role || 'user').toLowerCase();

    let role = 'user';
    if (requestedRole === 'coach') {
      const registrationKey = req.body.registrationKey || req.body.inviteCode;
      if (!process.env.COACH_REGISTRATION_KEY || registrationKey !== process.env.COACH_REGISTRATION_KEY) {
        return res.status(403).json({ error: 'Coach registration requires a valid invite key' });
      }

      role = 'coach';
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role });
    createdUserId = user._id;
    await Profile.create({ userId: user._id });

    const token = generateToken(user);
    res.cookie('fitpulse_token', token, getAuthCookieOptions());
    res.status(201).json({ message: 'Account created!', token, user: user.toSafeObject() });
  } catch (err) {
    // Rollback user if profile creation failed after account insert.
    if (createdUserId) {
      await User.findByIdAndDelete(createdUserId).catch(() => null);
    }

    if (err && err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    if (err && err.name === 'ValidationError') {
      const firstError = Object.values(err.errors || {})[0];
      return res.status(400).json({ error: firstError?.message || 'Invalid registration payload' });
    }

    console.error('Registration error', {
      requestId: req.requestId,
      message: err?.message,
    });

    res.status(500).json({ error: 'Registration failed. Please try again in a moment.' });
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
    res.cookie('fitpulse_token', token, getAuthCookieOptions());
    res.json({ message: 'Login successful', token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /auth/logout
const logout = async (req, res) => {
  res.clearCookie('fitpulse_token', clearAuthCookieOptions());
  return res.status(200).json({ message: 'Logout successful' });
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

module.exports = { register, login, logout, getMe, registerValidation, loginValidation };
