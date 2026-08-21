import { CreateUserRequest, UpdateUserRequest } from '../models/user.model';
import { LoginRequest } from '../models/auth.model';
import { config } from '../config/env.config';

/**
 * Generates dynamic CreateUserRequest test data with optional overrides
 */
export function buildCreateUserPayload(
  overrides?: Partial<CreateUserRequest>
): CreateUserRequest {
  const timestamp = Date.now();
  return {
    firstName: `TestUser_${timestamp}`,
    lastName: 'Automation',
    email: `test.user_${timestamp}@example.com`,
    age: 28,
    username: `qa_user_${timestamp}`,
    role: 'user',
    ...overrides,
  };
}

/**
 * Generates dynamic UpdateUserRequest test data with optional overrides
 */
export function buildUpdateUserPayload(
  overrides?: Partial<UpdateUserRequest>
): UpdateUserRequest {
  const timestamp = Date.now();
  return {
    firstName: `UpdatedFirst_${timestamp}`,
    lastName: 'UpdatedLast',
    email: `updated.email_${timestamp}@example.com`,
    age: 32,
    ...overrides,
  };
}

/**
 * Returns valid login credentials from configuration
 */
export function buildValidLoginPayload(
  overrides?: Partial<LoginRequest>
): LoginRequest {
  return {
    username: config.defaultUsername,
    password: config.defaultPassword,
    ...overrides,
  };
}

/**
 * Generates invalid login payload for negative testing
 */
export function buildInvalidLoginPayload(): LoginRequest {
  return {
    username: 'invalid_user_name_xyz',
    password: 'wrong_password_123',
  };
}
