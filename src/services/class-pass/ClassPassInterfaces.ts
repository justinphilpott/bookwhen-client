import type {
  ClassPassResponse,
  ClassPassesResponse,
} from './ClassPassTypes.js';

export interface IClassPassService {
  getById(params: GetClassPassByIdParams): Promise<ClassPassResponse>;
  getMultiple(
    params?: GetMultipleClassPassesParams,
  ): Promise<ClassPassesResponse>;
}

export interface GetClassPassByIdParams {
  classPassId: string;
}

interface ClassPassFiltersMap {
  title?: string;
  detail?: string;
  usage_type?: 'personal' | 'any';
  cost?: string;
  usage_allowance?: string;
  use_restricted_for_days?: string;
}

export type ClassPassFilters = {
  [K in keyof ClassPassFiltersMap]?: ClassPassFiltersMap[K];
};

export interface GetMultipleClassPassesParams {
  filters?: ClassPassFilters;
}
