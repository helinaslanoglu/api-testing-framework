import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResponse } from '../models/common.model';
import { config } from '../config/env.config';
import { formatDiagnosticLog } from '../utils/logger';

export abstract class BaseApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = config.baseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  private async formatResponse<T>(
    response: APIResponse,
    startTime: number,
    method: string,
    endpoint: string,
    headers?: Record<string, string>,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const responseTimeMs = Date.now() - startTime;
    let responseData: T;
    try {
      responseData = (await response.json()) as T;
    } catch {
      responseData = {} as T;
    }

    const apiResponse: ApiResponse<T> = {
      status: response.status(),
      ok: response.ok(),
      data: responseData,
      headers: response.headers(),
      rawResponse: response,
      responseTimeMs,
    };

    if (process.env.DEBUG_API_LOGS === 'true') {
      const diagnostic = formatDiagnosticLog({
        method,
        url: `${this.baseUrl}${endpoint}`,
        status: response.status(),
        durationMs: responseTimeMs,
        requestHeaders: headers,
        requestData: data,
        responseData,
      });
      console.log(diagnostic);
    }

    return apiResponse;
  }

  protected async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.get(url, {
      params,
      headers,
    });
    return this.formatResponse<T>(response, startTime, 'GET', endpoint, headers, params);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.post(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response, startTime, 'POST', endpoint, headers, data);
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.put(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response, startTime, 'PUT', endpoint, headers, data);
  }

  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.patch(url, {
      data,
      headers,
    });
    return this.formatResponse<T>(response, startTime, 'PATCH', endpoint, headers, data);
  }

  protected async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.delete(url, {
      headers,
    });
    return this.formatResponse<T>(response, startTime, 'DELETE', endpoint, headers);
  }
}
