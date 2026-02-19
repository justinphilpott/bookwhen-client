import { z } from 'zod';

export const TicketResourceSchema = z.enum([
  'class_passes',
  'events',
  'events.location',
  'events.tickets',
  'events.attachments',
]);

export const GetTicketByIdParamsSchema = z.object({
  ticketId: z.string().min(1, 'Invalid ticket ID'),
  includes: TicketResourceSchema.array().optional(),
});

export const GetMultipleTicketsParamsSchema = z.object({
  eventId: z.string().min(1, 'Invalid event ID'),
  includes: TicketResourceSchema.array().optional(),
});
