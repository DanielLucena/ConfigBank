import { Router } from 'express';
import { exampleRouter } from './exemple.routes';
import { accountRouter } from './account.routes';
import { debitRouter } from './debit.routes';
import { creditRouter } from './credit.routes';
import { transferRouter } from './transfer.routes';


const router = Router();

router.use('/example', exampleRouter);
router.use('/banco/conta', accountRouter);
//router.use('/debit', debitRouter);
//router.use('/credit', creditRouter);
//router.use('/transfer', transferRouter);


export { router };