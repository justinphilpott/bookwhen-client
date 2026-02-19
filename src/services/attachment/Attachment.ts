import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { BookwhenRequest } from '../../request/BookwhenRequest.js';
import { SERVICE_HTTP_STATUS_CODES } from '../../request/httpStatusCodes.js';
import { handleServiceHTTPErrors } from '../../utils/http-utils.js';
import type {
  GetMultipleAttachmentsParams,
  IAttachmentService,
} from './AttachmentInterfaces.js';
import type {
  AttachmentResponse,
  AttachmentsResponse,
} from './AttachmentTypes.js';
import { GetAttachmentByIdParamsSchema } from './AttachmentSchemas.js';

export class AttachmentService implements IAttachmentService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getById(
    params: z.infer<typeof GetAttachmentByIdParamsSchema>,
  ): Promise<AttachmentResponse> {
    try {
      const validParams = GetAttachmentByIdParamsSchema.parse(params);
      const query = new BookwhenRequest(
        `/attachments/${validParams.attachmentId}`,
      );

      const response = await this.axiosInstance.get<AttachmentResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `attachments.getById: Schema Validation failed: ${errorMessages}`,
        );
      }

      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES, {
        404: {
          code: 404,
          message:
            'Attachment not found. Please check the attachment ID and try again.',
        },
      });
    }
  }

  async getMultiple(
    params: GetMultipleAttachmentsParams = {},
  ): Promise<AttachmentsResponse> {
    try {
      const query = new BookwhenRequest('/attachments');
      if (params.filters) {
        query.addFilters(params.filters);
      }

      const response = await this.axiosInstance.get<AttachmentsResponse>(
        `${query}`,
      );
      return response.data;
    } catch (error) {
      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }
}
