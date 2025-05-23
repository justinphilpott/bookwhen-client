import { test, expect } from 'vitest';
import { handleApiError } from './http-utils';
import { BookwhenError } from '../types/GlobalTypes';
import { AxiosError } from 'axios';

// Mock DOMException for Node environment
class DOMException extends Error {
  constructor(message: string, name: string = 'DOMException') {
    super(message);
    this.name = name;
  }
}

test('handles Axios errors in Node environment', () => {
  const error = new AxiosError('Network error');
  const result = handleApiError(error, false);

  expect(result.code).toBe('NETWORK_ERROR');
  expect(result.isBrowser).toBe(false);
  expect(result.message).toContain('Network error');
});

test('handles browser security errors with context (mocked)', () => {
  // Mock browser globals
  const originalWindow = global.window;
  const originalNavigator = global.navigator;
  global.window = { isSecureContext: true } as any;
  global.navigator = { userAgent: 'test-agent' } as any;

  try {
    const error = new DOMException('Security error', 'SecurityError');
    const result = handleApiError(error, true);

    expect(result.code).toBe('SECURITY_ERROR');
    expect(result.isBrowser).toBe(true);
    expect(result.context?.browser?.isSecure).toBe(true);
    expect(result.context?.browser?.userAgent).toBe('test-agent');
  } finally {
    // Restore globals
    global.window = originalWindow;
    global.navigator = originalNavigator;
  }
});

test('handles Error objects with SecurityError name', () => {
  const error = new Error('Security policy violation');
  error.name = 'SecurityError';
  const result = handleApiError(error, true);

  expect(result.code).toBe('SECURITY_ERROR');
  expect(result.isBrowser).toBe(true);
  expect(result.context?.browser?.isSecure).toBeUndefined(); // No browser context in Node tests
  expect(result.context?.browser?.userAgent).toBeUndefined();
});

test('handles browser security errors', () => {
  // Create proper DOMException with name
  const error = new DOMException('Security error', 'SecurityError');
  const result = handleApiError(error, true);

  expect(result.code).toBe('SECURITY_ERROR');
  expect(result.isBrowser).toBe(true);
  expect(result.message).toContain('security restriction');
});
