import { ApiResponse } from '../models/common.model';
import { config } from '../config/env.config';

export interface SlaAssertionOptions {
  thresholdMs?: number;
  endpoint?: string;
  method?: string;
}

/**
 * Asserts that an API response was returned within the expected latency SLA threshold.
 * Throws a diagnostic Error detailing endpoint, method, actual duration, and target threshold if breached.
 */
export function assertSla<T>(
  response: ApiResponse<T>,
  options?: SlaAssertionOptions
): void {
  const threshold = options?.thresholdMs ?? config.defaultSlaThresholdMs;
  const endpoint = options?.endpoint ?? response.rawResponse.url();
  const method = options?.method ?? 'HTTP';

  if (response.responseTimeMs > threshold) {
    const errorMessage =
      `[SLA Violation] ${method} ${endpoint} failed performance SLA:\n` +
      `  - Actual Latency: ${response.responseTimeMs}ms\n` +
      `  - Allowed Threshold: ${threshold}ms`;
    throw new Error(errorMessage);
  }
}
