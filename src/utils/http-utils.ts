import type { HttpStatus } from '../types/GlobalTypes.js';

/**
 * Handles errors for service methods
 * @param error The error object caught in service methods.
 * @param statusCodes General service-level status codes and messages.
 * @param methodErrors Optional method-specific error messages.
 */
export function handleServiceHTTPErrors(error: any, statusCodes: Record<number, HttpStatus>, methodErrors: Record<number, HttpStatus> = {}): never {
  if (error.response) {
      const status = error.response.status;
      // First, check for method-specific errors, then fall back to general service errors
      const errorMessage = methodErrors[status]?.message || statusCodes[status]?.message || `Unhandled service error with status code: ${status}`;
      throw new Error(errorMessage);
  } else {
      // If no response was received, this is likely a serious client or network issue
      throw new Error("An unexpected network or client error occurred, with no response property.");
  }
}
