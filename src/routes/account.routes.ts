import Router from 'express';
import { AccountController } from '../controllers/accountController';

const accountRouter = Router();
const accountController = new AccountController();

accountRouter.post('/', (req, res) => accountController.create(req, res));

export { accountRouter };