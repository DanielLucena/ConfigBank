require('dotenv').config()
import express from 'express';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ endpoints: [
    { method: 'POST', path: '/api/account' },
    { method: 'POST', path: '/api/debit' },
    { method: 'POST', path: '/api/transfer' },
  ] });
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});