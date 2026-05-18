import { persistentAuthStore } from '@/shared/stores/persistentAuthStore';
import { tempAuthStore } from '@/shared/stores/tempAuthStore';

export const useAuthStore = () => {
  const persistent = persistentAuthStore();
  const temp = tempAuthStore();

  const authStore = persistent.user ? persistent : temp;

  // prefer persistent if user exists
  return {
    authStore,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated
  };
};
