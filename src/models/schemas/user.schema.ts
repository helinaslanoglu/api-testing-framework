import { z } from 'zod';

export const userCoordinatesSchema = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export const userAddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string().optional(),
  postalCode: z.string(),
  coordinates: userCoordinatesSchema.optional(),
  country: z.string().optional(),
});

export const userCompanySchema = z.object({
  department: z.string(),
  name: z.string(),
  title: z.string(),
  address: userAddressSchema.optional(),
});

export const userHairSchema = z.object({
  color: z.string(),
  type: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string().optional(),
  age: z.number(),
  gender: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  username: z.string(),
  password: z.string().optional(),
  birthDate: z.string().optional(),
  image: z.string().optional(),
  bloodGroup: z.string().optional(),
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  eyeColor: z.string().optional(),
  hair: userHairSchema.optional(),
  address: userAddressSchema.optional(),
  company: userCompanySchema.optional(),
  role: z.string().optional(),
}).passthrough();

export const usersListSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const createUserResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
}).passthrough();

export const deleteUserResponseSchema = z.object({
  id: z.number(),
  isDeleted: z.boolean(),
  deletedOn: z.string(),
}).passthrough();

export type UserSchemaType = z.infer<typeof userSchema>;
export type UsersListSchemaType = z.infer<typeof usersListSchema>;
