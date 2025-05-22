import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import { BookwhenClient } from './BookwhenClient.js';
import type { EventResource } from '../services/event/EventInterfaces.js';
import { EventService } from '../services/event/Event.js';

vi.mock('axios');
vi.mock('../src/services/event/Event');

describe('BookwhenClient Integration', () => {
  describe('BookwhenClient - Events Service', () => {
    it('should call the correct endpoint when getById is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: { id: 'event123' },
          },
        }),
      } as unknown as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);
      const eventId = 'event123';
      const event = await client.events.getById({ eventId });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/events/event123');
      expect(event).toEqual({ id: 'event123' });
    });

    it('should call the correct endpoint with correct parameters when events.getMultiple is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: [{ id: 'event1' }, { id: 'event2' }],
          },
        }),
      } as unknown as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);
      const includes: EventResource[] = ['location', 'tickets'];
      const filters = {
        title: ['Workshop'],
        start_at: ['2023-01-01'],
      };
      const eventsData = [
        { id: '1', type: 'event' },
        { id: '2', type: 'event' },
      ];
      const events = await client.events.getMultiple({ includes, filters });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/events?filter[title]=Workshop&filter[start_at]=2023-01-01&include=location,tickets',
      );
      expect(events).toEqual([{ id: 'event1' }, { id: 'event2' }]);
    });

    it('should correctly initialize and expose the events service via the client', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);
      const eventsService = client.events;

      expect(eventsService).toBeInstanceOf(EventService);
    });

    it('should use the same axios instance in events service as in the BookwhenClient', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);
      const eventsService = client.events;

      expect(eventsService['axiosInstance']).toBe(client['axiosInstance']);
    });

    it('should handle errors thrown by the events service methods', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue(new Error('Network Error')),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);

      // @ts-ignore - Testing invalid parameter type
      await expect(client.events.getById(453453)).rejects.toThrow(
        'events.getById: Schema Validation failed: Expected object, received number',
      );

      // @ts-ignore - Testing invalid parameter type
      await expect(client.events.getById('invalidId')).rejects.toThrow(
        'events.getById: Schema Validation failed: Expected object, received string',
      );
    });

    it('should correctly pass filters and includes to events.getMultiple method', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({ data: { data: [] } }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);

      const filters = { tag: ['workshop', 'seminar'], from: '20220101' };
      const includes: EventResource[] = ['location', 'tickets.events'];

      await client.events.getMultiple({ filters, includes });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/events?filter[tag]=workshop,seminar&filter[from]=20220101&include=location,tickets.events',
      );
    });
  });
});
