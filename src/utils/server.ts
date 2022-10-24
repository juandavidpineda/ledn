import express from 'express';
import cors from 'cors';

import accountRouter from '../routes/account.router';
import transactionRouter from '../routes/transaction.router';

const createServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/api/account', accountRouter);
  app.use('/api/transaction', transactionRouter);

  app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).send({ isError: true, error: err.message });
  });

  return app;
};

export default createServer;
