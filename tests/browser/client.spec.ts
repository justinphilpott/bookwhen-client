import { test, expect } from '../test';
import { createBookwhenClient } from '../../src';

declare global {
  interface Window {
    createBookwhenClient: typeof createBookwhenClient;
  }
}

test('should initialize client', async ({ page }) => {
  await page.goto('/tests/browser/test-harness.html');
  await page.waitForFunction(() => typeof window.createBookwhenClient === 'function');
  
  const result = await page.evaluate(async () => {
    try {
      const createBookwhenClient = window.createBookwhenClient;
      if (typeof createBookwhenClient !== 'function') {
        console.error('createBookwhenClient not found on window');
        return { clientExists: false, hasEvents: false };
      }
      const client = createBookwhenClient({
        apiKey: 'test-key',
        debug: false
      });
      return {
        clientExists: !!client,
        hasEvents: !!client.events
      };
    } catch (e) {
      console.error('Error initializing client:', e);
      return { clientExists: false, hasEvents: false };
    }
  });

  expect(result.clientExists).toBe(true);
  expect(result.hasEvents).toBe(true);
});

test('should fetch events', async ({ page, worker }) => {
  await page.goto('/tests/browser/test-harness.html');
  await page.waitForFunction(() => typeof window.createBookwhenClient === 'function');

  const eventsResponse = await page.evaluate(async () => {
    try {
      const createBookwhenClient = window.createBookwhenClient;
      if (typeof createBookwhenClient !== 'function') {
        throw new Error('createBookwhenClient not available on window');
      }
      const client = createBookwhenClient({
        apiKey: 'test-key',
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
      throw e;
    }
  });

  expect(eventsResponse).toBeDefined();
  expect(eventsResponse.data).toBeDefined();
  expect(Array.isArray(eventsResponse.data)).toBe(true);
  expect(eventsResponse.data.length).toBeGreaterThan(0);
  expect(eventsResponse.data[0].id).toBe('ev-sny5-20250427110000'); // Updated to match MSW mock data
  expect((eventsResponse.data[0] as any).relationships?.location).toBeDefined();
});

test('should fetch a single event by ID', async ({ page }) => {
  await page.goto('/tests/browser/test-harness.html');
  await page.waitForFunction(() => typeof window.createBookwhenClient === 'function');

  const eventResponse = await page.evaluate(async () => {
    try {
      const createBookwhenClient = window.createBookwhenClient;
      if (typeof createBookwhenClient !== 'function') {
        throw new Error('createBookwhenClient not available on window');
      }
      const client = createBookwhenClient({
        apiKey: 'test-key',
      });

      return client.events.getById({
        eventId: 'ev-sny5-20250427110000', // Assuming this ID exists in mock data
        includes: ['location']
      });
    } catch (e) {
      console.error('Error in fetch single event test evaluation:', e);
      throw e;
    }
  });

  expect(eventResponse).toBeDefined();
  expect(eventResponse.data).toBeDefined();
  expect(eventResponse.data.id).toBe('ev-sny5-20250427110000');
  expect((eventResponse.data as any).relationships?.location).toBeDefined();
});
