import { test as base } from '@playwright/test';
import { AuthClient } from '../clients/AuthClient';
import { UsersClient } from '../clients/UsersClient';
import { HealthClient } from '../clients/HealthClient';

export interface ApiFixtures {
  authClient: AuthClient;
  usersClient: UsersClient;
  healthClient: HealthClient;
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
});

export { expect } from '@playwright/test';
