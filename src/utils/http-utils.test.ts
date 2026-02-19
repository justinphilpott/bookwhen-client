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
  const originalWindow = (globalThis as any).window;
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    'navigator',
  );

  Object.defineProperty(globalThis, 'window', {
    value: { isSecureContext: true },
    configurable: true,
  });

  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'test-agent' },
    configurable: true,
  });

  try {
    const error = new DOMException('Security error', 'SecurityError');
    const result = handleApiError(error, true);

    expect(result.code).toBe('SECURITY_ERROR');
    expect(result.isBrowser).toBe(true);
    expect(result.context?.browser?.isSecure).toBe(true);
    expect(result.context?.browser?.userAgent).toBe('test-agent');
  } finally {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
    });

    if (navigatorDescriptor) {
      Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
    } else {
      delete (globalThis as any).navigator;
    }
  }
});

test('handles Error objects with SecurityError name', () => {
  const error = new Error('Security policy violation');
  error.name = 'SecurityError';
  const result = handleApiError(error, true);

  expect(result.code).toBe('SECURITY_ERROR');
  expect(result.isBrowser).toBe(true);
  expect(result.context?.timestamp).toBeTypeOf('number');
});

test('handles browser security errors', () => {
  // Create proper DOMException with name
  const error = new DOMException('Security error', 'SecurityError');
  const result = handleApiError(error, true);

  expect(result.code).toBe('SECURITY_ERROR');
  expect(result.isBrowser).toBe(true);
  expect(result.message).toContain('security restriction');
});
