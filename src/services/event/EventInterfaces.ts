import type { BookwhenEvent } from './EventTypes.js'; // Import the BookwhenEventDetail type
// import type { Resource, Filters } from '../BaseServiceInterfaces.js'; // Import the Include type

/**
 * Interface for services handling events via the Bookwhen API V2.
 */
export interface IEventService {
  /**
   * Retrieves a single event by its ID.
   * @param eventId The unique identifier of the event.
   * @param include Optional parameter to include additional data.
   * @returns A Promise that resolves to an Event object, as defined by the Bookwhen API data structure.
   */
  getById(params: GetEventByIdParams): Promise<BookwhenEvent>;

  /**
   * Retrieves multiple events based on specified parameters.
   * @param params Optional parameters to filter and control the list of returned events, according to what the Bookwhen API supports.
   * @returns A Promise that resolves to an array of Event objects.
   */
  getMultiple?(params?: GetMultipleEventsParams): Promise<BookwhenEvent[]>;
}

/**
 * Parameters for querying a single event from the Bookwhen API, including optional include parameter.
 * @param eventId The unique identifier of the event.
 * @param include Optional parameter to include additional data.
 */
export interface GetEventByIdParams {
  eventId: string;
  includes?: EventResource[];
}

/**
 * Represents the parameters for getting multiple events.
 * @param filter The filter parameters to apply to the query.
 * @param include The data to side load and include with the returned events.
 */
export interface GetMultipleEventsParams {
  filters?: EventFilters;
  includes?: EventResource[];
}

interface EventFiltersMap {
  calendar?: string[];
  entry?: string[];
  location?: string[];
  tag?: string[];
  title?: string[];
  detail?: string[];
  from?: string;
  to?: string;
  compact?: boolean;
}

export type EventFilters = {
  [K in keyof EventFiltersMap]?: EventFiltersMap[K];
};

export type EventResource =
  | 'location'
  | 'attachments'
  | 'tickets'
  | 'tickets.events'
  | 'tickets.class_passes';
