import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { TicketService } from './Ticket.js';
import type { BookwhenTicket } from './TicketTypes.js';

describe('TicketService', () => {
  let ticketService: TicketService;
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = axios.create();
    ticketService = new TicketService(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves a single ticket by id', async () => {
    const ticketData = { id: 'ti-123', type: 'ticket' } as BookwhenTicket;

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: ticketData },
    });

    const result = await ticketService.getById({ ticketId: 'ti-123' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tickets/ti-123');
    expect(result).toEqual({ data: ticketData });
  });

  it('adds includes when retrieving a single ticket', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: { id: 'ti-123' } },
    });

    await ticketService.getById({
      ticketId: 'ti-123',
      includes: ['events', 'class_passes'],
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/tickets/ti-123?include=events,class_passes',
    );
  });

  it('maps 404 errors on getById to a ticket-specific message', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: { status: 404 },
    });

    await expect(
      ticketService.getById({ ticketId: 'missing' }),
    ).rejects.toThrow(
      'Ticket not found. Please check the ticket ID and try again.',
    );
  });

  it('validates getById params', async () => {
    // @ts-expect-error validating runtime schema guard
    await expect(ticketService.getById(123)).rejects.toThrow(
      'tickets.getById: Schema Validation failed: Expected object, received number',
    );
  });

  it('retrieves tickets for an event', async () => {
    const ticketData = [{ id: 'ti-1', type: 'ticket' }] as BookwhenTicket[];

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: {
        data: ticketData,
        links: { self: '/tickets?event=ev-1' },
      },
    });

    const result = await ticketService.getMultiple({ eventId: 'ev-1' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tickets?event=ev-1');
    expect(result).toEqual({
      data: ticketData,
      links: { self: '/tickets?event=ev-1' },
    });
  });

  it('builds getMultiple query with includes', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: [] },
    });

    await ticketService.getMultiple({
      eventId: 'ev-1',
      includes: ['events.location', 'events.tickets'],
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/tickets?event=ev-1&include=events.location,events.tickets',
    );
  });

  it('validates getMultiple params', async () => {
    // @ts-expect-error validating runtime schema guard
    await expect(ticketService.getMultiple({})).rejects.toThrow(
      'tickets.getMultiple: Schema Validation failed: Required',
    );
  });
});
