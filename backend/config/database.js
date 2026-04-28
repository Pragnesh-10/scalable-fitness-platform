const mongoose = require('mongoose');
require('dotenv').config();

const connectWithUri = (uri) =>
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  });

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fitpulse';

  try {
    const conn = await connectWithUri(primaryUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    const isSrvDnsFailure = typeof err?.message === 'string' && err.message.includes('querySrv');
    const isDev = process.env.NODE_ENV !== 'production';
    const fallbackUri = 'mongodb://127.0.0.1:27017/fitpulse';

    if (isDev && isSrvDnsFailure && primaryUri.startsWith('mongodb+srv://')) {
      try {
        console.warn('⚠️  Atlas SRV lookup failed in development, falling back to local MongoDB');
        const conn = await connectWithUri(fallbackUri);
        console.log(`✅ MongoDB connected (fallback): ${conn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.error('❌ MongoDB fallback connection error:', fallbackErr.message);
      }
    }

    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

module.exports = connectDB;
