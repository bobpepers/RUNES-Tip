/* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */

import PQueue from 'p-queue';
import db from '../models';

const _ = require('lodash');
const { Transaction, Op } = require('sequelize');
// const { isMainnet } = require('./runebaseConfig');

const { getInstance } = require('./rclient');

const queue = new PQueue({ concurrency: 1 });

// const RPC_BATCH_SIZE = 1;
const BLOCK_BATCH_SIZE = 1;
// const SYNC_THRESHOLD_SECS = 2400;
// const BLOCK_0_TIMESTAMP = 0;

const sequentialLoop = async (iterations, process, exit) => {
  let index = 0;
  let done = false;
  let shouldExit = false;

  const loop = {
    async next() {
      if (done) {
        if (shouldExit && exit) {
          return exit();
        }
      }

      if (index < iterations) {
        index++;
        await process(loop);
      } else {
        done = true;

        if (exit) {
          exit();
        }
      }
    },

    iteration() {
      return index - 1; // Return the loop number we're on
    },

    break(end) {
      done = true;
      shouldExit = end;
    },
  };
  await loop.next();
  return loop;
};

const syncTransactions = async (startBlock, endBlock) => {
  const transactions = await db.transaction.findAll({
    where: {
      phase: 'confirming',
    },
    include: [{
      model: db.address,
      as: 'address',
      include: [{
        model: db.wallet,
        as: 'wallet',
      }],
    }],
  });
  console.log('transactions');

  console.log(transactions);
  // eslint-disable-next-line no-restricted-syntax
  for await (const trans of transactions) {
    const transaction = await getInstance().getTransaction(trans.txid);
    // eslint-disable-next-line no-restricted-syntax
    // for await (const detail of transaction.details) {
    // eslint-disable-next-line no-await-in-loop
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    // eslint-disable-next-line no-loop-func
    }, async (t) => {
      const wallet = await db.wallet.findOne({
        where: {
          userId: trans.address.wallet.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      console.log('update transaction');
      console.log(transaction);
      let updatedTransaction;
      let updatedWallet;
      console.log(transaction.confirmations);
      if (transaction.confirmations < Number(process.env.MINIMUM_TRANSACTION_CONFIRMATIONS)) {
        updatedTransaction = await trans.update({
          confirmations: transaction.confirmations,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (transaction.confirmations >= Number(process.env.MINIMUM_TRANSACTION_CONFIRMATIONS)) {
        // transaction.details.forEach(async (detail) => {

        if (transaction.sent.length > 0 && trans.type === 'send') {
          console.log(transaction.sent[0].value);
          console.log(((transaction.sent[0].value * 1e8)));
          const prepareLockedAmount = ((transaction.sent[0].value * 1e8) - Number(process.env.MINIMUM_WITHDRAWAL));
          const removeLockedAmount = Math.abs(prepareLockedAmount);
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');
          console.log('removeLockedAmount');

          console.log(removeLockedAmount);
          updatedWallet = await wallet.update({
            locked: wallet.locked - removeLockedAmount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          updatedTransaction = await trans.update({
            confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
            phase: 'confirmed',
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createActivity = await db.activity.create({
            spenderId: updatedWallet.userId,
            type: 'withdrawComplete',
            amount: transaction.sent[0].value * 1e8,
            spender_balance: updatedWallet.available + updatedWallet.locked,
            transactionId: updatedTransaction.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        if (transaction.received.length > 0 && trans.type === 'receive') {
          console.log('updating balance');
          updatedWallet = await wallet.update({
            available: wallet.available + (transaction.received[0].value * 1e8),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          updatedTransaction = await trans.update({
            confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
            phase: 'confirmed',
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createActivity = await db.activity.create({
            earnerId: updatedWallet.userId,
            type: 'depositComplete',
            amount: transaction.received[0].value * 1e8,
            earner_balance: updatedWallet.available + updatedWallet.locked,
            transactionId: updatedTransaction.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
      }
      t.afterCommit(() => {
        console.log('done');
      });
    });
    // }
  }
  console.log(transactions.length);
  return true;
};

const getInsertBlockPromises = async (startBlock, endBlock) => {
  let blockHash;
  let blockTime;
  const insertBlockPromises = [];

  for (let i = startBlock; i <= endBlock; i += 1) {
    console.log(i);
    const blockPromise = new Promise((resolve) => {
      try {
        getInstance().getBlockHash(i).then((blockHash) => {
          getInstance().getBlock(blockHash, 2).then((blockInfo) => {
            db.block.findOne({
              where: {
                id: i,
              },
            }).then(async (obj) => {
              if (obj) {
                await obj.update({
                  id: i,
                  blockTime: blockInfo.time,
                });
              }
              if (!obj) {
                await db.block.create({
                  id: i,
                  blockTime,
                });
              }
              resolve();
            });
          }).catch((err) => {
            console.log(err);
          });
        }).catch((err) => {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    });

    insertBlockPromises.push(blockPromise);
  }

  return { insertBlockPromises };
};

const sync = async () => {
  const currentBlockCount = Math.max(0, await getInstance().getBlockCount());
  const currentBlockHash = await getInstance().getBlockHash(currentBlockCount);
  const currentBlockTime = (await getInstance().getBlock(currentBlockHash)).time;
  let startBlock = Number(process.env.START_SYNC_HEIGHT);

  // const blocks = await db.Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();
  const blocks = await db.block.findAll({
    limit: 1,
    order: [['id', 'DESC']],
  });

  if (blocks.length > 0) {
    startBlock = Math.max(blocks[0].id + 1, startBlock);
  }

  const numOfIterations = Math.ceil(((currentBlockCount - startBlock) + 1) / BLOCK_BATCH_SIZE);

  await sequentialLoop(
    numOfIterations,
    async (loop) => {
      const endBlock = Math.min((startBlock + BLOCK_BATCH_SIZE) - 1, currentBlockCount);

      // await syncTransactions(startBlock, endBlock);
      await queue.add(() => syncTransactions(startBlock, endBlock));

      const { insertBlockPromises } = await getInsertBlockPromises(startBlock, endBlock);
      await queue.add(() => Promise.all(insertBlockPromises));
      // await Promise.all(insertBlockPromises);
      console.log('Inserted Blocks');

      startBlock = endBlock + 1;
      await loop.next();
    },
    async () => {
      if (numOfIterations > 0) {
        // sendSyncInfo(
        //  currentBlockCount,
        //  currentBlockTime,
        //  await calculateSyncPercent(currentBlockCount, currentBlockTime),
        //  await network.getPeerNodeCount(),
        //  await getAddressBalances(),
        // );
      }
      console.log('sleep');
      // setTimeout(startSync, 5000);
    },
  );
};

async function startPirateSync() {
  sync();
}

module.exports = {
  startPirateSync,
};
