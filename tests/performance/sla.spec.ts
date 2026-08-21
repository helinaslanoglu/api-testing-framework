import { test, expect } from '../../src/fixtures/test.fixture';
import { assertSla } from '../../src/utils/sla-validator';
import {
  buildCreateUserPayload,
  buildValidLoginPayload,
} from '../../src/data/user.factory';

test.describe('API Latency & SLA Performance Suite', () => {
  test('should return Users List response within SLA threshold', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUsers({ limit: 5 });

    expect(response.status).toBe(200);
    expect(response.responseTimeMs).toBeGreaterThan(0);
    expect(typeof response.responseTimeMs).toBe('number');

    // Validate SLA performance threshold (3000ms default)
    assertSla(response, { endpoint: '/users', method: 'GET', thresholdMs: 3000 });
  });

  test('should return Single User response within SLA threshold', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUser(1);

    expect(response.status).toBe(200);
    expect(response.responseTimeMs).toBeGreaterThan(0);

    assertSla(response, { endpoint: '/users/1', method: 'GET', thresholdMs: 3000 });
  });

  test('should execute Auth Login request within SLA threshold', async ({
    authClient,
  }) => {
    const payload = buildValidLoginPayload();
    const response = await authClient.login(payload);

    expect(response.status).toBe(200);
    expect(response.responseTimeMs).toBeGreaterThan(0);

    assertSla(response, { endpoint: '/auth/login', method: 'POST', thresholdMs: 3000 });
  });

  test('should execute User Creation request within SLA threshold', async ({
    usersClient,
  }) => {
    const payload = buildCreateUserPayload();
    const response = await usersClient.createUser(payload);

    expect(response.status).toBe(201);
    expect(response.responseTimeMs).toBeGreaterThan(0);

    assertSla(response, { endpoint: '/users/add', method: 'POST', thresholdMs: 3000 });
  });
});
