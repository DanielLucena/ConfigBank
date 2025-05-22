import { Request, Response } from "express";
import { debitRequestSchema } from "../schemas/debitSchema";
import { AccountService } from "../services/accountService";
import { handleError } from "../utils/errorHandler";

export class DebitController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async debitAmount(req: Request, res: Response): Promise<void> {
        try {
            const { number, amount } = debitRequestSchema.parse(req.body);
            const accountUpdated = await this.accountService.debitFromAccount(number, amount);
            res.status(200).json({
                message: "Debit successful",
                account: accountUpdated,
            });

        } catch (err: any) {
            handleError(res, err);
        }
    }
}