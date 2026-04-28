const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const validateEnvironment = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in all environments');
  }

  if (nodeEnv === 'production') {
    if (!process.env.FRONTEND_URL && !process.env.CORS_ALLOWED_ORIGINS) {
      throw new Error('Set FRONTEND_URL or CORS_ALLOWED_ORIGINS in production');
    }

    if (!parseBoolean(process.env.TRUST_PROXY, true)) {
      throw new Error('TRUST_PROXY must be enabled in production');
    }
  }

  return {
    nodeEnv,
    isProduction: nodeEnv === 'production',
    trustProxy: parseBoolean(process.env.TRUST_PROXY, nodeEnv === 'production'),
  };
};

module.exports = {
  validateEnvironment,
};
