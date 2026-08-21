import { faker } from '@faker-js/faker';
import { CreateUserRequest, UpdateUserRequest } from '../models/user.model';
import { LoginRequest } from '../models/auth.model';
import { config } from '../config/env.config';

/**
 * Optionally seeds Faker.js for reproducible deterministic dynamic data generation
 */
export function seedFaker(seed?: number): void {
  if (seed !== undefined) {
    faker.seed(seed);
  }
}

/**
 * Generates dynamic CreateUserRequest test data using Faker.js
 */
export function buildCreateUserPayload(
  overrides?: Partial<CreateUserRequest>
): CreateUserRequest {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    age: faker.number.int({ min: 20, max: 60 }),
    username: `${firstName.toLowerCase()}_${faker.number.int({ min: 100, max: 999 })}`,
    role: 'user',
    ...overrides,
  };
}

/**
 * Generates dynamic UpdateUserRequest test data using Faker.js
 */
export function buildUpdateUserPayload(
  overrides?: Partial<UpdateUserRequest>
): UpdateUserRequest {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName: `Updated_${firstName}`,
    lastName,
    email: faker.internet.email({ firstName: `updated_${firstName}`, lastName }),
    age: faker.number.int({ min: 22, max: 62 }),
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
 * Generates invalid login payload for negative testing using Faker.js
 */
export function buildInvalidLoginPayload(): LoginRequest {
  return {
    username: `invalid_${faker.string.alphanumeric(10)}`,
    password: `wrong_${faker.string.alphanumeric(10)}`,
  };
}

/**
 * Generates empty login payload for missing credential testing
 */
export function buildEmptyLoginPayload(): LoginRequest {
  return {} as LoginRequest;
}

/**
 * Generates login payload missing password
 */
export function buildMissingPasswordLoginPayload(): LoginRequest {
  return {
    username: config.defaultUsername,
  } as LoginRequest;
}
