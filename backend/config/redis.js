const redis = require('redis');
require('dotenv').config();

let client = null;

const getRedisClient = async () => {
  if (client && client.isOpen) return client;

  client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

  client.on('error', (err) => console.error('❌ Redis error:', err.message));
  client.on('connect', () => console.log('✅ Connected to Redis'));

  await client.connect().catch(() => {
    console.warn('⚠️  Redis unavailable — running without cache');
    client = null;
  });

  return client;
};

const cacheGet = async (key) => {
  try {
    const c = await getRedisClient();
    if (!c) return null;
    return await c.get(key);
  } catch { return null; }
};

const cacheSet = async (key, value, ttlSeconds = 300) => {
  try {
    const c = await getRedisClient();
    if (!c) return;
    await c.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch { /* silent */ }
};

const cacheDel = async (key) => {
  try {
    const c = await getRedisClient();
    if (!c) return;
    await c.del(key);
  } catch { /* silent */ }
};

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel };
