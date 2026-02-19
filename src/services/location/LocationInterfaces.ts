import type { LocationResponse, LocationsResponse } from './LocationTypes.js';

export interface ILocationService {
  getById(params: GetLocationByIdParams): Promise<LocationResponse>;
  getMultiple(params?: GetMultipleLocationsParams): Promise<LocationsResponse>;
}

export interface GetLocationByIdParams {
  locationId: string;
}

interface LocationFiltersMap {
  address_text?: string;
  additional_info?: string;
}

export type LocationFilters = {
  [K in keyof LocationFiltersMap]?: LocationFiltersMap[K];
};

export interface GetMultipleLocationsParams {
  filters?: LocationFilters;
}
