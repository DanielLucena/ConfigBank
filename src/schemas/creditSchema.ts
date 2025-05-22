import { z } from "zod";

export const creditRequestSchema = z.object({
    number: z.number().int().positive(),
    amount: z.number().positive(),
});