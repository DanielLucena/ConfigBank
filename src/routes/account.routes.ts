import Router from 'express';
import { AccountController } from '../controllers/accountController';
import { CreditController } from '../controllers/creditController';
import { DebitController } from '../controllers/debitController';
import { TransferController } from "../controllers/transferController";

const accountRouter = Router();
const accountController = new AccountController();
const creditController = new CreditController();
const debitController = new DebitController();
const transferController = new TransferController();

accountRouter.post('/', (req, res) => accountController.create(req, res));
accountRouter.get('/', (req, res) => accountController.create(req, res));
accountRouter.get('/saldo', (req, res) => accountController.getBalance(req, res));
accountRouter.put('/credito', (req, res) => creditController.creditAmount(req, res));
accountRouter.put('/debito', (req, res) => debitController.debitAmount(req, res));
accountRouter.put('/transferencia', (req, res) => transferController.transferBetweenAccounts(req, res));
accountRouter.put('/rendimento', (req, res) => accountController.earnInterest(req, res));

export { accountRouter };