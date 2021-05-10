import db from '../models';
import { getInstance } from '../services/rclient';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const QRCode = require('qrcode');
const logger = require('../helpers/logger');

/**
 * Create Withdrawal
 */
export const withdrawTelegramCreate = async (ctx, runesTipSplit) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(runesTipSplit[3]).times(1e8).toNumber();
    console.log('withdrawal amount');
    console.log(amount);
    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      ctx.reply('Minimum Withdrawal is 2 RUNES');
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(runesTipSplit[2]);
    if (!isRunebaseAddress) {
      ctx.reply('Invalid Runebase Address');
    }

    if (amount >= (2 * 1e8) && amount % 1 === 0 && isRunebaseAddress) {
      const user = await db.user.findOne({
        where: {
          user_id: `telegram-${ctx.update.message.from.id}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            include: [
              {
                model: db.address,
                as: 'addresses',
              },
            ],
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!user) {
        ctx.reply('User not found');
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.reply('Insufficient funds');
        }
        if (amount <= user.wallet.available) {
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
            locked: user.wallet.locked + amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const transaction = await db.transaction.create({
            addressId: wallet.addresses[0].id,
            phase: 'review',
            type: 'send',
            to_from: runesTipSplit[2],
            amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          ctx.reply('Withdrawal is being reviewed');
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong');
  });
};

export const fetchWalletBalance = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      ctx.reply(`Wallet not found`);
    }

    if (user && user.wallet) {
      await ctx.reply(`${ctx.update.message.from.username}'s current available balance: ${user.wallet.available / 1e8} RUNES
${ctx.update.message.from.username}'s current locked balance: ${user.wallet.locked / 1e8} RUNES`);
    }

    t.afterCommit(() => {
      logger.info(`Success Balance Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
    });
  }).catch((err) => {
    logger.error(`Error Balance Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} - ${err}`);
  });
};

export const fetchWalletDepositAddress = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet && !user.wallet.addresses) {
      ctx.reply(`Deposit Address not found`);
    }

    if (user && user.wallet && user.wallet.addresses) {
      // const qr_png = qr.image(user.wallet.addresses[0].address, { type: 'png' });
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      console.log(user.wallet.addresses);
      console.log(depositQrFixed);
      // console.log(qr_png);
      await ctx.replyWithPhoto(
        {
          source: Buffer.from(depositQrFixed, 'base64'),
        }, {
          caption: `${ctx.update.message.from.username}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
          parse_mode: 'MarkdownV2',
        },
      );
      // ctx.replyWithPhoto(depositQrFixed, {caption:'Your caption here'});
      await ctx.reply(`${ctx.update.message.from.username}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
      { parse_mode: 'MarkdownV2' });
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} - ${err}`);
  });
};

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
