import mongoose, { Document } from 'mongoose';

import { ITransaction } from '../interfaces/transaction.interface';

const transactionSchema: mongoose.Schema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['send', 'receive'] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

transactionSchema.set('versionKey', false);

const TransactionModel = mongoose.model<ITransaction>('transaction', transactionSchema);

export default TransactionModel;
