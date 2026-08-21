import { test as base } from '@playwright/test';
import { AuthClient } from '../clients/AuthClient';
import { UsersClient } from '../clients/UsersClient';
import { HealthClient } from '../clients/HealthClient';
import { buildValidLoginPayload } from '../data/user.factory';

export interface ApiFixtures {
  authClient: AuthClient;
  usersClient: UsersClient;
  healthClient: HealthClient;
  authenticatedUsersClient: {
    token: string;
    usersClient: UsersClient;
    authClient: AuthClient;
  };
}

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    const client = new AuthClient(request);
    await use(client);
  },

  usersClient: async ({ request }, use) => {
    const client = new UsersClient(request);
    await use(client);
  },

  healthClient: async ({ request }, use) => {
    const client = new HealthClient(request);
    await use(client);
  },

  authenticatedUsersClient: async ({ request }, use) => {
    const authClient = new AuthClient(request);
    const usersClient = new UsersClient(request);
    const loginPayload = buildValidLoginPayload();
    const loginResponse = await authClient.login(loginPayload);

    if (!loginResponse.ok || !loginResponse.data.accessToken) {
      throw new Error(`[Auth Fixture Error] Setup login failed: status ${loginResponse.status}`);
    }

    await use({
      token: loginResponse.data.accessToken,
      usersClient,
      authClient,
    });
  },
});

export { expect } from '@playwright/test';
