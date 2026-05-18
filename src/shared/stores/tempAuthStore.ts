/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { User } from '@/shared/interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'expert' | 'patient';

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  setUser: (user: User | null) => void;
  login: (user: User, token: Token) => void;
  forceRefresh: (user: User, token: Token) => void;
  logout: () => void;
}

export const tempAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: undefined,
      refreshToken: undefined,
      setUser: (user) => set({ user }),
      login: (user, token) => {
        set({
          user,
          isAuthenticated: true,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        });
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: undefined,
          refreshToken: undefined
        }),
      forceRefresh: (user, token) =>
        set({
          user,
          isAuthenticated: true,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        })
    }),
    {
      name: 'auth-temp-storage',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      }
    }
  )
);

export const useTempAuthStore = tempAuthStore;
