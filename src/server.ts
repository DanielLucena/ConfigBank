require('dotenv').config()
import express from 'express';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ endpoints: [
    { method: 'POST', path: '/api/banco/conta' },
    { method: 'GET', path: '/api/banco/conta' },
    { method: 'GET', path: '/api/banco/conta/saldo' },
    { method: 'PUT', path: '/api/banco/conta/credito' },
    { method: 'PUT', path: '/api/banco/conta/debito' },
    { method: 'PUT', path: '/api/banco/conta/transferencia' },
    { method: 'PUT', path: '/api/banco/conta/rendimento' },
  ] });
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});