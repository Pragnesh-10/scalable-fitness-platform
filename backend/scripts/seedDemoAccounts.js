require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD || 'Demo@12345';

const demoAccounts = [
  {
    name: 'ynpragnesh',
    email: 'ynpragnesh@gmail.com',
    role: 'user',
    profile: {
      fitnessGoals: 'general_fitness',
      experienceLevel: 'beginner',
      age: 27,
      weight: 70,
      height: 172,
    },
  },
  {
    name: 'Demo Athlete',
    email: 'demo.athlete@fitpulse.app',
    role: 'user',
    profile: {
      fitnessGoals: 'endurance',
      experienceLevel: 'intermediate',
      age: 31,
      weight: 67,
      height: 175,
    },
  },
  {
    name: 'Demo Coach',
    email: 'demo.coach@fitpulse.app',
    role: 'coach',
    profile: {
      fitnessGoals: 'muscle_gain',
      experienceLevel: 'advanced',
      age: 35,
      weight: 78,
      height: 180,
    },
  },
];

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to seed demo accounts.');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
  } catch (error) {
    const isDev = process.env.NODE_ENV !== 'production';
    const isSrvDnsFailure = String(error?.message || '').includes('querySrv');
    if (!isDev || !isSrvDnsFailure || !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      throw error;
    }

    const fallbackUri = 'mongodb://127.0.0.1:27017/fitpulse';
    console.warn('Atlas SRV lookup failed in development, using local MongoDB fallback.');
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
};

const seed = async () => {
  await connectDB();

  for (const account of demoAccounts) {
    const existing = await User.findOne({ email: account.email });
    let user = existing;

    if (!existing) {
      user = await User.create({
        name: account.name,
        email: account.email,
        password: DEMO_PASSWORD,
        role: account.role,
      });
      console.log(`Created user: ${account.email}`);
    } else {
      await User.updateOne(
        { _id: existing._id },
        { $set: { name: account.name, role: account.role } }
      );
      console.log(`User exists, updated basics: ${account.email}`);
      user = await User.findById(existing._id);
    }

    await Profile.updateOne(
      { userId: user._id },
      { $set: account.profile },
      { upsert: true }
    );
    console.log(`Upserted profile: ${account.email}`);
  }

  console.log('\nDemo accounts ready:');
  for (const account of demoAccounts) {
    console.log(`- ${account.email} / ${DEMO_PASSWORD} (${account.role})`);
  }
};

seed()
  .catch((error) => {
    console.error('Failed to seed demo accounts:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => null);
  });
