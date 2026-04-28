/**
 * Centralized API Configuration
 * Ensures consistent API URL handling across all components
 */

// Validate and normalize API base URL
export const getApiBaseUrl = (): string => {
  // In browser environment, use environment variable
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  // Server-side (SSR): use environment variable
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
