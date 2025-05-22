import { z } from "zod";

export const accountTypeEnum = z.enum(["normal", "bonus"]);

export const baseAccountSchema = z.object({
  number: z.number().int().positive(),
  balance: z.number().nonnegative(),
  type: accountTypeEnum,
});

export const bonusAccountSchema = baseAccountSchema.extend({
  type: z.literal("bonus"),
  points: z.number().nonnegative(),
});

export const accountSchema = z.union([
  baseAccountSchema,
  bonusAccountSchema,
]);

export const createAccountSchema = z.object({
  number: z.number().int().positive(),
});

export const accountRequestSchema = z.object({
  number: z.number().int().positive(),
});

export type Account = z.infer<typeof accountSchema>;
export type BonusAccount = z.infer<typeof bonusAccountSchema>;