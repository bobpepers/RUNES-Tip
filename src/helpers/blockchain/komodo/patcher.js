/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../../../models';
import { getInstance } from "../../../services/rclient";

config();

export async function patchKomodoDeposits() {
  const transactions = await getInstance().listTransactions(1000);

  for await (const trans of transactions) {
    if (trans.category === 'receive') {
      if (trans.address) {
        if (trans.address !== process.env.KOMODO_CONSOLIDATION_ADDRESS) {
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

          if (address) {
            await db.sequelize.transaction({
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            }, async (t) => {
              const newTrans = await db.transaction.findOrCreate({
                where: {
                  txid: trans.txid,
                  type: trans.category,
                  userId: address.wallet.userId,
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
}
