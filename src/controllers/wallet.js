import db from '../models';
import { getInstance } from '../services/rclient';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');

/**
 * Fetch Wallet
 */
export const fetchWallet = async (req, res, next) => {
  console.log('Fetch wallet here');
  res.json({ success: true });
};

/**
 * Create Withdrawal
 */
export const withdraw = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(req.body.amount).times(1e8).toNumber();
    console.log('withdrawal amount');
    console.log(amount);
    if (amount < (5 * 1e8)) { // smaller then 5 RUNES
      throw new Error('MINIMUM_WITHDRAW_5_RUNES');
    }
    if (amount % 1 !== 0) {
      throw new Error('MAX_8_DECIMALS');
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(req.body.address);
    if (!isRunebaseAddress) {
      throw new Error('INVALID_ADDRESS');
    }
    console.log('find user wallet');
    // Find Users Wallet
    const userWallet = await db.wallet.findOne({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: db.address,
          as: 'addresses',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    // Withdrawal error conditions
    if (!userWallet) {
      console.log('wallet not found');
      throw new Error('WALLET_NOT_FOUND');
    }

    if (amount > userWallet.available) {
      console.log('not enough funds');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    const wallet = await userWallet.update({
      available: userWallet.available - amount,
      locked: userWallet.locked + amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('updated wallet');
    console.log(wallet);
    const transaction = await db.transaction.create({
      addressId: wallet.addresses[0].id,
      phase: 'review',
      type: 'send',
      to_from: req.body.address,
      amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('created transaction');
    const activity = await db.activity.create(
      {
        spenderId: wallet.userId,
        type: 'withdrawRequested',
        amount: transaction.amount,
        spender_balance: wallet.available + wallet.locked,
        ipId: res.locals.ipId,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    console.log('created activity');
    res.locals.activity = await db.activity.findOne({
      where: {
        id: activity.id,
      },
      attributes: [
        'createdAt',
        'type',
      ],
      include: [
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('end withdrawal request');
    t.afterCommit(() => {
      res.locals.wallet = wallet;
      res.locals.transaction = transaction;
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};
