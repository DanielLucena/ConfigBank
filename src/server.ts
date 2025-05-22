require('dotenv').config()
import express from 'express';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ endpoints: [
    { method: 'POST', path: '/api/account' },
    { method: 'GET', path: '/api/account/balance' },
    { method: 'POST', path: '/api/debit' },
    { method: 'POST', path: '/api/transfer' },
    { method: 'POST', path: '/api/credit' },
  ] });
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});