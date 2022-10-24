import { Request, Response, NextFunction } from 'express';

import AccountModel from './../database/model/account.model';
import { IAccount } from './../database/interfaces/account.interface';
import { updateEmail as updateEmailTransactions } from './transaction.controller';

/**
 * It creates a new account and returns it
 * @param {Request} req - Request - This is the request object that contains the data sent from the
 * client.
 * @param {Response} res - Response - This is the response object that will be sent back to the client.
 * @param {NextFunction} next - NextFunction - This is a function that will be called if an error
 * occurs.
 * @returns The account that was created.
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await AccountModel.create(<IAccount>req.body);
    return res.status(201).json({
      message: 'Success',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * It gets an account by email
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - This is the response object that will be sent back to the client.
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the current
 * middleware is done executing.
 * @returns The account object
 */
export const getByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const account: IAccount | null = await AccountModel.findOne({ email });

    if (!account) {
      throw new Error(`Account ${email} does not exists.`);
    }

    return res.status(200).json({
      message: 'Success',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * It updates an account by email, and if the email is changed, it also updates the transactions
 * associated with the account
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - The response object that will be sent back to the client.
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the current
 * middleware is done executing.
 * @returns The account updated.
 */
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqEmail = req.params.email;
    const { email } = req.body;

    const accountUpdated = await AccountModel.findOneAndUpdate({ email: reqEmail }, <IAccount>req.body, {
      new: true,
      runValidators: true,
    });

    if (!accountUpdated) {
      throw new Error(`Account ${reqEmail} does not exists.`);
    }

    await updateEmailTransactions(reqEmail, email);

    return res.status(200).json({ message: 'Success', data: accountUpdated });
  } catch (error) {
    next(error);
  }
};
