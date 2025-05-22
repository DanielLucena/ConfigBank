import { Response } from "express";
import { ZodError } from "zod";

export function handleError(res: Response, err: any): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid input", details: err.errors });
  } else if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Unexpected error" });
  }
}