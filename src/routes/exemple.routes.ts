import Router from 'express';
import { ExampleController } from '../controllers/exampleController';

const exampleRouter = Router();
const exampleController = new ExampleController();

exampleRouter.get('/', (req, res) => exampleController.getAllExamples(req, res));
exampleRouter.get('/:id', (req, res) => exampleController.getExampleById(req, res));
exampleRouter.post('/', (req, res) => exampleController.createExample(req, res));
exampleRouter.put('/:id', (req, res) => exampleController.updateExampleById(req, res));
exampleRouter.delete('/:id', (req, res) => exampleController.deleteExampleById(req, res));

export { exampleRouter };