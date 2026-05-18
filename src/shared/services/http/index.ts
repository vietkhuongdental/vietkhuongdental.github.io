import { configs } from '@/shared/services/http/configs';
import axios from 'axios';

import { AxiosClient } from './axiosClient';

axios.defaults.withCredentials = true;

export const httpService = new AxiosClient({
  baseURL: configs.API_BASE_URL,

  headers: {
    accept: 'application/json'
  },
  timeout: configs.CONNECTION_TIMEOUT,
  withCredentials: false
});

export const httpSupabaseService = new AxiosClient({
  baseURL: configs.SUPABASE_FUNCTIONS_URL,
  headers: {
    accept: 'application/json'
  },
  timeout: configs.CONNECTION_TIMEOUT,
  withCredentials: false,
  useSupabaseInterceptor: true
});

export {
  configApiInstance,
  configSupabaseApiInstance,
  responseWrapper
} from './helpers';

export type {
  ApiPaginationResponseType,
  ApiResponseType,
  PaginationResponseType
} from './helpers';
