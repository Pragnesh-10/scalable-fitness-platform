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
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('fitpulse_token', data.token);
      localStorage.setItem('fitpulse_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token });
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
