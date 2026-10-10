import axios from 'axios';
import { SafeStorage } from '../utils/storage';

const PRODUCTION_URL = 'https://astro-6rlo.onrender.com/api';

export const api = axios.create({
  baseURL: PRODUCTION_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SafeStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface RegisterPayload {
  email: string;
  username?: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: {
    id: number;
    email: string;
    username: string;
  };
  tokens?: {
    access: string;
    refresh: string;
  };
  access?: string;
  refresh?: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', payload);
    return response.data;
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await api.post('/auth/refresh/', { refresh });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};
