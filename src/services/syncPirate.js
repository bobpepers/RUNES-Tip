/* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../models';
import {
  telegramDepositConfirmedMessage,
  telegramWithdrawalConfirmedMessage,
} from '../messages/telegram';
import {
  discordDepositConfirmedMessage,
  discordWithdrawalConfirmedMessage,
} from '../messages/discord';
import getCoinSettings from '../config/settings';

import { getInstance } from "./rclient";

const settings = getCoinSettings();

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
        // index++;
        index += 1;
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

  // eslint-disable-next-line no-restricted-syntax
  for await (const trans of transactions) {
    let isWithdrawalComplete = false;
    let isDepositComplete = false;
    let userToMessage;
    const transaction = await getInstance().getTransaction(trans.txid);
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

      let updatedTransaction;
      let updatedWallet;
      if (transaction.confirmations < Number(settings.min.confirmations)) {
        updatedTransaction = await trans.update({
          confirmations: transaction.confirmations,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (transaction.confirmations >= Number(settings.min.confirmations)) {
        if (transaction.sent.length > 0 && trans.type === 'send') {
          const prepareLockedAmount = ((transaction.sent[0].value * 1e8) + Number(trans.feeAmount));
          const removeLockedAmount = Math.abs(prepareLockedAmount);

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
          userToMessage = await db.user.findOne({
            where: {
              id: updatedWallet.userId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          isWithdrawalComplete = true;
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
          userToMessage = await db.user.findOne({
            where: {
              id: updatedWallet.userId,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          isDepositComplete = true;
        }
      }
      t.afterCommit(async () => {
        let userClientId;
        if (isDepositComplete) {
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

        if (isWithdrawalComplete) {
          if (userToMessage.user_id.startsWith('discord')) {
            userClientId = userToMessage.user_id.replace('discord-', '');
            const myClient = await discordClient.users.fetch(userClientId, false);
            await myClient.send({ embeds: [discordWithdrawalConfirmedMessage(userClientId, trans)] });
          }
          if (userToMessage.user_id.startsWith('telegram')) {
            userClientId = userToMessage.user_id.replace('telegram-', '');
            telegramClient.telegram.sendMessage(userClientId, telegramWithdrawalConfirmedMessage(userToMessage));
          }
        }
        console.log('done');
      });
    });
  }
  return true;
};

const insertBlock = async (startBlock) => {
  try {
    const blockHash = await getInstance().getBlockHash(startBlock);
    if (blockHash) {
      const block = getInstance().getBlock(blockHash, 2);
      if (block) {
        const dbBlock = await db.block.findOne({
          where: {
            id: Number(startBlock),
          },
        });
        if (dbBlock) {
          await dbBlock.update({
            id: Number(startBlock),
            blockTime: block.time,
          });
        }
        if (!dbBlock) {
          await db.block.create({
            id: startBlock,
            blockTime: block.time,
          });
        }
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const startPirateSync = async (
  discordClient,
  telegramClient,
  queue,
) => {
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

      await queue.add(async () => {
        const task = await syncTransactions(discordClient, telegramClient);
      });

      await queue.add(async () => {
        const task = await insertBlock(startBlock);
      });

      startBlock = endBlock + 1;
      await loop.next();
    },
    async () => {
      console.log('Synced block');
      // setTimeout(startSync, 5000);
    },
  );
};
