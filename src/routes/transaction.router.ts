import express from 'express';
import { create } from '../controller/transaction.controller';

const transactionRouter: express.Router = express.Router();

transactionRouter.post('/', create);

export default transactionRouter;
