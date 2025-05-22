import {z} from "zod";

export const transferRequestSchema = z.object({
    senderNumber: z.number().int().positive(),
    receiverNumber: z.number().int().positive(),
    amount: z.number()
});