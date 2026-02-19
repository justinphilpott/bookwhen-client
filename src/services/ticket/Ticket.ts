import type { AxiosInstance } from 'axios';
import { z } from 'zod';
import { BookwhenRequest } from '../../request/BookwhenRequest.js';
import { SERVICE_HTTP_STATUS_CODES } from '../../request/httpStatusCodes.js';
import { handleServiceHTTPErrors } from '../../utils/http-utils.js';
import type {
  GetMultipleTicketsParams,
  ITicketService,
} from './TicketInterfaces.js';
import type { TicketResponse, TicketsResponse } from './TicketTypes.js';
import {
  GetMultipleTicketsParamsSchema,
  GetTicketByIdParamsSchema,
} from './TicketSchemas.js';

export class TicketService implements ITicketService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getById(
    params: z.infer<typeof GetTicketByIdParamsSchema>,
  ): Promise<TicketResponse> {
    try {
      const validParams = GetTicketByIdParamsSchema.parse(params);
      const query = new BookwhenRequest(`/tickets/${validParams.ticketId}`);

      if (validParams.includes) {
        query.addIncludes(validParams.includes);
      }

      const response = await this.axiosInstance.get<TicketResponse>(`${query}`);
      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `tickets.getById: Schema Validation failed: ${errorMessages}`,
        );
      }

      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES, {
        404: {
          code: 404,
          message:
            'Ticket not found. Please check the ticket ID and try again.',
        },
      });
    }
  }

  async getMultiple(
    params: GetMultipleTicketsParams,
  ): Promise<TicketsResponse> {
    try {
      const validParams = GetMultipleTicketsParamsSchema.parse(params);
      const queryParts = [`event=${encodeURIComponent(validParams.eventId)}`];

      if (validParams.includes?.length) {
        queryParts.push(`include=${validParams.includes.join(',')}`);
      }

      const response = await this.axiosInstance.get<TicketsResponse>(
        `/tickets?${queryParts.join('&')}`,
      );

      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `tickets.getMultiple: Schema Validation failed: ${errorMessages}`,
        );
      }

      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }
}
