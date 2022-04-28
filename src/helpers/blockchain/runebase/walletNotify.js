/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { getInstance } from '../../../services/rclient';

import db from '../../../models';

import logger from "../../logger";

/**
 * Notify New Transaction From Runebase Node
 */
const walletNotifyRunebase = async (
  req,
  res,
  next,
) => {
  res.locals.activity = [];
  const txId = req.body.payload;
  const transaction = await getInstance().getTransaction(txId);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let i = 0;
    res.locals.detail = [];
    if (transaction.details && transaction.details.length > 0) {
      for await (const detail of transaction.details) {
        if (detail.category === 'receive') {
          const address = await db.address.findOne({
            where: {
              address: detail.address,
            },
            include: [
              {
                model: db.wallet,
                as: 'wallet',
                include: [
                  {
                    model: db.user,
                    as: 'user',
                  },
                ],
              },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (address) {
            res.locals.detail[parseInt(i, 10)] = {};
            if (address.wallet.user.user_id.startsWith('discord')) {
              res.locals.detail[parseInt(i, 10)].platform = 'discord';
              res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('discord-', '');
            }
            if (address.wallet.user.user_id.startsWith('telegram')) {
              res.locals.detail[parseInt(i, 10)].platform = 'telegram';
              res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('telegram-', '');
            }
            if (address.wallet.user.user_id.startsWith('matrix')) {
              res.locals.detail[parseInt(i, 10)].platform = 'matrix';
              res.locals.detail[parseInt(i, 10)].userId = address.wallet.user.user_id.replace('matrix-', '');
            }
            res.locals.detail[parseInt(i, 10)].transaction = await db.transaction.findOrCreate({
              where: {
                txid: transaction.txid,
                type: detail.category,
                userId: address.wallet.userId,
              },
              defaults: {
                txid: txId,
                addressId: address.id,
                phase: 'confirming',
                type: detail.category,
                amount: detail.amount * 1e8,
                userId: address.wallet.userId,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            });

            if (res.locals.detail[parseInt(i, 10)].transaction[1]) {
              const activity = await db.activity.findOrCreate({
                where: {
                  transactionId: res.locals.detail[parseInt(i, 10)].transaction[0].id,
                },
                defaults: {
                  earnerId: address.wallet.userId,
                  type: 'depositAccepted',
                  amount: detail.amount * 1e8,
                  transactionId: res.locals.detail[parseInt(i, 10)].transaction[0].id,
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              res.locals.activity.unshift(activity[0]);
              res.locals.detail[parseInt(i, 10)].amount = detail.amount;
              logger.info(`deposit detected for addressid: ${res.locals.detail[parseInt(i, 10)].transaction[0].addressId} and txid: ${res.locals.detail[parseInt(i, 10)].transaction[0].txid}`);
            }
            i += 1;
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('commited');
      next();
    });
  });
};

export default walletNotifyRunebase;
