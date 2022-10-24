import Document from 'mongoose';

export interface IAccount extends Document {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  dob: Date;
  mfa: string;
  createdAt: Date;
  updatedAt: Date;
  referredBy: string;
}
