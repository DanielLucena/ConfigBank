import Router from 'express';

import { DebitController } from '../controllers/debitController';

const debitRouter = Router();
const debitController = new DebitController();

debitRouter.post('/', (req, res) => debitController.debitAmount(req, res));

export { debitRouter };