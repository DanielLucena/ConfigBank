import { z } from "zod";

export const creditRequestSchema = z.object({
    amount: z.number().positive(),
});