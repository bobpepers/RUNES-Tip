import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  discordWithdrawalAcceptedMessage,
  discordWithdrawalRejectedMessage,
} from "../../messages/discord";
import {
  // withdrawalAcceptedAdminMessage,
  withdrawalAcceptedMessage,
  telegramWithdrawalRejectedMessage,
} from "../../messages/telegram";

import { processWithdrawal } from '../../services/processWithdrawal';

export const acceptWithdrawal = async (
  req,
  res,
  next,
) => {
  let updatedTrans;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [
        {
          model: db.address,
          as: 'address',
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              include: [{
                model: db.user,
                as: 'user',
              }],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!transaction) {
      throw new Error("transaction not found");
    }
    const settings = await db.features.findOne({
      where: {
        type: 'global',
        name: 'withdraw',
      },
    });
    if (!settings) {
      throw new Error("settings not found");
    }
    if (transaction) {
      const [
        response,
        responseStatus,
      ] = await processWithdrawal(transaction);
      if (responseStatus === 500) {
        updatedTrans = await transaction.update(
          {
            // txid: response,
            phase: 'failed',
            type: 'send',
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        const activityF = await db.activity.create(
          {
            spenderId: transaction.address.wallet.userId,
            type: 'withdraw_f',
            transactionId: transaction.id,
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        return;
      }
      if (response) {
        res.locals.withdrawal = await transaction.update(
          {
            txid: response,
            phase: 'confirming',
            type: 'send',
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        const activity = await db.activity.create(
          {
            spenderId: transaction.address.wallet.userId,
            type: 'withdrawAccepted',
            transactionId: transaction.id,
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
      }
    }

    t.afterCommit(async () => {
      if (transaction) {
        if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
          const userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
          const myClient = await res.locals.discordClient.users.fetch(userDiscordId, false);
          await myClient.send({
            embeds: [
              discordWithdrawalAcceptedMessage(
                res.locals.withdrawal,
              ),
            ],
          });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          const userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
          await res.locals.telegramClient.telegram.sendMessage(
            userTelegramId,
            await withdrawalAcceptedMessage(
              transaction,
              res.locals.withdrawal,
            ),
            {
              parse_mode: 'HTML',
            },
          );
        }
        if (transaction.address.wallet.user.user_id.startsWith('matrix-')) {
          const userMatrixId = transaction.address.wallet.user.user_id.replace('matrix-', '');
          // TODO: SEND A WITHDRAWAL DECLINED MESSAGE TO USER ON MATRIX
          // res.locals.matrixClient has matrixclient attached
        }
      }
    });
  }).catch((err) => {
    console.log(err);
    return next("Something went wrong");
  });
  try {
    const newTransaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'confirming',
      },

      include: [
        {
          model: db.user,
          as: 'user',
        },
        {
          model: db.address,
          as: 'address',
        },
      ],
    });
    res.locals.result = newTransaction;
    next();
  } catch (e) {
    console.log(e);
  }
};

export const declineWithdrawal = async (
  req,
  res,
  next,
) => {
  let updatedTransaction;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transaction) {
      throw new Error("transaction not found");
    }

    if (transaction) {
      const wallet = await db.wallet.findOne({
        where: {
          userId: transaction.address.wallet.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!wallet) {
        throw new Error("Wallet not found");
      }
      if (wallet) {
        const updatedWallet = await wallet.update({
          available: wallet.available + transaction.amount,
          locked: wallet.locked - transaction.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        updatedTransaction = await transaction.update(
          {
            phase: 'rejected',
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        const activity = await db.activity.create(
          {
            spenderId: transaction.address.wallet.userId,
            type: 'withdrawRejected',
            transactionId: updatedTransaction.id,
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
      }
    }

    t.afterCommit(async () => {
      try {
        if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
          const userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
          const myClient = await res.locals.discordClient.users.fetch(userDiscordId, false);
          await myClient.send({
            embeds: [
              discordWithdrawalRejectedMessage(
                updatedTransaction,
              ),
            ],
          });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          const userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
          await res.locals.telegramClient.telegram.sendMessage(
            userTelegramId,
            await telegramWithdrawalRejectedMessage(
              updatedTransaction,
            ),
            {
              parse_mode: 'HTML',
            },
          );
        }
        if (transaction.address.wallet.user.user_id.startsWith('matrix-')) {
          const userMatrixId = transaction.address.wallet.user.user_id.replace('matrix-', '');
          // TODO: SEND A WITHDRAWAL DECLINED MESSAGE TO USER ON MATRIX
          // res.locals.matrixClient has matrixclient attached
        }
      } catch (error) {
        console.log(error);
      }
    });
  }).catch((err) => {
    console.log(err);
    return next("Something went wrong");
  });
  try {
    const newTransaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'rejected',
      },

      include: [
        {
          model: db.user,
          as: 'user',
        },
        {
          model: db.address,
          as: 'address',
        },
      ],
    });
    res.locals.result = newTransaction;
    next();
  } catch (e) {
    console.log(e);
  }
};

export const fetchWithdrawals = async (
  req,
  res,
  next,
) => {
  const transactionOptions = {
    type: 'send',
  };
  const userOptions = {};

  if (req.body.id !== '') {
    transactionOptions.id = {
      [Op.like]: `%${Number(req.body.id)}%`,
    };
  }
  if (req.body.txId !== '') {
    transactionOptions.txid = {
      [Op.like]: `%${req.body.txId}%`,
    };
  }
  if (req.body.to !== '') {
    transactionOptions.to_from = {
      [Op.like]: `%${req.body.to}%`,
    };
  }
  if (req.body.userId !== '') {
    transactionOptions.userId = {
      [Op.not]: null,
    };
    userOptions.user_id = {
      [Op.like]: `%${req.body.userId}%`,
    };
  }
  if (req.body.username !== '') {
    transactionOptions.userId = {
      [Op.not]: null,
    };
    userOptions.username = {
      [Op.like]: `%${req.body.username}%`,
    };
  }

  const options = {
    where: transactionOptions,
    limit: req.body.limit,
    offset: req.body.offset,
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.user,
        as: 'user',
        where: userOptions,
      },
      {
        model: db.address,
        as: 'address',
        include: [
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
      },
    ],
  };

  res.locals.name = 'withdrawal';
  res.locals.count = await db.transaction.count(options);
  res.locals.result = await db.transaction.findAll(options);
  next();
};
