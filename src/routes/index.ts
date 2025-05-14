import { Router } from 'express';
import { exampleRouter } from './exemple.routes';
import { accountRouter } from './account.routes';

const router = Router();

router.use('/example', exampleRouter);
router.use('/account', accountRouter);

export { router };