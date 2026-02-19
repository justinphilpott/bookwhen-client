import type { TicketResponse, TicketsResponse } from './TicketTypes.js';

export interface ITicketService {
  getById(params: GetTicketByIdParams): Promise<TicketResponse>;
  getMultiple(params: GetMultipleTicketsParams): Promise<TicketsResponse>;
}

export interface GetTicketByIdParams {
  ticketId: string;
  includes?: TicketResource[];
}

export interface GetMultipleTicketsParams {
  eventId: string;
  includes?: TicketResource[];
}

export type TicketResource =
  | 'class_passes'
  | 'events'
  | 'events.location'
  | 'events.tickets'
  | 'events.attachments';
