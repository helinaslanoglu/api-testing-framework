import { test, expect } from '../../src/fixtures/test.fixture';
import {
  buildValidLoginPayload,
  buildInvalidLoginPayload,
} from '../../src/data/user.factory';
import { ApiErrorResponse } from '../../src/models/common.model';

test.describe('Authentication & Authorization Suite', () => {
  test.describe('Positive Scenarios', () => {
    test('should authenticate successfully with valid credentials', async ({
      authClient,
    }) => {
      const payload = buildValidLoginPayload();
      const response = await authClient.login(payload);

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      expect(response.data.accessToken).toBeDefined();
      expect(typeof response.data.accessToken).toBe('string');
      expect(response.data.accessToken.length).toBeGreaterThan(20);
      expect(response.data.username).toBe(payload.username);
      expect(response.data.id).toBeDefined();
    });

    test('should retrieve current profile using valid Bearer token', async ({
      authClient,
    }) => {
      const loginPayload = buildValidLoginPayload();
      const loginResponse = await authClient.login(loginPayload);

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.data.accessToken;

      const profileResponse = await authClient.getCurrentUser(token);
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.ok).toBe(true);
      expect(profileResponse.data.username).toBe(loginPayload.username);
      expect(profileResponse.data.email).toBeDefined();
    });
  });

  test.describe('Negative Scenarios', () => {
    test('should return 400 Bad Request when logging in with invalid credentials', async ({
      authClient,
    }) => {
      const invalidPayload = buildInvalidLoginPayload();
      const response = await authClient.login(invalidPayload);
      const errorData = response.data as unknown as ApiErrorResponse;

      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);
      expect(errorData.message).toBe('Invalid credentials');
    });

    test('should reject requests to auth/me when authorization header is missing or invalid', async ({
      authClient,
    }) => {
      const response = await authClient.getCurrentUserWithoutAuth();

      // DummyJSON returns 401 Unauthorized or 403 Forbidden for missing token
      expect([401, 403]).toContain(response.status);
      expect(response.ok).toBe(false);
    });
  });
});
