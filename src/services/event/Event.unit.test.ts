import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { EventService } from './Event.js';
import type { BookwhenEvent } from './EventTypes.js';
import type { EventFilters, EventResource } from './EventInterfaces.js';

describe('EventService', () => {
  let eventService: EventService;
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    // Create a mock instance of axios for dependency injection
    mockAxiosInstance = axios.create();
    eventService = new EventService(mockAxiosInstance); // Inject mock axios instance
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should retrieve a single event by ID', async () => {
    const eventId = '123';
    const eventData: Partial<BookwhenEvent> = {
      id: eventId,
    };

    // Mock Axios request using vi.spyOn
    mockAxiosInstance.get = vi
      .fn()
      .mockResolvedValue({ 
        data: { 
          data: eventData
        } 
      });

    const result = await eventService.getById({ eventId });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/events/${eventId}`);
    expect(result).toEqual({
      data: eventData as BookwhenEvent
    });
  });

  it('should handle error when retrieving a single event by ID', async () => {
    const eventId = '123';
    const errorMessage =
      'Event not found. Please check the event ID and try again.';

    // Mock Axios request using vi.spyOn
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: {
        status: 404,
        data: { message: errorMessage },
      },
    });

    expect(eventService.getById({ eventId })).rejects.toThrow(errorMessage);
  });

  it('should handle error when retrieving multiple events', async () => {
    const errorMessage =
      'BookwhenClient: The requested resource could not be found';

    // Mock Axios request using vi.spyOn
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: {
        status: 404,
        data: { message: errorMessage },
      },
    });

    expect(eventService.getMultiple()).rejects.toThrow(errorMessage);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/events');
  });

  it('should retrieve multiple events', async () => {
    const eventsData: Partial<BookwhenEvent>[] = [
      { id: '1', type: 'event' },
      { id: '2', type: 'event' },
    ];

    // Mock Axios request using vi.spyOn
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { 
        data: eventsData
      },
    });

    const result = await eventService.getMultiple();
    expect(result).toEqual({
      data: eventsData as BookwhenEvent[]
    });
  });

  it('should retrieve multiple events with filters', async () => {
    const filters: EventFilters = {
      title: ['Test Event'],
      from: 'test',
      detail: ['Event Details'],
    };
    const eventsData: Partial<BookwhenEvent>[] = [
      { id: '1', type: 'event' },
      { id: '2', type: 'event' },
    ];

    // Mock Axios request using vi.spyOn
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { 
        data: eventsData
      },
    });

    const result = await eventService.getMultiple({ filters });
    expect(result).toEqual({
      data: eventsData as BookwhenEvent[]
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/events?filter[title]=Test%20Event&filter[from]=test&filter[detail]=Event%20Details',
    );
  });

  it('should retrieve multiple events with includes', async () => {
    const includes: EventResource[] = ['location', 'attachments'];
    const eventsData: Partial<BookwhenEvent>[] = [
      { id: '1', type: 'event' },
      { id: '2', type: 'event' },
    ];

    // Mock Axios request using vi.spyOn
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { 
        data: eventsData
      },
    });

    const result = await eventService.getMultiple({ includes });
    expect(result).toEqual({
      data: eventsData as BookwhenEvent[]
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/events?include=location,attachments',
    );
  });

  it('should retrieve multiple events with includes and filters', async () => {
    const includes: EventResource[] = ['location', 'tickets'];
    const filters = {
      title: ['Workshop'],
      start_at: ['2023-01-01'],
    };
    const eventsData = [
      { id: '1', type: 'event' },
      { id: '2', type: 'event' },
    ];

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { 
        data: eventsData
      },
    });

    const result = await eventService.getMultiple({ filters, includes });
    expect(result).toEqual({
      data: eventsData as BookwhenEvent[]
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/events?filter[title]=Workshop&filter[start_at]=2023-01-01&include=location,tickets',
    );
  });

  describe('optional JSON:API properties', () => {
    it('should return full response when optional properties are present', async () => {
      const includes: EventResource[] = ['location'];
      const eventsData: Partial<BookwhenEvent>[] = [
        { 
          id: '1', 
          type: 'event',
          attributes: {
            title: 'Test Event',
            details: 'Test details',
            all_day: false,
            start_at: '2023-01-01T10:00:00.000Z',
            end_at: '2023-01-01T12:00:00.000Z',
            attendee_limit: 10,
            attendee_count: 0,
            waiting_list: false,
            max_tickets_per_booking: 1,
            tags: [],
            event_image: {
              image_url: '',
              alt_ratio_16x9_1x_url: '',
              alt_ratio_16x9_2x_url: '',
              alt_ratio_16x9_3x_url: '',
              alt_ratio_4x3_1x_url: '',
              alt_ratio_4x3_2x_url: '',
              alt_ratio_4x3_3x_url: '',
              alt_ratio_1x1_1x_url: '',
              alt_ratio_1x1_2x_url: '',
              alt_ratio_1x1_3x_url: ''
            }
          }
        }
      ];
      const includedData = [
        {
          id: 'loc-1',
          type: 'location',
          attributes: {
            address_text: 'Test Location',
            additional_info: 'Test info',
            latitude: 50.0,
            longitude: -0.1,
            zoom: 15,
            map_url: 'https://example.com/map.png'
          }
        }
      ];

      vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
        data: { 
          data: eventsData,
          included: includedData,
          links: { self: '/events' }
        },
      });

      const result = await eventService.getMultiple({ includes });
      expect(result).toEqual({
        data: eventsData as BookwhenEvent[],
        included: includedData,
        links: { self: '/events' }
      });
    });

    it('should return included data when using include parameters', async () => {
      const includes: EventResource[] = ['location'];
      const eventsData: Partial<BookwhenEvent>[] = [
        { 
          id: '1', 
          type: 'event',
          attributes: {
            title: 'Test Event',
            details: 'Test details',
            all_day: false,
            start_at: '2023-01-01T10:00:00.000Z',
            end_at: '2023-01-01T12:00:00.000Z',
            attendee_limit: 10,
            attendee_count: 0,
            waiting_list: false,
            max_tickets_per_booking: 1,
            tags: [],
            event_image: {
              image_url: '',
              alt_ratio_16x9_1x_url: '',
              alt_ratio_16x9_2x_url: '',
              alt_ratio_16x9_3x_url: '',
              alt_ratio_4x3_1x_url: '',
              alt_ratio_4x3_2x_url: '',
              alt_ratio_4x3_3x_url: '',
              alt_ratio_1x1_1x_url: '',
              alt_ratio_1x1_2x_url: '',
              alt_ratio_1x1_3x_url: ''
            }
          }
        }
      ];
      const includedData = [
        {
          id: 'loc-1',
          type: 'location',
          attributes: {
            address_text: 'Test Location',
            additional_info: 'Test info',
            latitude: 50.0,
            longitude: -0.1,
            zoom: 15,
            map_url: 'https://example.com/map.png'
          }
        }
      ];

      vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
        data: { 
          data: eventsData,
          included: includedData,
          links: { self: '/events' }
        },
      });

      const result = await eventService.getMultiple({ includes });
      expect(result).toEqual({
        data: eventsData as BookwhenEvent[],
        included: includedData,
        links: { self: '/events' }
      });
    });

    it('should handle multiple relationship types in included data', async () => {
      const includes: EventResource[] = ['location', 'tickets'];
      const eventsData: any[] = [
        { 
          id: '1', 
          type: 'event',
          attributes: {
            title: 'Test Event',
            details: 'Test details',
            all_day: false,
            start_at: '2023-01-01T10:00:00.000Z',
            end_at: '2023-01-01T12:00:00.000Z',
            attendee_limit: 10,
            attendee_count: 0,
            waiting_list: false,
            max_tickets_per_booking: 1,
            tags: [],
            event_image: {
              image_url: '',
              alt_ratio_16x9_1x_url: '',
              alt_ratio_16x9_2x_url: '',
              alt_ratio_16x9_3x_url: '',
              alt_ratio_4x3_1x_url: '',
              alt_ratio_4x3_2x_url: '',
              alt_ratio_4x3_3x_url: '',
              alt_ratio_1x1_1x_url: '',
              alt_ratio_1x1_2x_url: '',
              alt_ratio_1x1_3x_url: ''
            }
          },
          relationships: {
            location: {
              data: { id: 'loc-1', type: 'location' }
            },
            tickets: {
              data: [
                { id: 'ticket-1', type: 'ticket' },
                { id: 'ticket-2', type: 'ticket' }
              ]
            }
          }
        }
      ];
      const includedData = [
        {
          id: 'loc-1',
          type: 'location',
          attributes: {
            address_text: 'Test Location',
            additional_info: 'Test info',
            latitude: 50.0,
            longitude: -0.1,
            zoom: 15,
            map_url: 'https://example.com/map.png'
          }
        },
        {
          id: 'ticket-1',
          type: 'ticket',
          attributes: {
            name: 'Standard Ticket',
            price: 100,
            available: true
          }
        },
        {
          id: 'ticket-2',
          type: 'ticket',
          attributes: {
            name: 'VIP Ticket',
            price: 200,
            available: false
          }
        }
      ];

      vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
        data: { 
          data: eventsData,
          included: includedData,
          links: { self: '/events' }
        },
      });

      const result = await eventService.getMultiple({ includes });
      expect(result).toEqual({
        data: eventsData,
        included: includedData,
        links: { self: '/events' }
      });
    });
  });
});
