import { test, expect } from '../../src/fixtures/test.fixture';
import {
  validatePaginationMetadata,
  validatePageUniqueness,
} from '../../src/utils/pagination-validator';

test.describe('Collection Pagination & Filtering Suite @pagination', () => {
  test('should validate default pagination behavior when parameters are omitted @smoke', async ({
    usersClient,
  }) => {
    const response = await usersClient.getUsers();

    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);

    const validation = validatePaginationMetadata(response);
    expect(validation.isValid).toBe(true);
    expect(response.data.users.length).toBeGreaterThan(0);
  });

  test('should retrieve specific page with explicit limit and skip parameters', async ({
    usersClient,
  }) => {
    const limit = 5;
    const skip = 10;
    const response = await usersClient.getUsers({ limit, skip });

    expect(response.status).toBe(200);
    const validation = validatePaginationMetadata(response, limit, skip);
    expect(validation.isValid).toBe(true);
    expect(response.data.users[0].id).toBe(11);
  });

  test('should verify items across consecutive paginated requests are distinct with zero overlap', async ({
    usersClient,
  }) => {
    const page1Response = await usersClient.getUsers({ limit: 5, skip: 0 });
    const page2Response = await usersClient.getUsers({ limit: 5, skip: 5 });

    expect(page1Response.status).toBe(200);
    expect(page2Response.status).toBe(200);

    const isDistinct = validatePageUniqueness(page1Response.data, page2Response.data);
    expect(isDistinct).toBe(true);
  });

  test('should handle large valid limit parameters correctly', async ({
    usersClient,
  }) => {
    const largeLimit = 100;
    const response = await usersClient.getUsers({ limit: largeLimit });

    expect(response.status).toBe(200);
    const validation = validatePaginationMetadata(response, largeLimit, 0);
    expect(validation.isValid).toBe(true);
    expect(response.data.users.length).toBeLessThanOrEqual(largeLimit);
  });
});
