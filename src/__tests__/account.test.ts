import supertest from 'supertest';

import appServer from '../utils/server';
import AccountModel from '../database/model/account.model';
import TransactionModel from '../database/model/transaction.model';

import {
  accountEmail,
  missingAccount,
  mockAccount,
  mockAccountInput,
  mockAccountUpdated,
  mockAccountUpdateEmailInput,
  mockAccountUpdateInput,
  balance,
  transactionUpdateAck,
  mockTransactionObject,
} from './account.mock';

const app = appServer();

const URL_BASE: string = '/api/account/';

describe('Account', () => {
  describe('Create', () => {
    describe('Should create an account with no-use email', () => {
      it('StatusCode 201 Account created', async () => {
        const AccountCreateMock = jest
          .spyOn(AccountModel, 'create')
          //@ts-ignore
          .mockReturnValueOnce(mockAccount);

        const { statusCode, body } = await supertest(app).post(`${URL_BASE}`).send(mockAccountInput);

        expect(statusCode).toBe(201);
        expect(AccountCreateMock).toHaveBeenCalledWith(mockAccountInput);
      });
    });
  });

  describe('Get Account', () => {
    describe('Account does not exists', () => {
      it('StatusCode 500 should be returned', async () => {
        const getAccountMock = jest
          .spyOn(AccountModel, 'findOne')
          //@ts-ignore
          .mockReturnValue(null);

        const { statusCode, body } = await supertest(app).get(`${URL_BASE}${accountEmail}`);

        expect(statusCode).toBe(500);
        expect(body).toEqual(missingAccount);
        expect(getAccountMock).toHaveBeenCalled();
      });
    });

    describe('Account exists', () => {
      it('StatusCode 200 should be returned', async () => {
        const getAccountMock = jest
          .spyOn(AccountModel, 'findOne')
          // @ts-ignore
          .mockReturnValueOnce(mockAccount);

        const { statusCode, body } = await supertest(app).get(`${URL_BASE}${accountEmail}`);

        expect(getAccountMock).toHaveBeenCalled();
        expect(statusCode).toBe(200);
        expect(body.data).toEqual(mockAccount);
      });
    });
  });

  describe('Get Balance', () => {
    describe('Base on the account transactions, return the account balance', () => {
      it('StatusCode 201 with balance', async () => {
        const accountFindOne = jest
          .spyOn(AccountModel, 'findOne')
          //@ts-ignore
          .mockReturnValueOnce(mockAccount);

        const aggsType = jest
          .spyOn(TransactionModel, 'aggregate')
          //@ts-ignore
          .mockReturnValueOnce(mockTransactionObject);

        const { statusCode, body } = await supertest(app).get(`${URL_BASE}${accountEmail}/balance`);

        expect(aggsType).toHaveBeenCalled();
        expect(accountFindOne).toHaveBeenCalled();
        expect(statusCode).toBe(201);
        expect(body).toEqual(balance);
      });
    });

    describe('Account does not exists', () => {
      it('StatusCode 500 should be returned', async () => {
        const accountFindOne = jest
          .spyOn(AccountModel, 'findOne')
          //@ts-ignore
          .mockReturnValueOnce(null);

        const aggsType = jest
          .spyOn(TransactionModel, 'aggregate')
          //@ts-ignore
          .mockReturnValueOnce(mockTransactionObject);

        const { statusCode, body } = await supertest(app).get(`${URL_BASE}${accountEmail}/balance`);

        expect(accountFindOne).toHaveBeenCalled();
        expect(aggsType).toHaveBeenCalledTimes(0);
        expect(statusCode).toBe(500);
        expect(body.error).toEqual(missingAccount.error);
      });
    });
  });

  describe('Update', () => {
    describe('Using one account email, it should updated successfully', () => {
      it('StatusCode 200 Account Updated', async () => {
        const accountFindAndUpdate = jest
          .spyOn(AccountModel, 'findOneAndUpdate')
          //@ts-ignore
          .mockReturnValueOnce(mockAccountUpdated);

        const { statusCode, body } = await supertest(app)
          .put(`${URL_BASE}${accountEmail}`)
          .send(mockAccountUpdateInput);

        expect(accountFindAndUpdate).toHaveBeenCalled();
        expect(statusCode).toBe(200);
        expect(body.data).toEqual(mockAccountUpdated);
      });
    });

    describe('Using one account email, it should updated successfully and transactions', () => {
      it('StatusCode 200 Account Updated', async () => {
        const accountFindAndUpdate = jest
          .spyOn(AccountModel, 'findOneAndUpdate')
          //@ts-ignore
          .mockReturnValueOnce(mockAccountUpdated);

        const trxMock = jest
          .spyOn(TransactionModel, 'updateMany')
          //@ts-ignore
          .mockReturnValueOnce(transactionUpdateAck);

        const { statusCode, body } = await supertest(app)
          .put(`${URL_BASE}${accountEmail}`)
          .send(mockAccountUpdateEmailInput);

        expect(accountFindAndUpdate).toHaveBeenCalled();
        expect(trxMock).toHaveBeenCalled();
        expect(statusCode).toBe(200);
        expect(body.data).toEqual(mockAccountUpdated);
      });
    });
  });
});
