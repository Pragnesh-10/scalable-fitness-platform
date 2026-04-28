import axios from 'axios';
import { getApiBaseUrl } from './api-config';

const DEFAULT_API_TIMEOUT_MS = 12000;
const parsedTimeout = Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || '', 10);
const apiTimeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0
  ? parsedTimeout
  : DEFAULT_API_TIMEOUT_MS;

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor: Attach auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('fitpulse_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fitpulse_token');
        localStorage.removeItem('fitpulse_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
