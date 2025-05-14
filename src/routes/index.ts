import { Router } from 'express';
import { exampleRouter } from './exemple.routes';

const router = Router();

router.use('/example', exampleRouter);

export { router };