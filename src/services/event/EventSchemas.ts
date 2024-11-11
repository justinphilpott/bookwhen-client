import { z } from 'zod';

export const EventResourceSchema = z.enum(['location', 'attachments', 'tickets', 'tickets.events', 'tickets.class_passes']);

// Define GetEventByIdParams schema
export const GetEventByIdParamsSchema = z.object({
  eventId: z.string().min(1, 'Invalid event ID'),
  includes: EventResourceSchema.array().optional(),
});
