import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string(),
  id: z.number()
});

export type Example = z.infer<typeof exampleSchema>;