import Router from 'express';
import { AccountController } from '../controllers/accountController';

const accountRouter = Router();
const accountController = new AccountController();

accountRouter.post('/', (req, res) => accountController.create(req, res));
accountRouter.get('/balance', (req, res) => accountController.getBalance(req, res));

export { accountRouter };