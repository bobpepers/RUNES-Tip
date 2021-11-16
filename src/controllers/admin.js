import { MessageEmbed, MessageAttachment } from "discord.js";
import { Sequelize, Transaction, Op } from "sequelize";
import db from '../models';

import { getInstance } from "../services/rclient";
import { discordWithdrawalAcceptedMessage, discordUserWithdrawalRejectMessage } from "../messages/discord";
import { withdrawalAcceptedAdminMessage, withdrawalAcceptedMessage } from "../messages/telegram";

import settings from '../config/settings';

/**
 * Create Withdrawal
 */
export const withdrawTelegramAdminFetch = async (bot, ctx, adminTelegramId) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('start the widtdddd');
    const withdrawal = await db.transaction.findOne({
      order: [['createdAt', 'DESC']],
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
      where: {
        type: 'send',
        phase: 'review',
      },
    });

    if (!withdrawal) {
      ctx.reply('No Withdrawals');
    }
    if (withdrawal) {
      const withdrawalMessage = `${withdrawal.address.wallet.user.username} with user_id ${withdrawal.address.wallet.user.user_id}
available: ${withdrawal.address.wallet.available / 1e8} 
locked: ${withdrawal.address.wallet.locked / 1e8} 
amount: ${withdrawal.amount / 1e8} 
      `;
      ctx.deleteMessage();
      bot.telegram.sendMessage(adminTelegramId, withdrawalMessage, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "acceptWithdrawal",
              callback_data: `acceptWithdrawal-${withdrawal.id}`,
            },
            {
              text: "declineWithdrawal",
              callback_data: `declineWithdrawal-${withdrawal.id}`,
            },
            ],

          ],
        },
      });
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong');
  });
};

/**
 * isAdmin
 */
export const withdrawTelegramAdminAccept = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let updatedTrans;
    const transaction = await db.transaction.findOne({
      where: {
        id: withdrawalId,
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
      ctx.reply('Transaction not found');
    }
    if (transaction) {
      const amount = ((transaction.amount - Number(settings.fee.withdrawal)) / 1e8);
      let response;

      // Add New Currency here (default fallback is Runebase)
      if (settings.coin.name === 'Runebase') {
        response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
      } else if (settings.coin.name === 'Pirate') {
        const preResponse = await getInstance().zSendMany(
          process.env.PIRATE_MAIN_ADDRESS,
          [{ address: transaction.to_from, amount: amount.toFixed(8) }],
          1,
          0.0001,
        );
        let opStatus = await getInstance().zGetOperationStatus([preResponse]);
        while (!opStatus || opStatus[0].status === 'executing') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          opStatus = await getInstance().zGetOperationStatus([preResponse]);
        }
        console.log('opStatus');
        console.log(opStatus);
        response = opStatus[0].result.txid;
      } else {
        response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
      }

      console.log(5);
      updatedTrans = await transaction.update(
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

    t.afterCommit(async () => {
      if (transaction) {
        if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
          const userDiscordId = transaction.address.wallet.user.user_id.replace('discord-', '');
          const myClient = await discordClient.users.fetch(userDiscordId, false);
          await myClient.send({ embeds: [discordWithdrawalAcceptedMessage(updatedTrans)] });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          const userTelegramId = transaction.address.wallet.user.user_id.replace('telegram-', '');
          bot.telegram.sendMessage(userTelegramId, withdrawalAcceptedMessage(transaction, updatedTrans));
          // bot.telegram.sendMessage(runesGroup, withdrawalAcceptedMessage(transaction, updatedTrans));
        }
        bot.telegram.sendMessage(adminTelegramId, withdrawalAcceptedAdminMessage(updatedTrans));
        withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
      }
    });
  }).catch((err) => {
    bot.telegram.sendMessage(adminTelegramId, `Something went wrong`);
  });
};

export const withdrawTelegramAdminDecline = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: withdrawalId,
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

    const newUserId = transaction.address.wallet.user.user_id.replace('discord-', '');
    const myClient = await discordClient.users.fetch(newUserId, false);

    if (!transaction) {
      ctx.reply('Transaction not found');
      // await myClient.send({ embeds: [transactionNotFoundMessage('Withdraw')] });
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
        ctx.reply('Wallet not found');
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
          await myClient.send({ embeds: [discordUserWithdrawalRejectMessage()] });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been rejected`);
        }
        bot.telegram.sendMessage(adminTelegramId, `Withdrawal Rejected`);
      }
    }

    t.afterCommit(() => {
      withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
    });
  }).catch((err) => {
    bot.telegram.sendMessage(adminTelegramId, `Something went wrong`);
  });
  const newTransaction = await db.transaction.findOne({
    where: {
      id: withdrawalId,
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
  console.log(newTransaction.address.wallet.user.user_id);
  const userTelegramId = newTransaction.address.wallet.user.user_id.substring(9);
  console.log(userTelegramId);
  if (newTransaction) {
    bot.telegram.sendMessage(userTelegramId, `Your withdrawal has been rejected`);
  }
};

export const fetchAdminNodeBalance = async (req, res, next) => {
  try {
    const response = await getInstance().getWalletInfo();
    console.log(response);
    res.locals.balance = response.balance;
    // console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
