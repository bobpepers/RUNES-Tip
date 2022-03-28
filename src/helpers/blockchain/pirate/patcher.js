/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../../../models';
import { getInstance } from "../../../services/rclient";

config();

export async function patchPirateDeposits() {
  const transactions = await getInstance().listTransactions(1000);

  for await (const trans of transactions) {
    if (
      trans.received
      && trans.received.length > 0
    ) {
      for await (const detail of trans.received) {
        if (detail.address) {
          if (detail.address !== process.env.PIRATE_MAIN_ADDRESS) {
            console.log(trans.received);
            console.log('trans.received');
            const address = await db.address.findOne({
              where: {
                address: detail.address,
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
                    type: 'receive',
                    userId: address.wallet.userId,
                  },
                  defaults: {
                    txid: trans.txid,
                    addressId: address.id,
                    phase: 'confirming',
                    type: 'receive',
                    amount: detail.value * 1e8,
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
}
