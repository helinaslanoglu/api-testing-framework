import { z } from 'zod';

export const apiErrorSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
}).passthrough();

export type ApiErrorSchemaType = z.infer<typeof apiErrorSchema>;
