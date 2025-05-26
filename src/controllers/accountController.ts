import { Request, Response } from "express";
import { AccountService } from "../services/accountService";
import { createAccountSchema, accountRequestSchema, interestRequestSchema } from "../schemas/accountSchema";
import { handleError } from "../utils/errorHandler";

export class AccountController {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { number, initialBalance } = createAccountSchema.parse(req.body);
      const { type } = req.query as { type?: "bonus" | "savings" };

      const account = await this.service.createAccount(number, type, initialBalance);

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

  async earnInterest(req: Request, res: Response): Promise<void> {
    try {
      const { interest } = interestRequestSchema.parse(req.body);
      const accounts = await this.service.earnInterest(interest);

      res.status(200).json(accounts);
    } catch (err: any) {
      handleError(res, err);
    }
  }
}