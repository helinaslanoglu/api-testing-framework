import { test, expect } from '../../src/fixtures/test.fixture';
import { assertSchemaMatch } from '../../src/utils/schema-validator';
import {
  usersListSchema,
  userSchema,
  createUserResponseSchema,
  deleteUserResponseSchema,
} from '../../src/models/schemas/user.schema';
import {
  loginResponseSchema,
  authMeSchema,
} from '../../src/models/schemas/auth.schema';
import { apiErrorSchema } from '../../src/models/schemas/common.schema';
import {
  buildCreateUserPayload,
  buildValidLoginPayload,
} from '../../src/data/user.factory';

test.describe('API JSON Schema & Response Contract Validation Suite @contract', () => {
  test('should validate Users List response against UsersList schema', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUsers({ limit: 3 });
    expect(response.status).toBe(200);

    const validatedData = assertSchemaMatch(usersListSchema, response.data, 'UsersListResponse');
    expect(validatedData.users.length).toBeGreaterThan(0);
  });

  test('should validate Single User response against User schema', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUser(1);
    expect(response.status).toBe(200);

    const validatedUser = assertSchemaMatch(userSchema, response.data, 'UserResponse');
    expect(validatedUser.id).toBe(1);
    expect(validatedUser.email).toBeDefined();
  });

  test('should validate Create User response against CreateUserResponse schema', async ({
    usersClient,
  }) => {
    const payload = buildCreateUserPayload();
    const response = await usersClient.createUser(payload);
    expect(response.status).toBe(201);

    const validatedCreatedUser = assertSchemaMatch(
      createUserResponseSchema,
      response.data,
      'CreateUserResponse'
    );
    expect(validatedCreatedUser.firstName).toBe(payload.firstName);
  });

  test('should validate Delete User response against DeleteUserResponse schema', async ({
    usersClient,
  }) => {
    const response = await usersClient.deleteUser(1);
    expect(response.status).toBe(200);

    const validatedDeletedUser = assertSchemaMatch(
      deleteUserResponseSchema,
      response.data,
      'DeleteUserResponse'
    );
    expect(validatedDeletedUser.isDeleted).toBe(true);
  });

  test('should validate Login response against LoginResponse schema', async ({
    authClient,
  }) => {
    const loginPayload = buildValidLoginPayload();
    const response = await authClient.login(loginPayload);
    expect(response.status).toBe(200);

    const validatedLogin = assertSchemaMatch(
      loginResponseSchema,
      response.data,
      'LoginResponse'
    );
    expect(validatedLogin.accessToken.length).toBeGreaterThan(10);
  });

  test('should validate Auth Me response against AuthMe schema', async ({
    authClient,
  }) => {
    const loginResponse = await authClient.login(buildValidLoginPayload());
    const token = loginResponse.data.accessToken;

    const response = await authClient.getCurrentUser(token);
    expect(response.status).toBe(200);

    const validatedProfile = assertSchemaMatch(authMeSchema, response.data, 'AuthMeResponse');
    expect(validatedProfile.id).toBeDefined();
  });

  test('should validate API Error response against ApiError schema', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUser(99999);
    expect(response.status).toBe(404);

    const validatedError = assertSchemaMatch(apiErrorSchema, response.data, 'ApiErrorResponse');
    expect(validatedError.message).toBe("User with id '99999' not found");
  });
});
