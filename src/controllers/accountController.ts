import { Request, Response } from "express";
import { AccountService } from "../services/accountService";
import { createAccountSchema, accountRequestSchema } from "../schemas/accountSchema";
import { handleError } from "../utils/errorHandler";

export class AccountController {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { number } = createAccountSchema.parse(req.body);
      const { type } = req.query as { type?: "bonus" };
      const account = await this.service.createAccount(number, type);

      res.status(201).json(account);
    } catch (err: any) {
      handleError(res, err);
    }
  }

  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { number } = accountRequestSchema.parse(req.body);
      const balance = await this.service.getAccountBalance(number);

      res.status(200).json(balance);
    } catch (err: any) {
      handleError(res, err);
    }
  }
}