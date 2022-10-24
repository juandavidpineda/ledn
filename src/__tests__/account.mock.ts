import mongoose from 'mongoose';

const objId = new mongoose.Types.ObjectId().toString();

export const accountEmail = 'juan.pineda@gmail.com';

export const mockAccount = {
  _id: objId,
  firstName: 'Paul',
  lastName: 'Walker',
  country: 'CO',
  email: 'juan.pineda@gmail.com',
  dob: '1992-05-09T00:00:00.000Z',
  mfa: 'SMS',
  referredBy: null,
  createdAt: '2022-10-02T05:51:19.199Z',
  updatedAt: '2022-10-02T06:00:14.491Z',
};

export const mockAccountInput = {
  firstName: 'Paul',
  lastName: 'Walker',
  country: 'CO',
  email: 'juan.pineda@gmail.com',
  dob: '1992-05-09T00:00:00.000Z',
  mfa: 'SMS',
  referredBy: null,
};

export const mockAccountUpdateInput = {
  firstName: 'Paul',
  lastName: 'Walker',
  country: 'US',
  email: 'juan.pineda@gmail.com',
  dob: '1992-05-09T00:00:00.000Z',
  mfa: 'TOTP',
  referredBy: null,
};

export const mockAccountUpdateEmailInput = {
  firstName: 'Paul',
  lastName: 'James',
  country: 'US',
  email: 'Paul.james_123@gmail.com',
  dob: '1992-05-09T00:00:00.000Z',
  mfa: 'TOTP',
  referredBy: null,
};

export const mockAccountUpdated = {
  _id: objId,
  firstName: 'Paul',
  lastName: 'Walker',
  country: 'CO',
  email: 'juan.pineda@gmail.com',
  dob: '1992-05-09T00:00:00.000Z',
  mfa: 'TOTP',
  referredBy: null,
  createdAt: '2022-10-02T05:51:19.199Z',
  updatedAt: '2022-10-02T06:00:14.491Z',
};

export const missingAccount = {
  isError: true,
  error: 'Account juan.pineda@gmail.com does not exists.',
};

export const mockTransactionObject = [
  { _id: 'receive', totalAmount: 233 },
  { _id: 'send', totalAmount: 123 },
];

export const balance = {
  balance: 110,
};

export const transactionUpdateAck = {
  acknowledged: true,
  modifiedCount: 3,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 3,
};
