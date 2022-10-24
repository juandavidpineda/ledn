import { Request, Response, NextFunction } from 'express';
import AccountModel from '../database/model/account.model';
import TransactionModel from '../database/model/transaction.model';
import { ITransaction } from '../database/interfaces/transaction.interface';

/**
 * It creates a new transaction
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - This is the response object that we will use to send back a
 * response to the client.
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the current
 * middleware is done executing.
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { fromEmail, toEmail, amount } = req.body;
  try {
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new Error(`${amount} is an invalid amount.`);
    }

    const fromUser = await AccountModel.findOne({ email: fromEmail });
    if (!fromUser) {
      throw new Error(`Account ${fromEmail} does not exists.`);
    }

    const toUser = await AccountModel.findOne({ email: toEmail });
    if (!toUser) {
      throw new Error(`Account ${toEmail} does not exists.`);
    }

    const balanceFrom = await getUserBalance(fromEmail);

    if (balanceFrom.balance - amount < 0) {
      throw new Error(`Not Funds to debit ${amount}`);
    }

    const sendTransaction = new TransactionModel({
      userEmail: fromEmail,
      amount: amount,
      type: 'send',
    });
    const receiveTransaction = new TransactionModel({
      userEmail: toEmail,
      amount: amount,
      type: 'receive',
    });
    const newTransactions = await TransactionModel.insertMany([sendTransaction, receiveTransaction]);

    res.status(201).json(newTransactions);
  } catch (error) {
    next(error);
  }
};

/**
 * It takes the email from the request params, checks if the user exists, if the user exists, it
 * aggregates the transactions and calculates the balance
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - This is the response object that we will use to send back a
 * response to the client.
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the
 * middleware is done.
 * @returns The balance of the user.
 */
export const getBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const data = await getUserBalance(email);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * It updates all transactions with the old email to the new email
 * @param {string} oldEmail - The email address that you want to change
 * @param {string} newEmail - The new email address to update the old email address to.
 * @returns The number of documents updated
 */
export const updateEmail = async (oldEmail: string, newEmail: string) => {
  try {
    if (!oldEmail || !newEmail) {
      throw new Error(`Please specify both old and new email`);
    }

    if (oldEmail === newEmail) return 'updated';

    return await TransactionModel.updateMany({ accountEmail: oldEmail }, { accountEmail: newEmail });
  } catch (error) {
    throw error;
  }
};

const getUserBalance = async (email: string) => {
  if (!email) {
    throw new Error(`Please specify an email`);
  }

  let balance: number = 0;
  const userInfo: any = await AccountModel.findOne({ email });
  if (userInfo) {
    const aggregateBal = await TransactionModel.aggregate([
      { $match: { userEmail: email } },
      { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } },
    ]);

    aggregateBal.forEach((aggregate) => {
      if (aggregate._id === 'send') {
        balance -= aggregate.totalAmount;
      } else {
        balance += aggregate.totalAmount;
      }
    });
    return { ...userInfo._doc, balance: balance < 0 ? 0 : balance };
  } else {
    throw new Error(`Account ${email} does not exists.`);
  }
};
