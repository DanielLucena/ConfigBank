import { Request, Response } from "express";
import { AccountService } from "../services/accountService";
import { createAccountSchema } from "../schemas/accountSchema";
import { handleError } from "../utils/errorHandler";

export class AccountController {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { number } = createAccountSchema.parse(req.body);
      const account = await this.service.createAccount(number);

      res.status(201).json(account);
    } catch (err: any) {
      handleError(res, err);
    }
  }
}