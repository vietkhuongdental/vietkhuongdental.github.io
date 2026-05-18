import type { ApiResponseType } from '@/shared/services/http/helpers';

export interface IHttpServiceClient<Options> {
  options: Options;
  get: <
    TResponse = unknown,
    TParams extends Record<string, unknown> | undefined = undefined
  >(
    url: string,
    params?: TParams,
    options?: Partial<Options>
  ) => Promise<ApiResponseType<TResponse>>;
  post: <TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Options
  ) => Promise<ApiResponseType<TResponse>>;
  put: <TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Options
  ) => Promise<ApiResponseType<TResponse>>;
  patch: <TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Options
  ) => Promise<ApiResponseType<TResponse>>;
  delete: <TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Options
  ) => Promise<ApiResponseType<TResponse>>;
}
