import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  discordWithdrawalAcceptedMessage,
  discordWithdrawalRejectedMessage,
} from "../../messages/discord";
import {
  withdrawalAcceptedAdminMessage,
  withdrawalAcceptedMessage,
  telegramWithdrawalRejectedMessage,
} from "../../messages/telegram";

import { processWithdrawal } from '../../services/processWithdrawal';

export const acceptWithdrawal = async (
  req,
  res,
  next,
) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let updatedTrans;
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
      res.locals.error = "Transaction not found";
      next();
    }
    const settings = await db.features.findOne({
      where: {
        type: 'global',
        name: 'withdraw',
      },
    });
    if (!settings) {
      res.locals.error = "settings not found";
      next();
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
          await myClient.send({ embeds: [discordWithdrawalAcceptedMessage(res.locals.withdrawal)] });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          const userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
          res.locals.telegramClient.telegram.sendMessage(userTelegramId, withdrawalAcceptedMessage(transaction, res.locals.withdrawal));
          // bot.telegram.sendMessage(runesGroup, withdrawalAcceptedMessage(transaction, updatedTrans));
        }
        // res.locals.telegramClient.telegram.sendMessage(adminTelegramId, withdrawalAcceptedAdminMessage(updatedTrans));
      }
      next();
    });
  }).catch((err) => {
    // res.locals.telegramClient.telegram.sendMessage(adminTelegramId, `Something went wrong`);
  });
};

export const declineWithdrawal = async (
  req,
  res,
  next,
) => {
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
      res.locals.error = "transaction not found";
    }
    console.log("123");
    if (transaction) {
      const wallet = await db.wallet.findOne({
        where: {
          userId: transaction.address.wallet.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!wallet) {
        res.locals.error = "Wallet not found";
      }
      if (wallet) {
        const updatedWallet = await wallet.update({
          available: wallet.available + transaction.amount,
          locked: wallet.locked - transaction.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const updatedTransaction = await transaction.update(
          {
            phase: 'rejected',
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        console.log('beforeActivity');
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
        if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
          // await myClient.send({ embeds: [discordUserWithdrawalRejectMessage()] });
          const userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
          const myClient = await res.locals.discordClient.users.fetch(userDiscordId, false);
          await myClient.send({ embeds: [discordWithdrawalRejectedMessage(updatedTransaction)] });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          const userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
          res.locals.telegramClient.telegram.sendMessage(userTelegramId, telegramWithdrawalRejectedMessage(updatedTransaction));
          // bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been rejected`);
        }
        // bot.telegram.sendMessage(adminTelegramId, `Withdrawal Rejected`);
      }
    }

    t.afterCommit(() => {
      console.log("done");
    });
  }).catch((err) => {
    console.log(err);
    res.locals.error = "Something went wrong";
    next();
  });
  const newTransaction = await db.transaction.findOne({
    where: {
      id: req.body.id,
      phase: 'rejected',
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
  });
  res.locals.withdrawal = newTransaction;
  next();
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
  console.log(req.body.userId);

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
