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

// Validate and normalize API base URL
export const getApiBaseUrl = (): string => {
  const configuredBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  if (configuredBaseUrl) return configuredBaseUrl;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    // In production, default to same-origin API if env var is missing.
    if (!isLocalHost) return `${window.location.origin}/api`;
  }

  // Local development fallback.
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
export const isValidApiResponse = (data: any): boolean => {
  return data !== null && typeof data === 'object';
};

// Get full URL for debugging/logging
export const getFullUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};
