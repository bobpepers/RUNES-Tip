/* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */

import PQueue from 'p-queue';
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../models';
// const { isMainnet } = require('./runebaseConfig');
import {
  telegramDepositConfirmedMessage,
} from '../messages/telegram';
import {
  discordDepositConfirmedMessage,
} from '../messages/discord';
import getCoinSettings from '../config/settings';

import { getInstance } from "./rclient";

const settings = getCoinSettings();

const queue = new PQueue({ concurrency: 1 });

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

const syncTransactions = async (discordClient, telegramClient) => {
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
  // console.log('transactions');

  // console.log(transactions);
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

      // console.log('update transaction');
      // console.log(transaction);
      let updatedTransaction;
      let updatedWallet;
      // console.log(transaction.confirmations);
      if (transaction.confirmations < Number(settings.min.confirmations)) {
        updatedTransaction = await trans.update({
          confirmations: transaction.confirmations,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (transaction.confirmations >= Number(settings.min.confirmations)) {
        // transaction.details.forEach(async (detail) => {

        if (transaction.sent.length > 0 && trans.type === 'send') {
          // console.log(transaction.sent[0].value);
          // console.log(((transaction.sent[0].value * 1e8)));
          const prepareLockedAmount = ((transaction.sent[0].value * 1e8) - Number(trans.feeAmount));
          const removeLockedAmount = Math.abs(prepareLockedAmount);

          // console.log('removeLockedAmount');
          // console.log(removeLockedAmount);

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
          /// Add To faucet
          const faucet = await db.faucet.findOne({
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (faucet) {
            await faucet.update({
              amount: Number(faucet.amount) + Number(trans.feeAmount / 2),
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }
          const createFaucetActivity = await db.activity.create({
            spenderId: updatedWallet.userId,
            type: 'faucet_add',
            amount: trans.feeAmount / 2,
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
          const userToMessage = await db.user.findOne({
            where: {
              id: updatedWallet.userId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          let userClientId;
          if (userToMessage.user_id.startsWith('discord')) {
            userClientId = userToMessage.user_id.replace('discord-', '');
            const myClient = await discordClient.users.fetch(userClientId, false);
            await myClient.send({ embeds: [discordDepositConfirmedMessage(transaction.received[0].value)] });
          }
          if (userToMessage.user_id.startsWith('telegram')) {
            userClientId = userToMessage.user_id.replace('telegram-', '');
            telegramClient.telegram.sendMessage(userClientId, telegramDepositConfirmedMessage(transaction.received[0].value));
          }
        }
      }
      t.afterCommit(() => {
        console.log('done');
      });
    });
    // }
  }
  // console.log(transactions.length);
  return true;
};

const getInsertBlockPromises = async (startBlock, endBlock) => {
  let blockHash;
  let blockTime;
  const insertBlockPromises = [];

  for (let i = startBlock; i <= endBlock; i += 1) {
    // console.log(i);
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

const sync = async (discordClient, telegramClient) => {
  const currentBlockCount = Math.max(0, await getInstance().getBlockCount());
  let startBlock = Number(settings.startSyncBlock);
  const blocks = await db.block.findAll({
    limit: 1,
    order: [['id', 'DESC']],
  });

  if (blocks.length > 0) {
    startBlock = Math.max(blocks[0].id + 1, startBlock);
  }

  const numOfIterations = Math.ceil(((currentBlockCount - startBlock) + 1) / 1);

  await sequentialLoop(
    numOfIterations,
    async (loop) => {
      const endBlock = Math.min((startBlock + 1) - 1, currentBlockCount);

      // await syncTransactions(startBlock, endBlock);
      await queue.add(() => syncTransactions(discordClient, telegramClient));

      const { insertBlockPromises } = await getInsertBlockPromises(startBlock, endBlock);
      await queue.add(() => Promise.all(insertBlockPromises));
      // await Promise.all(insertBlockPromises);
      console.log('Inserted Blocks');

      startBlock = endBlock + 1;
      await loop.next();
    },
    async () => {
      console.log('sleep');
      // setTimeout(startSync, 5000);
    },
  );
};

export async function startPirateSync(discordClient, telegramClient) {
  sync(discordClient, telegramClient);
}
