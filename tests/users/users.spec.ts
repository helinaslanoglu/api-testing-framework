import { test, expect } from '../../src/fixtures/test.fixture';
import {
  buildCreateUserPayload,
  buildUpdateUserPayload,
} from '../../src/data/user.factory';
import { ApiErrorResponse } from '../../src/models/common.model';
import { assertSla } from '../../src/utils/sla-validator';

test.describe('Users API Resource Suite', () => {
  test.describe('Positive Scenarios', () => {
    test('should retrieve a paginated list of users with valid pagination parameters', async ({
      usersClient,
    }) => {
      const limit = 5;
      const skip = 0;
      const response = await usersClient.getUsers({ limit, skip });

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      assertSla(response);
      expect(response.data.limit).toBe(limit);
      expect(response.data.skip).toBe(skip);
      expect(response.data.users.length).toBeLessThanOrEqual(limit);
      expect(response.data.total).toBeGreaterThan(0);

      // Validate schema properties of first user item
      const firstUser = response.data.users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('firstName');
      expect(firstUser).toHaveProperty('lastName');
      expect(firstUser).toHaveProperty('email');
      expect(typeof firstUser.id).toBe('number');
      expect(typeof firstUser.email).toBe('string');
    });

    test('should retrieve a single user by ID', async ({ usersClient }) => {
      const targetUserId = 1;
      const response = await usersClient.getUser(targetUserId);

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      assertSla(response);
      expect(response.data.id).toBe(targetUserId);
      expect(response.data.firstName).toBe('Emily');
      expect(response.data.lastName).toBe('Johnson');
      expect(response.data.email).toBe('emily.johnson@x.dummyjson.com');

      // Assert nested structures
      expect(response.data.address).toBeDefined();
      expect(typeof response.data.address?.city).toBe('string');
      expect(response.data.company).toBeDefined();
    });

    test('should create a new user resource successfully', async ({ usersClient }) => {
      const payload = buildCreateUserPayload();
      const response = await usersClient.createUser(payload);

      expect(response.status).toBe(201);
      expect(response.ok).toBe(true);
      assertSla(response);
      expect(response.data.id).toBeDefined();
      expect(typeof response.data.id).toBe('number');
      expect(response.data.firstName).toBe(payload.firstName);
      expect(response.data.lastName).toBe(payload.lastName);
      expect(response.data.email).toBe(payload.email);
      expect(response.data.age).toBe(payload.age);
    });

    test('should update an existing user resource successfully', async ({ usersClient }) => {
      const userId = 1;
      const payload = buildUpdateUserPayload({ firstName: 'QA_Updated' });
      const response = await usersClient.updateUser(userId, payload);

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      assertSla(response);
      expect(response.data.id).toBe(userId);
      expect(response.data.firstName).toBe('QA_Updated');
      expect(response.data.lastName).toBe(payload.lastName);
    });

    test('should delete a user resource successfully', async ({ usersClient }) => {
      const userId = 1;
      const response = await usersClient.deleteUser(userId);

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
      assertSla(response);
      expect(response.data.id).toBe(userId);
      expect(response.data.isDeleted).toBe(true);
      expect(response.data.deletedOn).toBeDefined();
      expect(typeof response.data.deletedOn).toBe('string');
    });
  });

  test.describe('Negative Scenarios', () => {
    test('should return 404 Not Found when retrieving a non-existent user ID', async ({
      usersClient,
    }) => {
      const invalidId = 99999;
      const response = await usersClient.getUser(invalidId);
      const errorData = response.data as unknown as ApiErrorResponse;

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
      assertSla(response);
      expect(errorData.message).toBe(`User with id '${invalidId}' not found`);
    });
  });
});
