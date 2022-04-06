/* eslint-disable no-restricted-syntax */
/* eslint no-underscore-dangle: [2, { "allow": ["_eventName", "_address", "_time", "_orderId"] }] */
import _ from "lodash";
import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../models';
import { getInstance } from "./rclient";
import { waterFaucet } from "../helpers/waterFaucet";
import { isDepositOrWithdrawalCompleteMessageHandler } from '../helpers/messageHandlers';
import getCoinSettings from '../config/settings';

config();

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

const syncTransactions = async (
  discordClient,
  telegramClient,
  matrixClient,
) => {
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
    const transaction = await getInstance().getTransaction(trans.txid);
    console.log(transaction);
    if (
      transaction.sent
      && transaction.sent.length > 0
      && trans.type === 'send'
    ) {
      for await (const detail of transaction.sent) {
        if (
          detail.address !== process.env.PIRATE_MAIN_ADDRESS
        ) {
          let isWithdrawalComplete = false;
          const isDepositComplete = false;
          let userToMessage;
          let updatedTransaction;
          let updatedWallet;
          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          }, async (t) => {
            const processTransaction = await db.transaction.findOne({
              where: {
                phase: 'confirming',
                id: trans.id,
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
            if (processTransaction) {
              const wallet = await db.wallet.findOne({
                where: {
                  userId: processTransaction.address.wallet.userId,
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
              });

              if (transaction.confirmations < Number(settings.min.confirmations)) {
                updatedTransaction = await processTransaction.update({
                  confirmations: transaction.confirmations,
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
              }

              if (transaction.confirmations >= Number(settings.min.confirmations)) {
                const prepareLockedAmount = ((detail.value * 1e8) + Number(processTransaction.feeAmount));
                const removeLockedAmount = Math.abs(prepareLockedAmount);

                updatedWallet = await wallet.update({
                  locked: wallet.locked - removeLockedAmount,
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                updatedTransaction = await processTransaction.update({
                  confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                  phase: 'confirmed',
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                const createActivity = await db.activity.create({
                  spenderId: updatedWallet.userId,
                  type: 'withdrawComplete',
                  amount: detail.value * 1e8,
                  spender_balance: updatedWallet.available + updatedWallet.locked,
                  transactionId: updatedTransaction.id,
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });

                const faucetSetting = await db.features.findOne({
                  where: {
                    type: 'global',
                    name: 'faucet',
                  },
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });

                const faucetWatered = await waterFaucet(
                  t,
                  Number(processTransaction.feeAmount),
                  faucetSetting,
                );

                userToMessage = await db.user.findOne({
                  where: {
                    id: updatedWallet.userId,
                  },
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                isWithdrawalComplete = true;
              }
            }

            t.afterCommit(async () => {
              await isDepositOrWithdrawalCompleteMessageHandler(
                isDepositComplete,
                isWithdrawalComplete,
                discordClient,
                telegramClient,
                matrixClient,
                userToMessage,
                trans,
                detail.value,
              );
            });
          });
        }
      }
    }

    if (transaction.received
      && transaction.received.length > 0
      && trans.type === 'receive'
    ) {
      for await (const detail of transaction.received) {
        if (
          detail.address !== process.env.PIRATE_MAIN_ADDRESS
          && detail.address === trans.address.address
        ) {
          const isWithdrawalComplete = false;
          let isDepositComplete = false;
          let userToMessage;
          let updatedTransaction;
          let updatedWallet;
          await db.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          }, async (t) => {
            const processTransaction = await db.transaction.findOne({
              where: {
                phase: 'confirming',
                id: trans.id,
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
            if (processTransaction) {
              const wallet = await db.wallet.findOne({
                where: {
                  userId: processTransaction.address.wallet.userId,
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
              });

              if (transaction.confirmations < Number(settings.min.confirmations)) {
                updatedTransaction = await processTransaction.update({
                  confirmations: transaction.confirmations,
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
              }
              if (transaction.confirmations >= Number(settings.min.confirmations)) {
                console.log('updating balance');
                updatedWallet = await wallet.update({
                  available: wallet.available + (detail.value * 1e8),
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                updatedTransaction = await processTransaction.update({
                  confirmations: transaction.confirmations > 30000 ? 30000 : transaction.confirmations,
                  phase: 'confirmed',
                }, {
                  transaction: t,
                  lock: t.LOCK.UPDATE,
                });
                const createActivity = await db.activity.create({
                  earnerId: updatedWallet.userId,
                  type: 'depositComplete',
                  amount: detail.value * 1e8,
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
              await isDepositOrWithdrawalCompleteMessageHandler(
                isDepositComplete,
                isWithdrawalComplete,
                discordClient,
                telegramClient,
                matrixClient,
                userToMessage,
                trans,
                detail.value,
              );
            });
          });
        }
      }
    }
  }
  // return true;
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
  matrixClient,
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
        const task = await syncTransactions(
          discordClient,
          telegramClient,
          matrixClient,
        );
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
