import { z } from "zod";

export const debitRequestSchema = z.object({
    number: z.number().int().positive(),
    amount: z.number().positive(),
});