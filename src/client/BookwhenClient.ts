// src/clients/BookwhenClient.ts
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { EventService } from '../services/event/Event.js'; // Ensure this file and class are setup accordingly
import { TicketService } from '../services/ticket/Ticket.js';
import { CLIENT_HTTP_STATUS_CODES } from '../request/httpStatusCodes.js';

/**
 * Client for the Bookwhen API.
 *
 * @see https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml#/ClassPass/get_class_passes__class_pass_id_
 */
export class BookwhenClient {
  private eventService?: EventService;
  private ticketService?: TicketService;
  private readonly isBrowser: boolean;

  /**
   * Creates a new instance of the BookwhenClient class.
   * @param axiosInstance - Configured Axios instance for making HTTP requests.
   * @throws Error if axiosInstance is not provided.
   */
  constructor(private axiosInstance: AxiosInstance) {
    this.isBrowser =
      typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (!axiosInstance) {
      throw new Error('BookwhenClient - you must provide an axios instance');
    }
  }

  /**
   * Gets the EventService instance.
   *
   * Available methods:
   * - getById(params: GetEventByIdParams): Promise<BookwhenEvent>
   * - getMultiple(params: GetMultipleEventsParams): Promise<BookwhenEvent[]>
   *
   * @returns The EventService instance.
   */
  get events(): EventService {
    if (!this.eventService) {
      this.eventService = new EventService(this.axiosInstance);
    }
    return this.eventService;
  }

  get tickets(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(this.axiosInstance);
    }

    return this.ticketService;
  }
}

interface BookwhenClientOptions {
  apiKey: string;
  baseURL?: string;
  debug?: boolean;
}

/**
 * Creates an instance of Axios with the provided API key.
 * @param apiKey - The API key used for authentication.
 * @returns The Axios instance.
 */
export function createBookwhenClient(
  options: BookwhenClientOptions,
): BookwhenClient {
  const {
    apiKey,
    baseURL = 'https://api.bookwhen.com/v2',
    debug = false,
  } = options;

  const axiosInstance = axios.create({
    baseURL: baseURL,
    auth: { username: apiKey, password: '' },
  });

  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    axiosInstance.defaults.withCredentials = true;
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        const clientError = CLIENT_HTTP_STATUS_CODES[status];
        if (clientError) {
          return Promise.reject(new Error(clientError.message));
        }
      } else if (error.request) {
        throw new Error('No response received from the server');
      } else {
        throw new Error('An error occurred setting up the request');
      }
      return Promise.reject(error);
    },
  );

  if (debug) {
    // Add a request interceptor to log the details
    axiosInstance.interceptors.request.use((request) => {
      console.log('Bookwhen Request Debug:', {
        request: request,
      });
      return request;
    });
  }

  return new BookwhenClient(axiosInstance);
}
