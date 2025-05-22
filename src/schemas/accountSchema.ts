import { z } from "zod";

export const accountSchema = z.object({
  number: z.number().int().positive(),
  balance: z.number().nonnegative(),
});

export const createAccountSchema = z.object({
  number: z.number().int().positive(),
});

export const accountRequestSchema = z.object({
  number: z.number().int().positive(),
});

export type Account = z.infer<typeof accountSchema>;