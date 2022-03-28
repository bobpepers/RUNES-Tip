/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { config } from "dotenv";
import { getInstance } from '../../../services/rclient';
import db from '../../../models';
import logger from "../../logger";

config();

/**
 * Notify New Transaction From Pirate Node
 */
const walletNotifyPirate = async (
  req,
  res,
  next,
) => {
  const txId = req.body.payload;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let i = 0;
    res.locals.detail = [];
    const transaction = await getInstance().getTransaction(txId);
    if (transaction.received && transaction.received.length > 0) {
      for await (const detail of transaction.received) {
        if (detail.address !== process.env.PIRATE_MAIN_ADDRESS) {
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
                type: 'receive',
                userId: address.wallet.userId,
              },
              defaults: {
                txid: txId,
                addressId: address.id,
                phase: 'confirming',
                type: 'receive',
                amount: detail.value * 1e8,
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
                  amount: detail.value * 1e8,
                  transactionId: res.locals.detail[parseInt(i, 10)].transaction[0].id,
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              res.locals.detail[parseInt(i, 10)].amount = detail.value;
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

export default walletNotifyPirate;
