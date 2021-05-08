import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');

async function patchDeposits() {
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');
  console.log('patchDeposits');

  const transactions = await getInstance().listTransactions(1000);
  transactions.forEach(async (trans) => {
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log('patchDeposits');
    console.log(trans);
    if (trans.address) {
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
        return;
      }
      console.log(trans);
      console.log(address);
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      }, async (t) => {
        await db.transaction.findOrCreate({
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
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        t.afterCommit(() => {
          console.log('commited');
        });
      });
    }
  });
}

module.exports = {
  patchDeposits,
};
