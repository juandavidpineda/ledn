import Document from 'mongoose';

export interface ITransaction extends Document {
  userEmail: string;
  amount: number;
  type: string;
  createdAt: Date;
}
