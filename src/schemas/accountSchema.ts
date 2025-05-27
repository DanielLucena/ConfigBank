import { z } from "zod";

export const accountTypeEnum = z.enum(["normal", "bonus", "savings"]);

export const baseAccountSchema = z.object({
  number: z.number().int().positive(),
  balance: z.number().min(-1000),
  type: accountTypeEnum,
});

export const bonusAccountSchema = baseAccountSchema.extend({
  type: z.literal("bonus"),
  points: z.number().nonnegative(),
});

export const savingsAccountSchema = baseAccountSchema.extend({
  type: z.literal("savings"),
});

export const accountSchema = z.union([
  baseAccountSchema,
  bonusAccountSchema,
  savingsAccountSchema,
]);

export const createAccountSchema = z.object({
  number: z.number().int().positive(),
  initialBalance: z.number().optional(),
});

export const accountRequestSchema = z.object({
  number: z.number().int().positive(),
});

export const interestRequestSchema = baseAccountSchema.extend({
  interest: z.number().min(0).max(100),
});

export type Account = z.infer<typeof accountSchema>;
export type BonusAccount = z.infer<typeof bonusAccountSchema>;
export type SavingsAccount = z.infer<typeof savingsAccountSchema>;
