import express from 'express';
import { create, getByEmail, update } from '../controller/account.controller';
import { getBalance } from '../controller/transaction.controller';

const accountRouter: express.Router = express.Router();

accountRouter.post('/', create);
accountRouter.put('/:email', update);
accountRouter.get('/:email', getByEmail);
accountRouter.get('/:email/balance', getBalance);

export default accountRouter;
