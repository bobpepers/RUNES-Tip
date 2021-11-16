import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../../models';
import { getInstance } from "../../services/rclient";

config();

export async function patchPirateDeposits() {
  const transactions = await getInstance().listTransactions(1000);
  // transactions.forEach(async (trans) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const trans of transactions) {
    console.log('show transaction');
    console.log(trans);
    if (
      trans.received.length > 0
      && trans.received[0].address
      && trans.received[0].address !== process.env.PIRATE_MAIN_ADDRESS
    ) {
      // eslint-disable-next-line no-await-in-loop
      const address = await db.address.findOne({
        where: {
          address: trans.received[0].address,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
      });

      if (!address) {
        console.log(trans.received[0].address);
        console.log('address not found');
      }
      if (address) {
        // eslint-disable-next-line no-await-in-loop
        await db.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        }, async (t) => {
          console.log('begin transaction');
          let category = null;
          if (trans.received.length > 0) {
            category = 'receive';
          }
          if (trans.sent.length > 0) {
            category = 'send';
          }
          const newTrans = await db.transaction.findOrCreate({
            where: {
              txid: trans.txid,
              type: category,
            },
            defaults: {
              txid: trans.txid,
              addressId: address.id,
              phase: 'confirming',
              type: category,
              amount: trans.received[0].value * 1e8,
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
  // });
  }
}
