export interface ClassPassAttributes {
  title: string;
  details: string;
  usage_allowance: number;
  usage_type: 'personal' | 'any' | string;
  number_available: number | null;
  use_restricted_for_days: number | null;
}

export interface BookwhenClassPass {
  id: string;
  type: string;
  attributes: ClassPassAttributes;
}

export interface JsonApiResponse<T> {
  data: T;
  included?: any[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  meta?: {
    page?: {
      current?: number;
      total?: number;
      size?: number;
    };
  };
}

export interface ClassPassesResponse
  extends JsonApiResponse<BookwhenClassPass[]> {}

export interface ClassPassResponse extends JsonApiResponse<BookwhenClassPass> {}
