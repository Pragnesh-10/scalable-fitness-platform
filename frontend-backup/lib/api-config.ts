/**
 * Centralized API Configuration
 * Ensures consistent API URL handling across all components
 */

const normalizeApiBaseUrl = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, '');
};

const PRODUCTION_API_FALLBACKS: Record<string, string> = {
  'scalable-fitness-platform.vercel.app': 'https://fitpulse-prod.eba-gbwbegcm.us-east-1.elasticbeanstalk.com/api',
};

const isPrivateIpv4Host = (hostname: string): boolean => {
  const parts = hostname.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) return false;
  const [a, b] = parts.map((part) => Number.parseInt(part, 10));
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
};

const upgradeToHttpsWhenNeeded = (url: string): string => {
  if (typeof window === 'undefined') return url;
  if (window.location.protocol !== 'https:') return url;
  if (!url.startsWith('http://')) return url;

  // Do NOT upgrade for local development addresses as the backend likely doesn't have SSL
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const isLocal = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.endsWith('.local') ||
    isPrivateIpv4Host(hostname);

  if (isLocal) return url;

  // Avoid mixed-content failures when frontend is served over HTTPS in production.
  return url.replace(/^http:\/\//, 'https://');
};

const rewriteLocalhostForCurrentHost = (url: string): string => {
  if (typeof window === 'undefined') return url;
  const currentHost = window.location.hostname;
  if (!currentHost) return url;
  
  // Keep localhost/127.0.0.1 if that's what we're already using
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') return url;

  // If frontend is opened via LAN/private host (e.g. 192.168.1.5), 
  // "localhost" in the API URL would point to the user's phone/browser machine, not the server.
  return url
    .replace('://localhost:', `://${currentHost}:`)
    .replace('://127.0.0.1:', `://${currentHost}:`);
};

// Validate and normalize API base URL
export const getApiBaseUrl = (): string => {
  const configuredBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  if (configuredBaseUrl) {
    return upgradeToHttpsWhenNeeded(rewriteLocalhostForCurrentHost(configuredBaseUrl));
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local') ||
      isPrivateIpv4Host(hostname);
    if (!isLocalHost) {
      const fallbackForHost = PRODUCTION_API_FALLBACKS[hostname];
      if (fallbackForHost) return fallbackForHost;
      // For non-local hostnames without explicit mapping, use same-origin API.
      return `${window.location.origin}/api`;
    }
  }

  // Local development fallback.
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname || 'localhost';
    return `http://${currentHost}:5001/api`;
  }
  return 'http://localhost:5001/api';
};

// Construct full API endpoint URLs
export const apiEndpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  // User
  user: {
    profile: '/user/profile',
    stats: '/user/stats',
  },
  // Workouts
  workouts: {
    list: '/workouts',
    create: '/workouts',
    delete: (id: string) => `/workouts/${id}`,
  },
  // Analytics
  analytics: {
    weekly: '/analytics/weekly',
    monthly: '/analytics/monthly',
  },
  // Plans
  plans: {
    active: '/plans/active',
    generate: '/plans/generate',
  },
  // Community
  community: {
    leaderboard: '/community/leaderboard',
    challenges: '/community/challenges',
    joinChallenge: (id: string) => `/community/challenges/${id}/join`,
  },
  // Coach
  coach: {
    clients: '/coach/clients',
    assignPlan: '/coach/assign-plan',
  },
};

// Validate API response structure
export const isValidApiResponse = (data: unknown): boolean => {
  return data !== null && typeof data === 'object';
};

// Get full URL for debugging/logging
export const getFullUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};
