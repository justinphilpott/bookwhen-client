import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { BookwhenRequest } from '../../request/BookwhenRequest.js';
import { SERVICE_HTTP_STATUS_CODES } from '../../request/httpStatusCodes.js';
import { handleServiceHTTPErrors } from '../../utils/http-utils.js';
import type {
  GetMultipleLocationsParams,
  ILocationService,
} from './LocationInterfaces.js';
import type { LocationResponse, LocationsResponse } from './LocationTypes.js';
import { GetLocationByIdParamsSchema } from './LocationSchemas.js';

export class LocationService implements ILocationService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getById(
    params: z.infer<typeof GetLocationByIdParamsSchema>,
  ): Promise<LocationResponse> {
    try {
      const validParams = GetLocationByIdParamsSchema.parse(params);
      const query = new BookwhenRequest(`/locations/${validParams.locationId}`);

      const response = await this.axiosInstance.get<LocationResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `locations.getById: Schema Validation failed: ${errorMessages}`,
        );
      }

      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES, {
        404: {
          code: 404,
          message:
            'Location not found. Please check the location ID and try again.',
        },
      });
    }
  }

  async getMultiple(
    params: GetMultipleLocationsParams = {},
  ): Promise<LocationsResponse> {
    try {
      const query = new BookwhenRequest('/locations');
      if (params.filters) {
        query.addFilters(params.filters);
      }

      const response = await this.axiosInstance.get<LocationsResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }
}
