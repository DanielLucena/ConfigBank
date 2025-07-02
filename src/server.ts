// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import express from 'express';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ endpoints: [
    { method: 'GET', path: '/api/banco/conta/:id' },
    { method: 'POST', path: '/api/banco/conta' },
    { method: 'GET', path: '/api/banco/conta/:id/saldo' },
    { method: 'PUT', path: '/api/banco/conta/:id/credito' },
    { method: 'PUT', path: '/api/banco/conta/:id/debito' },
    { method: 'PUT', path: '/api/banco/conta/transferencia' },
    { method: 'PUT', path: '/api/banco/conta/rendimento' },
  ] });
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});