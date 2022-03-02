import { Transaction } from "sequelize";
import { getInstance } from '../../services/rclient';

import db from '../../models';

import logger from "../logger";

/**
 * Notify New Transaction From Komodo Node
 */
const walletNotifyKomodo = async (req, res, next) => {
  const txId = req.body.payload;
  const transaction = await getInstance().getTransaction(txId);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    await Promise.all(transaction.details.map(async (detail) => {
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
          if (address.wallet.user.user_id.startsWith('discord')) {
            res.locals.platform = 'discord';
            res.locals.userId = address.wallet.user.user_id.replace('discord-', '');
          }
          if (address.wallet.user.user_id.startsWith('telegram')) {
            res.locals.platform = 'telegram';
            res.locals.userId = address.wallet.user.user_id.replace('telegram-', '');
          }
          console.log(transaction);
          res.locals.transaction = await db.transaction.findOrCreate({
            where: {
              txid: transaction.txid,
              type: detail.category,
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

          if (res.locals.transaction[1]) {
            const activity = await db.activity.findOrCreate({
              where: {
                transactionId: res.locals.transaction[0].id,
              },
              defaults: {
                earnerId: address.wallet.userId,
                type: 'depositAccepted',
                amount: detail.amount * 1e8,
                transactionId: res.locals.transaction[0].id,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            res.locals.amount = detail.amount;
          }

          logger.info(`deposit detected for addressid: ${res.locals.transaction[0].addressId} and txid: ${res.locals.transaction[0].txid}`);
        }
      }
    }));

    t.afterCommit(() => {
      next();
      console.log('commited');
    });
  });
};

export default walletNotifyKomodo;
