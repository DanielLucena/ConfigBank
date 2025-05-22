import { Router } from "express";
import { TransferController } from "../controllers/transferController";

const transferRouter = Router();
const transferController = new TransferController();

transferRouter.post('/', (req, res) => transferController.transferBetweenAccounts(req, res));

export { transferRouter };