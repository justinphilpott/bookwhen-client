import { z } from 'zod';

export const GetLocationByIdParamsSchema = z.object({
  locationId: z.string().min(1, 'Invalid location ID'),
});
