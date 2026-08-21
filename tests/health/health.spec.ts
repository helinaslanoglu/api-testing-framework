import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('Health Check API @health', () => {
  test('should confirm API service availability and return HTTP 200 @smoke', async ({ healthClient }) => {
    const response = await healthClient.checkHealth();

    // Validate HTTP Status & State
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);

    // Validate Headers
    expect(response.headers['content-type']).toContain('application/json');

    // Validate Response Structure
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.users)).toBe(true);
    expect(response.data.users.length).toBeGreaterThan(0);
    expect(typeof response.data.total).toBe('number');
  });
});
