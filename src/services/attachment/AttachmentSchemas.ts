import { z } from 'zod';

export const GetAttachmentByIdParamsSchema = z.object({
  attachmentId: z.string().min(1, 'Invalid attachment ID'),
});
