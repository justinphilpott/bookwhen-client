export interface HttpStatus {
  code: number;
  message: string;
}

export type Resource = string;
export type Resources = Resource[];

export interface Filters {
  [key: string]: string | string[] | boolean;
}

export interface BookwhenError {
  code:
    | 'NETWORK_ERROR'
    | 'SECURITY_ERROR'
    | 'API_ERROR'
    | 'CONFIG_ERROR'
    | 'UNKNOWN_ERROR';
  message: string;
  isBrowser: boolean;
  context?: {
    browser?: {
      isSecure?: boolean;
      userAgent?: string;
    };
    timestamp: number;
  };
}
