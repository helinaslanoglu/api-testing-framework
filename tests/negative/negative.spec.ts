import { test, expect } from '../../src/fixtures/test.fixture';
import {
  buildInvalidLoginPayload,
  buildEmptyLoginPayload,
  buildMissingPasswordLoginPayload,
} from '../../src/data/user.factory';
import { assertSchemaMatch } from '../../src/utils/schema-validator';
import { apiErrorSchema } from '../../src/models/schemas/common.schema';

test.describe('Dedicated API Negative Testing Suite @negative', () => {
  test.describe('Authentication Failure Scenarios', () => {
    test('should reject authentication attempt with invalid credentials and return HTTP 400', async ({
      authClient,
    }) => {
      const invalidPayload = buildInvalidLoginPayload();
      const response = await authClient.login(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe('Invalid credentials');
    });

    test('should reject authentication attempt with empty payload and return HTTP 400', async ({
      authClient,
    }) => {
      const emptyPayload = buildEmptyLoginPayload();
      const response = await authClient.login(emptyPayload);

      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe('Username and password required');
    });

    test('should reject authentication attempt missing password and return HTTP 400', async ({
      authClient,
    }) => {
      const missingPasswordPayload = buildMissingPasswordLoginPayload();
      const response = await authClient.login(missingPasswordPayload);

      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe('Username and password required');
    });

    test('should reject access to protected auth/me resource without Authorization header', async ({
      authClient,
    }) => {
      const response = await authClient.getCurrentUserWithoutAuth();

      expect([401, 403]).toContain(response.status);
      expect(response.ok).toBe(false);
    });

    test('should reject access to protected auth/me resource with malformed Bearer token', async ({
      authClient,
    }) => {
      const invalidToken = 'invalid.jwt.token.string';
      const response = await authClient.getCurrentUser(invalidToken);

      expect([401, 403]).toContain(response.status);
      expect(response.ok).toBe(false);
    });
  });

  test.describe('User Resource Failure Scenarios', () => {
    test('should return HTTP 404 Not Found when requesting non-existent user resource', async ({
      usersClient,
    }) => {
      const nonExistentId = 99999;
      const response = await usersClient.getUser(nonExistentId);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe(`User with id '${nonExistentId}' not found`);
    });
  });
});
