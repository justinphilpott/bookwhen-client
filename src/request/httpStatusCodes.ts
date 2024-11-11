import type { HttpStatus } from '../types/GlobalTypes.js';

export const CLIENT_HTTP_STATUS_CODES: Record<number, HttpStatus> = {
  400: { code: 400, message: 'BookwhenClient: Bad request' },
  401: { code: 401, message: 'BookwhenClient: Unauthorized - check your API key' },
  403: { code: 403, message: 'BookwhenClient: Forbidden - check your permissions' },
  500: { code: 500, message: 'BookwhenClient: Internal server error' },
  502: { code: 502, message: 'BookwhenClient: Bad gateway' },
  503: { code: 503, message: 'BookwhenClient: Service unavailable' },
  504: { code: 504, message: 'BookwhenClient: Gateway timeout' },
};

export const SERVICE_HTTP_STATUS_CODES: Record<number, HttpStatus> = {
  400: { code: 400, message: 'BookwhenClient: Bad request' },
  404: { code: 404, message: 'BookwhenClient: The requested resource could not be found' },
  429: { code: 429, message: 'BookwhenClient: Rate limit exceeded' },
};