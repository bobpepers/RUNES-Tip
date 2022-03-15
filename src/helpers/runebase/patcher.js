import { Transaction, Op } from "sequelize";
import db from '../../models';

import { getInstance } from "../../services/rclient";

export async function patchRunebaseDeposits() {
  const transactions = await getInstance().listTransactions(1000);

  // eslint-disable-next-line no-restricted-syntax
  for await (const trans of transactions) {
    if (trans.category === 'receive') {
      if (trans.address) {
        // eslint-disable-next-line no-await-in-loop
        const address = await db.address.findOne({
          where: {
            address: trans.address,
          },
          include: [
            {
              model: db.wallet,
              as: 'wallet',
            },
          ],
        });

        if (!address) {
          console.log(trans.address);
          console.log('address not found');
        }
        if (address) {
          // eslint-disable-next-line no-await-in-loop
          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          }, async (t) => {
            const newTrans = await db.transaction.findOrCreate({
              where: {
                txid: trans.txid,
                type: trans.category,
              },
              defaults: {
                txid: trans.txid,
                addressId: address.id,
                phase: 'confirming',
                type: trans.category,
                amount: trans.amount * 1e8,
                userId: address.wallet.userId,
              },
              transaction: t,
              lock: t.LOCK.UPDATE,
            });

            t.afterCommit(() => {
              console.log('commited');
            });
          });
        }
      }
    }
  }
}
