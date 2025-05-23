import { AxiosError } from 'axios';
import type { BookwhenError, HttpStatus } from '../types/GlobalTypes.js';

export function handleApiError(
  error: unknown,
  isBrowser: boolean,
): BookwhenError {
  const timestamp = Date.now();

  // Handle Axios errors
  if (error instanceof AxiosError) {
    return {
      code: 'NETWORK_ERROR',
      message: isBrowser
        ? 'Failed to communicate with Bookwhen API'
        : `Network error: ${error.message}`,
      isBrowser,
      context: { timestamp },
    };
  }

  // Handle browser security errors
  if (
    isBrowser &&
    (error instanceof DOMException ||
      (error instanceof Error && error.name === 'SecurityError'))
  ) {
    return {
      code: 'SECURITY_ERROR',
      message: 'Browser security restriction prevented API access',
      isBrowser: true,
      context: isBrowser
        ? {
            browser: {
              isSecure:
                typeof window !== 'undefined'
                  ? window.isSecureContext
                  : undefined,
              userAgent:
                typeof navigator !== 'undefined'
                  ? navigator.userAgent
                  : undefined,
            },
            timestamp,
          }
        : { timestamp },
    };
  }

  // Fallback for unknown errors
  return {
    code: 'UNKNOWN_ERROR',
    message: isBrowser ? 'An unexpected error occurred' : String(error),
    isBrowser,
    context: { timestamp },
  };
}

// Keep existing error handler for backwards compatibility
export function handleServiceHTTPErrors(
  error: any,
  statusCodes: Record<number, HttpStatus>,
  methodErrors: Record<number, HttpStatus> = {},
): never {
  if (error.response) {
    const status = error.response.status;
    const errorMessage =
      methodErrors[status]?.message ||
      statusCodes[status]?.message ||
      `Unhandled service error with status code: ${status}`;
    throw new Error(errorMessage);
  }
  throw new Error('An unexpected network or client error occurred');
}
