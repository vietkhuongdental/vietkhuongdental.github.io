import type { User } from '@/shared/interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Token {
  accessToken: string;
  refreshToken: string;
  accessZaloToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  accessZaloToken?: string;
  setUser: (user: User | null) => void;
  login: (user: User, token: Token) => void;
  forceRefresh: (user: User, token: Token) => void;
  logout: () => void;
}

export const persistentAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: undefined,
      refreshToken: undefined,
      accessZaloToken: undefined,
      setUser: (user) => set({ user }),
      login: (user, token) => {
        set({
          user,
          isAuthenticated: true,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessZaloToken: token.accessZaloToken
        });
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: undefined,
          refreshToken: undefined,
          accessZaloToken: undefined
        }),
      forceRefresh: (user, token) =>
        set({
          user,
          isAuthenticated: true,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessZaloToken: token.accessZaloToken
        })
    }),
    {
      name: 'auth-storage' // uses localStorage
    }
  )
);

export const usePersistentAuthStore = persistentAuthStore;
