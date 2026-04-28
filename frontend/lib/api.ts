import axios from 'axios';
import { getApiBaseUrl } from './api-config';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor: Attach auth token
api.interceptors.request.use(
  (config) => {
    // #region agent log
    fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H6',location:'frontend/lib/api.ts:16',message:'api request dispatched',data:{method:config.method||null,url:config.url||null,baseURL:config.baseURL||null,hasAuthHeader:Boolean(config.headers?.Authorization)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
  (response) => {
    // #region agent log
    fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H6',location:'frontend/lib/api.ts:31',message:'api response received',data:{status:response.status,url:response.config?.url||null,baseURL:response.config?.baseURL||null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return response;
  },
  (error) => {
    // #region agent log
    fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H6',location:'frontend/lib/api.ts:35',message:'api response error',data:{status:error.response?.status||null,url:error.config?.url||null,baseURL:error.config?.baseURL||null,errorCode:error.code||null,errorMessage:error.message||null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
