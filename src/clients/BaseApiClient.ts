import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResponse } from '../models/common.model';
import { config } from '../config/env.config';

export abstract class BaseApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = config.baseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  private async formatResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      data = {} as T;
    }

    return {
      status: response.status(),
      ok: response.ok(),
      data,
      headers: response.headers(),
      rawResponse: response,
    };
  }

  protected async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.get(url, {
      params,
      headers,
    });
    return this.formatResponse<T>(response);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.post(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response);
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.put(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response);
  }

  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.patch(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response);
  }

  protected async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.delete(url, {
      headers,
    });
    return this.formatResponse<T>(response);
  }
}
