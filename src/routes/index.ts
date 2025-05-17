import { Router } from 'express';
import { exampleRouter } from './exemple.routes';
import { accountRouter } from './account.routes';
import { debitRouter } from './debit.routes';

const router = Router();

router.use('/example', exampleRouter);
router.use('/account', accountRouter);
router.use('/debit', debitRouter);

export { router };