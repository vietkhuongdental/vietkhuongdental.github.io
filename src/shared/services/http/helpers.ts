/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { showToastOutsideReact } from '@/shared/libs/toast-bridge';
import { ErrorCode, configs } from '@/shared/services/http/configs';
import { persistentAuthStore } from '@/shared/stores/persistentAuthStore';
import { tempAuthStore } from '@/shared/stores/tempAuthStore';
import type { AxiosInstance, AxiosResponse } from 'axios';

type ApiCall<TResponse, TArgs extends any[]> = (
  ...args: TArgs
) => Promise<ApiPaginationResponseType<TResponse> | ApiResponseType<TResponse>>;

export async function responseWrapper<TResponse, TArgs extends any[]>(
  func: ApiCall<TResponse, TArgs>,
  args: TArgs
): Promise<ApiPaginationResponseType<TResponse> | ApiResponseType<TResponse>> {
  const response = await func(...args);

  // If not be stucked throw new Error in configApiInstance, continue to this
  if (response?.status !== 200) {
    throw new Error(JSON.stringify(response) || undefined);
  }

  return response;
}

export interface PaginationResponseType {
  total: number;
  number: number;
  size: number;
}

export interface ApiPaginationData<T> {
  data: T;
  page: PaginationResponseType;
}

export interface ApiPaginationResponseType<T> {
  data: ApiPaginationData<T>;
  message: string;
  status: number;
  code: number;
  success?: boolean;
  timestamp?: string;
  items?: T;
}

export interface ApiResponseType<T> {
  data: T;
  message: string;
  status: number;
  code: number;
  success?: boolean;
  timestamp?: string;
  items?: T;
}

export const configApiInstance = (axiosInstance: AxiosInstance): void => {
  // Request interceptor to attach token
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      const persistent = persistentAuthStore.getState();
      const temp = tempAuthStore.getState();
      const authStore = persistent.isAuthenticated ? persistent : temp;

      const { accessToken } = authStore;

      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error retrieving token:', error);
    }

    return config;
  });

  // Response interceptor to unwrap data
  axiosInstance.interceptors.response.use(
    async (response: AxiosResponse) => {
      // Unwrap "data" if present
      const resData = response.data;

      if (resData && typeof resData === 'object') {
        if (resData.message.toLowerCase() === 'success') {
          response.status = 200;
        }

        if ('page' in resData && 'data' in resData) {
          response.data = { data: resData.data, page: resData.page };
        } else if ('data' in resData) {
          response.data = resData.data;
        }
      }

      return response;
    },
    async (error) => {
      if (
        error?.response?.status === 401 &&
        error?.response?.data.code !== ErrorCode.ErrorInvalidCredentials
      ) {
        const persistent = persistentAuthStore.getState();
        const temp = tempAuthStore.getState();
        const authStore = persistent.isAuthenticated ? persistent : temp;

        const { user, refreshToken, forceRefresh } = authStore;
        if (!refreshToken) return;

        try {
          const refreshResponse = await fetch(
            `${configs.API_BASE_URL}/auth/token/refresh`,
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json'
              },
              body: JSON.stringify({ refreshToken })
            }
          );

          if (!refreshResponse.ok || !user) {
            return authStore.logout();
          }

          const refreshResponseData = await refreshResponse.json();
          const newAccessToken = refreshResponseData?.data?.accessToken;
          const newRefreshToken = refreshResponseData?.data?.refreshToken;

          forceRefresh(user, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          });

          const originalRequest = error.config;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return await axiosInstance(originalRequest);
        } catch {
          authStore.logout();
          throw new Error('Failed to refresh token');
        }
      }

      if (error.code === 'ERR_NETWORK') {
        showToastOutsideReact({
          variant: 'error',
          title: 'Error Network',
          description: 'No Internet. Checking the network.'
        });
        throw new Error(String(error.message));
      }

      if (
        error.code === 'ECONNABORTED' ||
        error.response?.data === 'CONNECTION_TIMEOUT'
      ) {
        showToastOutsideReact({
          variant: 'error',
          title: 'Connection timeout',
          description: 'Please check your network and try again.'
        });
        throw new Error(String(error.message));
      }

      // If nothing error found by 3 layers above, still allow accept this error as an acceptable response which will be returned to responseWrapper's response
      return error.response?.data;
    }
  );
};

export const configSupabaseApiInstance = (
  axiosInstance: AxiosInstance
): void => {
  // Request interceptor to attach token
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      const persistent = persistentAuthStore.getState();
      const temp = tempAuthStore.getState();
      const authStore = persistent.isAuthenticated ? persistent : temp;

      const { accessToken } = authStore;

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken || configs.SUPABASE_PUBLISHABLE_DEFAULT_KEY}`;
      config.headers.apiKey = configs.SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error retrieving token:', error);
    }

    return config;
  });

  // Response interceptor — Supabase edge functions return flat JSON with no wrapper
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      response.status = 200;
      return response;
    },
    async (error) => {
      if (error?.response?.status === 401) {
        const persistent = persistentAuthStore.getState();
        const temp = tempAuthStore.getState();
        const authStore = persistent.isAuthenticated ? persistent : temp;
        const { user, refreshToken, forceRefresh } = authStore;
        if (!refreshToken) return;

        try {
          const refreshResponse = await fetch(
            `${configs.SUPABASE_FUNCTIONS_URL}/authRefresh`,
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json'
              },
              body: JSON.stringify({ refreshToken })
            }
          );

          if (!refreshResponse.ok || !user) {
            return authStore.logout();
          }

          const refreshResponseData = await refreshResponse.json();
          const newAccessToken = refreshResponseData?.accessToken;
          const newRefreshToken = refreshResponseData?.refreshToken;

          forceRefresh(user, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          });

          const originalRequest = error.config;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return await axiosInstance(originalRequest);
        } catch {
          authStore.logout();
          throw new Error('Failed to refresh token');
        }
      }

      if (error.code === 'ERR_NETWORK') {
        showToastOutsideReact({
          variant: 'error',
          title: 'Error Network',
          description: 'No Internet. Checking the network.'
        });
        throw new Error(String(error.message));
      }

      if (
        error.code === 'ECONNABORTED' ||
        error.response?.data === 'CONNECTION_TIMEOUT'
      ) {
        showToastOutsideReact({
          variant: 'error',
          title: 'Connection timeout',
          description: 'Please check your network and try again.'
        });
        throw new Error(String(error.message));
      }

      return error.response?.data;
    }
  );
};
