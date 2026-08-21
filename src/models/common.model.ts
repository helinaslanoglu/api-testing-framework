import { APIResponse } from '@playwright/test';

export interface ApiResponse<T> {
  status: number;
  ok: boolean;
  data: T;
  headers: Record<string, string>;
  rawResponse: APIResponse;
  responseTimeMs: number;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  [key: string]: unknown;
}
