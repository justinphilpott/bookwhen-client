import { z } from 'zod';

export const GetClassPassByIdParamsSchema = z.object({
  classPassId: z.string().min(1, 'Invalid class pass ID'),
});
