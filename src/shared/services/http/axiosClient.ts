import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import type { IHttpServiceClient } from './IHttpServiceClient';
import type { ApiPaginationResponseType, ApiResponseType } from './helpers';
import { configApiInstance, configSupabaseApiInstance } from './helpers';

export type IAxiosOptions = {
  useSupabaseInterceptor?: boolean;
} & AxiosRequestConfig;

export class AxiosClient implements IHttpServiceClient<IAxiosOptions> {
  private axiosInstance: AxiosInstance;

  public options: IAxiosOptions;

  constructor(options: IAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create({
      ...options
    });

    if (options.useSupabaseInterceptor) {
      configSupabaseApiInstance(this.axiosInstance);
    } else {
      configApiInstance(this.axiosInstance);
    }
  }

  public async delete<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiResponseType<TResponse>> {
    const response = await this.axiosInstance.delete<TResponse>(url, {
      ...options,
      data: body
    });
    return response as unknown as ApiResponseType<TResponse>;
  }

  public async get<
    TResponse = unknown,
    TParams extends Record<string, unknown> | undefined = undefined
  >(
    url: string,
    params?: TParams,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiResponseType<TResponse>> {
    const response = await this.axiosInstance.get<TResponse>(url, {
      ...options,
      params
    });
    return response as unknown as ApiResponseType<TResponse>;
  }

  public async getMany<
    TResponse = unknown,
    TParams extends Record<string, unknown> | undefined = undefined
  >(
    url: string,
    params?: TParams,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiPaginationResponseType<TResponse>> {
    const response = await this.axiosInstance.get<TResponse>(url, {
      ...options,
      params
    });
    return response as unknown as ApiPaginationResponseType<TResponse>;
  }

  public async patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiResponseType<TResponse>> {
    const response = await this.axiosInstance.patch<TResponse>(
      url,
      body,
      options
    );
    return response as unknown as ApiResponseType<TResponse>;
  }

  public async post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiResponseType<TResponse>> {
    const response = await this.axiosInstance.post<TResponse>(
      url,
      body,
      options
    );
    return response as unknown as ApiResponseType<TResponse>;
  }

  public async put<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: Partial<IAxiosOptions>
  ): Promise<ApiResponseType<TResponse>> {
    const response = await this.axiosInstance.put<TResponse>(
      url,
      body,
      options
    );
    return response as unknown as ApiResponseType<TResponse>;
  }
}
