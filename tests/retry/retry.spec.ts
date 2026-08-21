import { test, expect } from '../../src/fixtures/test.fixture';
import { executeWithRetry } from '../../src/utils/retry-handler';
import { User } from '../../src/models/user.model';
import { APIResponse } from '@playwright/test';

test.describe('Transient Error Retry Policy Suite @retry', () => {
  test('should execute request successfully on first attempt without retrying', async ({
    healthClient,
  }) => {
    let callCount = 0;
    const response = await executeWithRetry(async () => {
      callCount++;
      return healthClient.checkHealth();
    });

    expect(response.status).toBe(200);
    expect(callCount).toBe(1);
  });

  test('should perform controlled retries on retryable server errors and succeed if endpoint recovers', async ({
    usersClient,
  }) => {
    let callCount = 0;
    const response = await executeWithRetry(
      async () => {
        callCount++;
        if (callCount < 2) {
          // Simulate transient 503 response
          return {
            status: 503,
            ok: false,
            data: {} as User,
            headers: {},
            rawResponse: {} as APIResponse,
            responseTimeMs: 50,
          };
        }
        return usersClient.getUser(1);
      },
      { maxRetries: 2, delayMs: 50 }
    );

    expect(response.status).toBe(200);
    expect(callCount).toBe(2);
  });
});
