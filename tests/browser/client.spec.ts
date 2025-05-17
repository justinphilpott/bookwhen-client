import { test, expect } from '../test'; // Use the custom MSW-enabled test fixture

test('should initialize client', async ({ page }) => {
  await page.goto('/tests/browser/test-harness.html'); // Keep harness for potential CSS or other setup
  
  const result = await page.evaluate(async () => {
    try {
      const BookwhenClientModule = await import('/dist/index.es.js');
      if (typeof BookwhenClientModule.createBookwhenClient !== 'function') {
        console.error('createBookwhenClient not found in imported module:', BookwhenClientModule);
        return { clientExists: false, hasEvents: false };
      }
      const client = BookwhenClientModule.createBookwhenClient({
        apiKey: 'test-key',
        debug: false
      });
      return {
        clientExists: !!client,
        hasEvents: !!client.events
      };
    } catch (e) {
      console.error('Error importing or initializing client:', e);
      return { clientExists: false, hasEvents: false };
    }
  });

  expect(result.clientExists).toBe(true);
  expect(result.hasEvents).toBe(true);
});

test('should fetch events', async ({ page, worker }) => { // worker fixture is now available
  await page.goto('/tests/browser/test-harness.html'); // Keep harness

  // MSW (via worker fixture from ../test) will handle mocking.
  // The handlers are defined in tests/__mocks__/handlers/events.ts

  const eventsData = await page.evaluate(async () => {
    try {
      const BookwhenClientModule = await import('/dist/index.es.js');
      if (typeof BookwhenClientModule.createBookwhenClient !== 'function') {
        console.error('createBookwhenClient not found in imported module for fetch test:', BookwhenClientModule);
        throw new Error('createBookwhenClient not available in module');
      }
      const client = BookwhenClientModule.createBookwhenClient({
        apiKey: 'test-key',
        // The baseURL will be used by axios, ensure it's something that page.route can intercept
        // or leave it to default if your library constructs full URLs.
        // For this test, the interception is broad ('**/events**'), so baseURL might not be critical
        // as long as the path contains 'events'.
      });

      return client.events.getMultiple({
        filters: {
          from: '20250101',
          to: '20251231'
        },
        includes: ['location']
      });
    } catch (e) {
      console.error('Error in fetch events test evaluation:', e);
      throw e; // Re-throw to fail the test clearly if import fails
    }
  });

  expect(eventsData).toBeDefined();
  expect(Array.isArray(eventsData)).toBe(true);
  expect(eventsData.length).toBeGreaterThan(0);
  expect(eventsData[0].id).toBe('ev-sny5-20250427110000'); // Updated to match MSW mock data
  expect((eventsData[0] as any).relationships?.location).toBeDefined();
});
