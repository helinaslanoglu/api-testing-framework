import { test, expect } from '../../src/fixtures/test.fixture';
import { assertSchemaMatch } from '../../src/utils/schema-validator';
import { apiErrorSchema } from '../../src/models/schemas/common.schema';
import { usersListSchema } from '../../src/models/schemas/user.schema';

test.describe('Dedicated Boundary & Edge Case API Testing Suite', () => {
  test.describe('Resource ID Boundary Testing', () => {
    test('should return HTTP 404 when querying user ID equal to 0', async ({
      usersClient,
    }) => {
      const response = await usersClient.getUser(0);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe("User with id '0' not found");
    });

    test('should return HTTP 404 when querying negative user ID (-1)', async ({
      usersClient,
    }) => {
      const response = await usersClient.getUser(-1);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe("User with id '-1' not found");
    });

    test('should return HTTP 404 when querying extremely large user ID', async ({
      usersClient,
    }) => {
      const largeId = 99999999;
      const response = await usersClient.getUser(largeId);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);

      const errorBody = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
      expect(errorBody.message).toBe(`User with id '${largeId}' not found`);
    });
  });

  test.describe('Pagination Query Boundary Testing', () => {
    test('should handle limit=0 query parameter gracefully and return HTTP 200', async ({
      usersClient,
    }) => {
      const response = await usersClient.getUsers({ limit: 0 });

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);

      const validatedData = assertSchemaMatch(usersListSchema, response.data, 'UsersListResponse');

      // DummyJSON interprets limit=0 as fetch all resources
      expect(validatedData.users.length).toBeGreaterThan(0);
      expect(typeof validatedData.limit).toBe('number');
    });

    test('should handle high limit value pagination boundary gracefully', async ({
      usersClient,
    }) => {
      const highLimit = 1000;
      const response = await usersClient.getUsers({ limit: highLimit });

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);

      const validatedData = assertSchemaMatch(usersListSchema, response.data, 'UsersListResponse');
      expect(validatedData.users.length).toBeGreaterThan(0);
    });
  });

  test.describe('Payload Boundary Testing', () => {
    test('should handle updating user with empty payload without crashing service', async ({
      usersClient,
    }) => {
      const userId = 1;
      const response = await usersClient.updateUser(userId, {});

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      expect(response.data.id).toBe(userId);
    });
  });
});
