import { create } from 'zustand';
import { SafeStorage } from '../utils/storage';
import { authApi, LoginPayload, RegisterPayload } from '../api/auth';
import { notificationsApi } from '../api/notifications';

interface User {
  id?: number;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loadStorageTokens: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  loadStorageTokens: async () => {
    try {
      set({ isLoading: true });
      const access = await SafeStorage.getItem('access_token');
      const refresh = await SafeStorage.getItem('refresh_token');
      const storedUser = await SafeStorage.getItem('user_profile');

      if (access && refresh) {
        set({
          accessToken: access,
          refreshToken: refresh,
          user: storedUser ? JSON.parse(storedUser) : null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (payload: LoginPayload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authApi.login(payload);

      const access = res.access || res.tokens?.access || '';
      const refresh = res.refresh || res.tokens?.refresh || '';

      // Build a basic user from the login response (if available)
      const basicUser = res.user || { email: payload.email, username: payload.email.split('@')[0] };

      // Navigate IMMEDIATELY — don't wait for profile or storage
      set({
        accessToken: access,
        refreshToken: refresh,
        user: basicUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Do all slow work in the background (non-blocking)
      (async () => {
        try {
          // Save tokens to storage
          await SafeStorage.setItem('access_token', access);
          await SafeStorage.setItem('refresh_token', refresh);

          // Fetch full profile and update
          const profile = await authApi.getProfile();
          await SafeStorage.setItem('user_profile', JSON.stringify(profile));
          set({ user: profile });
        } catch (e) {
          console.warn('Background profile fetch failed:', e);
        }

        // Register device push token with backend
        notificationsApi.registerPushToken().catch(console.error);
      })();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Invalid email or password.';
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  register: async (payload: RegisterPayload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authApi.register(payload);

      const access = res.tokens?.access || '';
      const refresh = res.tokens?.refresh || '';
      const user = res.user || { email: payload.email, username: payload.username || '' };

      if (access && refresh) {
        await SafeStorage.setItem('access_token', access);
        await SafeStorage.setItem('refresh_token', refresh);
        await SafeStorage.setItem('user_profile', JSON.stringify(user));
      }

      set({
        accessToken: access,
        refreshToken: refresh,
        user,
        isAuthenticated: !!access,
        isLoading: false,
      });
    } catch (err: any) {
      console.error('Registration Error:', err);
      const data = err.response?.data;
      let errorMsg = 'Registration failed. Please check network/credentials.';
      if (data) {
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (typeof data === 'object') {
          const keys = Object.keys(data);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const val = data[firstKey];
            errorMsg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
          }
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    await SafeStorage.removeItem('access_token');
    await SafeStorage.removeItem('refresh_token');
    await SafeStorage.removeItem('user_profile');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));


