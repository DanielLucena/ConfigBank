import { Request, Response } from "express";
import { creditRequestSchema } from "../schemas/creditSchema";
import { AccountService } from "../services/accountService";
import { handleError } from "../utils/errorHandler";

export class CreditController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async creditAmount(req: Request, res: Response): Promise<void> {
        try {
            const { number, amount } = creditRequestSchema.parse(req.body);
            const accountUpdated = await this.accountService.creditToAccount(number, amount);
            res.status(200).json({
                message: "Credit successful",
                account: accountUpdated,
            });

        } catch (err: any) {
            handleError(res, err);
        }
    }
}