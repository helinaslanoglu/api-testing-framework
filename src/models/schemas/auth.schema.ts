import { z } from 'zod';

export const loginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
}).passthrough();

export const authMeSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
}).passthrough();

export type LoginResponseSchemaType = z.infer<typeof loginResponseSchema>;
export type AuthMeSchemaType = z.infer<typeof authMeSchema>;
