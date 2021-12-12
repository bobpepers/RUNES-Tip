import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../models';
import { discordWithdrawalAcceptedMessage, discordUserWithdrawalRejectMessage } from "../messages/discord";
import {
  withdrawalAcceptedAdminMessage,
  withdrawalAcceptedMessage,
} from "../messages/telegram";
import { processWithdrawal } from "./processWithdrawal";

config();

export const processWithdrawals = async (
  telegramClient,
  discordClient,
) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let updatedTrans;
    const transaction = await db.transaction.findOne({
      where: {
        // id: withdrawalId,
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
      console.log('No withdrawal to process');
      return;
      // ctx.reply('Transaction not found');
    }
    if (transaction) {
      const response = await processWithdrawal(transaction);

      if (response) {
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
          telegramClient.telegram.sendMessage(userTelegramId, withdrawalAcceptedMessage(transaction, updatedTrans));
        }
        telegramClient.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), withdrawalAcceptedAdminMessage(updatedTrans));
      }
    });
  }).catch((err) => {
    telegramClient.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), `Something went wrong`);
  });
};
