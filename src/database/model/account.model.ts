import mongoose from 'mongoose';

import { IAccount } from './../interfaces/account.interface';

const accountSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    mfa: { type: String, enum: [null, 'TOTP', 'SMS'], default: null },
    referredBy: { type: String, required: false, default: null },
  },
  { timestamps: true },
);

accountSchema.set('versionKey', false);

const AccountModel = mongoose.model<IAccount>('account', accountSchema);
export default AccountModel;
