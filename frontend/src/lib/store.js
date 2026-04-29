import { create } from 'zustand';
import api from './api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('fitpulse_token'),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('fitpulse_token', token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem('fitpulse_token');
      localStorage.removeItem('fitpulse_user');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('fitpulse_token', data.token);
      localStorage.setItem('fitpulse_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('fitpulse_token', data.token);
      localStorage.setItem('fitpulse_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('fitpulse_token');
    const userStr = localStorage.getItem('fitpulse_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('fitpulse_token');
    localStorage.removeItem('fitpulse_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
