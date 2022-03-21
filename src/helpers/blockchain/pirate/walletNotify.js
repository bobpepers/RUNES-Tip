import { Transaction } from "sequelize";
import { config } from "dotenv";
import { getInstance } from '../../../services/rclient';
import db from '../../../models';

import logger from "../../logger";

config();

/**
 * Notify New Transaction From Runebase Node
 */
const walletNotifyPirate = async (req, res, next) => {
  const txId = req.body.payload;
  const transaction = await getInstance().getTransaction(txId);
  console.log('transaction walletNotifyPirate');
  console.log(transaction);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(transaction.txid);
    if (transaction.received.length > 0 && transaction.received[0].address !== process.env.PIRATE_MAIN_ADDRESS) {
      const address = await db.address.findOne({
        where: {
          address: transaction.received[0].address,
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
        if (address.wallet.user.user_id.startsWith('matrix')) {
          res.locals.platform = 'matrix';
          res.locals.userId = address.wallet.user.user_id.replace('matrix-', '');
        }

        console.log(transaction);
        res.locals.transaction = await db.transaction.findOrCreate({
          where: {
            txid: transaction.txid,
            type: 'receive',
          },
          defaults: {
            txid: txId,
            addressId: address.id,
            phase: 'confirming',
            type: 'receive',
            amount: transaction.received[0].value * 1e8,
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
              amount: transaction.received[0].value * 1e8,
              transactionId: res.locals.transaction[0].id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          res.locals.amount = transaction.received[0].value;
        }
        logger.info(`deposit detected for addressid: ${res.locals.transaction[0].addressId} and txid: ${res.locals.transaction[0].txid}`);
      }
    }
    t.afterCommit(() => {
      console.log('commited');
      next();
    });
  });
};

export default walletNotifyPirate;
