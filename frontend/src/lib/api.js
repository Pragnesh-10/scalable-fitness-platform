import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
console.log('🔗 API Configuration:', { 
  VITE_API_URL: import.meta.env.VITE_API_URL,
  baseURL,
  isDevelopment: import.meta.env.DEV
});

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitpulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 API Request:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  });
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('📥 API Response:', { 
      status: response.status,
      url: response.config.url 
    });
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      data: error.response?.data,
      code: error.code
    });
    return Promise.reject(error);
  }
);

export default api;
