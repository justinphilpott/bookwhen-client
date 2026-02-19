import { describe, it, expect, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import { BookwhenClient } from './BookwhenClient.js';
import type { EventResource } from '../services/event/EventInterfaces.js';
import { EventService } from '../services/event/Event.js';
import { TicketService } from '../services/ticket/Ticket.js';
import { LocationService } from '../services/location/Location.js';
import { AttachmentService } from '../services/attachment/Attachment.js';
import { ClassPassService } from '../services/class-pass/ClassPass.js';

vi.mock('axios');
vi.mock('../src/services/event/Event');
vi.mock('../src/services/ticket/Ticket');
vi.mock('../src/services/location/Location');
vi.mock('../src/services/attachment/Attachment');
vi.mock('../src/services/class-pass/ClassPass');

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
      expect(event).toEqual({
        data: { id: 'event123' },
      });
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
      const events = await client.events.getMultiple({ includes, filters });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/events?filter[title]=Workshop&filter[start_at]=2023-01-01&include=location,tickets',
      );
      expect(events).toEqual({
        data: [{ id: 'event1' }, { id: 'event2' }],
      });
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

  describe('BookwhenClient - Tickets Service', () => {
    it('should call the correct endpoint when tickets.getById is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: { id: 'ti-123' },
          },
        }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);
      const ticket = await client.tickets.getById({ ticketId: 'ti-123' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tickets/ti-123');
      expect(ticket).toEqual({ data: { id: 'ti-123' } });
    });

    it('should call the correct endpoint with event query when tickets.getMultiple is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: [{ id: 'ti-1' }],
          },
        }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);
      const tickets = await client.tickets.getMultiple({
        eventId: 'ev-123',
        includes: ['events', 'class_passes'],
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/tickets?event=ev-123&include=events,class_passes',
      );
      expect(tickets).toEqual({ data: [{ id: 'ti-1' }] });
    });

    it('should correctly initialize and expose the tickets service via the client', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);
      const ticketsService = client.tickets;

      expect(ticketsService).toBeInstanceOf(TicketService);
    });
  });

  describe('BookwhenClient - Location Service', () => {
    it('should call the correct endpoint when locations.getById is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: { id: 'loc-1' },
          },
        }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);
      const location = await client.locations.getById({ locationId: 'loc-1' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/locations/loc-1');
      expect(location).toEqual({ data: { id: 'loc-1' } });
    });

    it('should correctly initialize and expose the location service via the client', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);

      expect(client.locations).toBeInstanceOf(LocationService);
    });
  });

  describe('BookwhenClient - Attachment Service', () => {
    it('should call the correct endpoint when attachments.getById is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: { id: 'att-1' },
          },
        }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);
      const attachment = await client.attachments.getById({
        attachmentId: 'att-1',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/attachments/att-1');
      expect(attachment).toEqual({ data: { id: 'att-1' } });
    });

    it('should correctly initialize and expose the attachment service via the client', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);

      expect(client.attachments).toBeInstanceOf(AttachmentService);
    });
  });

  describe('BookwhenClient - ClassPass Service', () => {
    it('should call the correct endpoint when classPasses.getById is called', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({
          data: {
            data: { id: 'cp-1' },
          },
        }),
      } as unknown as AxiosInstance;

      const client = new BookwhenClient(mockAxiosInstance);
      const classPass = await client.classPasses.getById({
        classPassId: 'cp-1',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/class_passes/cp-1');
      expect(classPass).toEqual({ data: { id: 'cp-1' } });
    });

    it('should correctly initialize and expose the class pass service via the client', () => {
      const mockAxiosInstance = {} as AxiosInstance;
      const client = new BookwhenClient(mockAxiosInstance);

      expect(client.classPasses).toBeInstanceOf(ClassPassService);
    });
  });
});
