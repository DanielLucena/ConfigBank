import { z } from "zod";

export const debitRequestSchema = z.object({
    amount: z.number().positive(),
});