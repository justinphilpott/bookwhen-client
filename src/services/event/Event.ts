// src/services/EventService.ts
import type {
  IEventService,
  GetAllEventsParams,
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

const DEFAULT_MAX_PAGES = 100;
const ABSOLUTE_URL_PATTERN = /^([a-z][a-z\d+\-.]*:)?\/\//i;

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
  ): Promise<EventResponse> {
    try {
      const validParams = GetEventByIdParamsSchema.parse(params);

      const query = new BookwhenRequest(`/events/${validParams.eventId}`);
      if (validParams.includes) {
        query.addIncludes(validParams.includes);
      }

      const response = await this.axiosInstance.get<EventResponse>(`${query}`);
      return response.data;
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
   * Retrieves a single page of events based on filtering and pagination parameters.
   * The Bookwhen API returns up to 20 events per page by default.
   *
   * @param {GetMultipleEventsParams} params - Optional parameters for filtering and pagination.
   * @return {Promise<EventsResponse>} A Promise that resolves to the full JSON:API response object.
   */
  async getMultiple(
    params: GetMultipleEventsParams = {},
  ): Promise<EventsResponse> {
    try {
      const query = new BookwhenRequest('/events');
      if (params.includes) query.addIncludes(params.includes);
      if (params.filters) query.addFilters(params.filters);

      const response = await this.axiosInstance.get<EventsResponse>(`${query}`); // uses the toString method
      return response.data;
    } catch (error) {
      handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
    }
  }

  /**
   * Retrieves all events matching the given filters, automatically following
   * pagination links to fetch every page of results.
   *
   * The returned response contains the combined `data` and deduplicated
   * `included` arrays from all pages.
   *
   * @param {GetAllEventsParams} params - Optional filtering and pagination safety parameters.
   * @return {Promise<EventsResponse>} A Promise that resolves to the combined JSON:API response.
   */
  async getAll(params: GetAllEventsParams = {}): Promise<EventsResponse> {
    const { maxPages = DEFAULT_MAX_PAGES, ...queryParams } = params;

    if (!Number.isSafeInteger(maxPages) || maxPages < 1) {
      throw new Error(
        'events.getAll: maxPages must be a positive safe integer',
      );
    }

    const firstPage = await this.getMultiple(queryParams);

    if (!firstPage?.data || !firstPage.links?.next) {
      return firstPage;
    }

    const allData = [...firstPage.data];
    const includedById = new Map<string, any>();

    if (firstPage.included) {
      for (const item of firstPage.included) {
        includedById.set(`${item.type}:${item.id}`, item);
      }
    }

    let nextUrl: string | undefined = firstPage.links.next;
    let pageCount = 1;
    const configuredBaseURL = this.axiosInstance.defaults.baseURL;
    const browserURL =
      typeof window !== 'undefined' ? window.location.href : undefined;
    let trustedBaseURL: URL | undefined;

    try {
      trustedBaseURL = browserURL
        ? new URL(configuredBaseURL ?? '', browserURL)
        : new URL(configuredBaseURL ?? '');
    } catch {
      // Relative pagination links remain safe without a resolvable base URL.
    }

    const resolvePaginationUrl = (paginationUrl: string) => {
      let requestUrl = paginationUrl;
      let canonicalUrl: URL | undefined;

      if (ABSOLUTE_URL_PATTERN.test(paginationUrl)) {
        if (!trustedBaseURL) {
          throw new Error(
            'events.getAll: Cannot validate an absolute pagination URL without a trusted base URL',
          );
        }

        canonicalUrl = new URL(paginationUrl, trustedBaseURL);

        if (canonicalUrl.origin !== trustedBaseURL.origin) {
          throw new Error(
            'events.getAll: Refusing a pagination URL from a different origin',
          );
        }

        requestUrl = canonicalUrl.href;
      } else if (trustedBaseURL) {
        canonicalUrl = configuredBaseURL
          ? new URL(
              `${trustedBaseURL.href.replace(/\/?\/$/, '')}/${paginationUrl.replace(/^\/+/, '')}`,
            )
          : new URL(paginationUrl, trustedBaseURL);
      }

      if (canonicalUrl) {
        canonicalUrl.hash = '';
        return { requestUrl, key: canonicalUrl.href };
      }

      return { requestUrl, key: paginationUrl.replace(/#.*$/, '') };
    };

    const initialPageQuery = new BookwhenRequest('/events');
    if (queryParams.includes) initialPageQuery.addIncludes(queryParams.includes);
    if (queryParams.filters) initialPageQuery.addFilters(queryParams.filters);

    const visitedUrls = new Set<string>([
      resolvePaginationUrl(`${initialPageQuery}`).key,
    ]);

    while (nextUrl) {
      if (pageCount >= maxPages) {
        throw new Error(
          `events.getAll: Reached the ${maxPages}-page pagination limit`,
        );
      }

      const { requestUrl, key: paginationUrlKey } =
        resolvePaginationUrl(nextUrl);

      if (visitedUrls.has(paginationUrlKey)) {
        throw new Error(
          'events.getAll: Refusing to follow a repeated pagination URL',
        );
      }

      visitedUrls.add(paginationUrlKey);

      try {
        const page: EventsResponse = (
          await this.axiosInstance.get<EventsResponse>(requestUrl)
        ).data;

        pageCount += 1;

        if (page.data) {
          allData.push(...page.data);
        }

        if (page.included) {
          for (const item of page.included) {
            includedById.set(`${item.type}:${item.id}`, item);
          }
        }

        nextUrl = page.links?.next;
      } catch (error) {
        handleServiceHTTPErrors(error, SERVICE_HTTP_STATUS_CODES);
      }
    }

    return {
      data: allData,
      included:
        includedById.size > 0
          ? Array.from(includedById.values())
          : undefined,
    };
  }
}
