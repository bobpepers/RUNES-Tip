/* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */

import PQueue from 'p-queue';
import _ from "lodash";
import { Transaction, Op } from "sequelize";
import db from '../models';
import {
  telegramDepositConfirmedMessage,
} from '../messages/telegram';
import {
  discordDepositConfirmedMessage,
} from '../messages/discord';
import settings from '../config/settings';

// const { isMainnet } = require('./runebaseConfig');

import { getInstance } from "./rclient";

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
  console.log('transactions');

  console.log(transactions);
  // eslint-disable-next-line no-restricted-syntax
  for await (const trans of transactions) {
    const transaction = await getInstance().getTransaction(trans.txid);

    // eslint-disable-next-line no-restricted-syntax
    for await (const detail of transaction.details) {
      // eslint-disable-next-line no-await-in-loop
      await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
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

          if (detail.category === 'send' && trans.type === 'send') {
            console.log(detail.amount);
            console.log(((detail.amount * 1e8)));
            const prepareLockedAmount = ((detail.amount * 1e8) - Number(settings.fee.withdrawal));
            const removeLockedAmount = Math.abs(prepareLockedAmount);

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
              amount: detail.amount * 1e8,
              spender_balance: updatedWallet.available + updatedWallet.locked,
              transactionId: updatedTransaction.id,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }
          if (detail.category === 'receive' && trans.type === 'receive') {
            console.log('updating balance');
            updatedWallet = await wallet.update({
              available: wallet.available + (detail.amount * 1e8),
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
              amount: detail.amount * 1e8,
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
              await myClient.send({ embeds: [discordDepositConfirmedMessage(detail.amount)] });
            }
            if (userToMessage.user_id.startsWith('telegram')) {
              userClientId = userToMessage.user_id.replace('telegram-', '');
              telegramClient.telegram.sendMessage(userClientId, telegramDepositConfirmedMessage(detail.amount));
            }
          }
        }
        t.afterCommit(() => {
          console.log('done');
        });
      });
    }
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

const sync = async (discordClient, telegramClient) => {
  const currentBlockCount = Math.max(0, await getInstance().getBlockCount());
  const currentBlockHash = await getInstance().getBlockHash(currentBlockCount);
  const currentBlockTime = (await getInstance().getBlock(currentBlockHash)).time;
  let startBlock = Number(settings.startSyncBlock);

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
      await queue.add(() => syncTransactions(discordClient, telegramClient));
      console.log('Synced syncTrade');

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

export async function startRunebaseSync(discordClient, telegramClient) {
  // const transactions = await getInstance().listTransactions(1000);
  // console.log(transactions);

  // TransactionModel.findAll
  // MetaData = await getContractMetadata();
  // senderAddress = isMainnet() ? 'RKBLGRvYqunBtpueEPuXzQQmoVsQQTvd3a' : '5VMGo2gGHhkW5TvRRtcKM1RkyUgrnNP7dn';
  // console.log('startSync');
  sync(discordClient, telegramClient);
}
