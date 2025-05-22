// src/services/EventService.ts
import type {
  IEventService,
  GetMultipleEventsParams,
  GetEventByIdParams,
} from './EventInterfaces.js';
import type {
  EventsResponse,
  EventResponse,
  BookwhenEvent,
} from './EventTypes.js';
import { handleServiceHTTPErrors } from '../../utils/http-utils.js';
import { SERVICE_HTTP_STATUS_CODES } from '../../request/httpStatusCodes.js';
import { BookwhenRequest } from '../../request/BookwhenRequest.js';
import type { AxiosInstance } from 'axios';
import { GetEventByIdParamsSchema } from './EventSchemas.js';
import { z } from 'zod';

/**
 * Service class for managing events in the Bookwhen API.
 */
export class EventService implements IEventService {
  private axiosInstance: AxiosInstance;

  /**
   * Initializes EventService with an Axios instance for dependency injection.
   * @param axiosInstance - The Axios instance to use for API requests.
   */
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Retrieves a single event by its ID from the Bookwhen API.
   *
   * @param {Object} param - The parameters for retrieving an event.
   * @param {string} param.eventId - The ID of the event to retrieve.
   * @param {string} [param.include] - Optional parameter to include additional data.
   * @returns {Promise<BookwhenEvent>} A Promise that resolves to the BookwhenEvent object.
   */
  async getById(
    params: z.infer<typeof GetEventByIdParamsSchema>,
  ): Promise<BookwhenEvent> {
    try {
      const validParams = GetEventByIdParamsSchema.parse(params);

      const query = new BookwhenRequest(`/events/${validParams.eventId}`);
      if (validParams.includes) {
        query.addIncludes(validParams.includes);
      }

      const response = await this.axiosInstance.get<EventResponse>(`${query}`);
      return response.data?.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new Error(
          `events.getById: Schema Validation failed: ${errorMessages}`,
        );
      } else {
        handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES, {
          404: {
            code: 404,
            message:
              'Event not found. Please check the event ID and try again.',
          },
        });
      }
    }
  }

  /**
   * Retrieves multiple events based on filtering and pagination parameters.
   *
   * @param {GetMultipleEventsParams} params - Optional parameters for filtering and pagination.
   * @return {Promise<BookwhenEvent[]>} A Promise that resolves to an array of BookwhenEvent objects.
   */
  async getMultiple(
    params: GetMultipleEventsParams = {},
  ): Promise<BookwhenEvent[]> {
    try {
      const query = new BookwhenRequest('/events');
      if (params.includes) query.addIncludes(params.includes);
      if (params.filters) query.addFilters(params.filters);

      const response = await this.axiosInstance.get<EventsResponse>(`${query}`); // uses the toString method
      return response.data.data;
    } catch (error) {
      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }
}
