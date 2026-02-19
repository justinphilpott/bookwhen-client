export interface LocationAttributes {
  address_text: string;
  additional_info: string;
  latitude: number;
  longitude: number;
  zoom: number;
  map_url: string;
}

export interface BookwhenLocation {
  id: string;
  type: string;
  attributes: LocationAttributes;
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

export interface LocationsResponse
  extends JsonApiResponse<BookwhenLocation[]> {}

export interface LocationResponse extends JsonApiResponse<BookwhenLocation> {}
