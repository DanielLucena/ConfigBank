import Router from 'express';

import { CreditController } from '../controllers/creditController';

const creditRouter = Router();
const creditController = new CreditController();

creditRouter.post('/', (req, res) => creditController.creditAmount(req, res));

export { creditRouter };