'use client';
import { create } from 'zustand';
import api from './api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('fitpulse_token');
    const user = localStorage.getItem('fitpulse_user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('fitpulse_token', data.token);
      localStorage.setItem('fitpulse_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      // #region agent log
      fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H1',location:'frontend/lib/store.ts:53',message:'frontend register request start',data:{baseURL:api.defaults.baseURL||null,role:formData?.role||null,hasEmail:Boolean(formData?.email)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const { data } = await api.post('/auth/register', formData);
      // #region agent log
      fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H4',location:'frontend/lib/store.ts:56',message:'frontend register request success',data:{hasToken:Boolean(data?.token),hasUser:Boolean(data?.user),role:data?.user?.role||null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      localStorage.setItem('fitpulse_token', data.token);
      localStorage.setItem('fitpulse_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token });
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H5',location:'frontend/lib/store.ts:61',message:'frontend register request failed',data:{hasResponse:Boolean(error?.response),status:error?.response?.status||null,errorCode:error?.code||null,errorMessage:error?.message||null,serverError:error?.response?.data?.error||null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('fitpulse_token');
    localStorage.removeItem('fitpulse_user');
    set({ user: null, token: null });
    window.location.href = '/login';
  },
}));
