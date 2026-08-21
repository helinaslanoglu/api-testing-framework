import { ApiResponse } from '../models/common.model';

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  retryableStatuses?: number[];
}

const DEFAULT_RETRYABLE_STATUSES = [500, 502, 503, 504, 429];

/**
 * Delays execution asynchronously for a controlled duration
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes an API request function with controlled exponential backoff retries for transient failures
 */
export async function executeWithRetry<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  options?: RetryOptions
): Promise<ApiResponse<T>> {
  const maxRetries = options?.maxRetries ?? 2;
  const initialDelayMs = options?.delayMs ?? 200;
  const retryableStatuses = options?.retryableStatuses ?? DEFAULT_RETRYABLE_STATUSES;

  let attempt = 0;
  let lastResponse: ApiResponse<T> | null = null;
  let lastError: unknown = null;

  while (attempt <= maxRetries) {
    try {
      lastResponse = await requestFn();

      // Check if response status indicates a transient retryable server error
      if (retryableStatuses.includes(lastResponse.status) && attempt < maxRetries) {
        attempt++;
        const currentDelay = initialDelayMs * Math.pow(2, attempt - 1);
        await delay(currentDelay);
        continue;
      }

      return lastResponse;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        attempt++;
        const currentDelay = initialDelayMs * Math.pow(2, attempt - 1);
        await delay(currentDelay);
        continue;
      }
      throw lastError;
    }
  }

  return lastResponse!;
}
