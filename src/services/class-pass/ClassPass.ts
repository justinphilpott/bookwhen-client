import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { BookwhenRequest } from '../../request/BookwhenRequest.js';
import { SERVICE_HTTP_STATUS_CODES } from '../../request/httpStatusCodes.js';
import { handleServiceHTTPErrors } from '../../utils/http-utils.js';
import type {
  GetMultipleClassPassesParams,
  IClassPassService,
} from './ClassPassInterfaces.js';
import type {
  ClassPassResponse,
  ClassPassesResponse,
} from './ClassPassTypes.js';
import { GetClassPassByIdParamsSchema } from './ClassPassSchemas.js';

export class ClassPassService implements IClassPassService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getById(
    params: z.infer<typeof GetClassPassByIdParamsSchema>,
  ): Promise<ClassPassResponse> {
    try {
      const validParams = GetClassPassByIdParamsSchema.parse(params);
      const query = new BookwhenRequest(
        `/class_passes/${validParams.classPassId}`,
      );

      const response = await this.axiosInstance.get<ClassPassResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `classPasses.getById: Schema Validation failed: ${errorMessages}`,
        );
      }

      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES, {
        404: {
          code: 404,
          message:
            'Class pass not found. Please check the class pass ID and try again.',
        },
      });
    }
  }

  async getMultiple(
    params: GetMultipleClassPassesParams = {},
  ): Promise<ClassPassesResponse> {
    try {
      const query = new BookwhenRequest('/class_passes');
      if (params.filters) {
        query.addFilters(params.filters);
      }

      const response = await this.axiosInstance.get<ClassPassesResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }
}
