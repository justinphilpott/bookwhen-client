import { test as base, expect } from '@playwright/test';
import type { MockServiceWorker } from 'playwright-msw';
import { createWorkerFixture } from 'playwright-msw';
import { eventHandlers } from './__mocks__/handlers/events.js';

const test = base.extend<{
  worker: MockServiceWorker;
}>({
  worker: createWorkerFixture(eventHandlers, {
    waitForPageLoad: false // We'll handle page loading in tests
  })
});

export { test, expect };
