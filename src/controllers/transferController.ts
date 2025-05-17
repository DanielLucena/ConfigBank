import { Request, Response } from "express";
import { transferRequestSchema } from "../schemas/transferSchema";
import { AccountService } from "../services/accountService";
import { handleError } from "../utils/errorHandler";

export class TransferController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async transferBetweenAccounts(req: Request, res: Response): Promise<void> {
        try {
            const { senderNumber, receiverNumber, amount } = transferRequestSchema.parse(req.body);
            const { from, to } = await this.accountService.transferBetweenAccounts(senderNumber, receiverNumber, amount);
            res.status(200).json({
                message: "Transfer successful",
                from,
                to,
            });

        } catch (err: any) {
            handleError(res, err);
        }
    }
}