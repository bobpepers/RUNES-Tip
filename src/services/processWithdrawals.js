// import { MessageEmbed, MessageAttachment } from "discord.js";
import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../models';
import { getInstance } from "./rclient";
import { discordWithdrawalAcceptedMessage, discordUserWithdrawalRejectMessage } from "../messages/discord";
import { withdrawalAcceptedAdminMessage, withdrawalAcceptedMessage } from "../messages/telegram";

import settings from '../config/settings';

config();

export const processWithdrawal = async (bot, discordClient) => {
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
      const amount = ((transaction.amount - Number(settings.fee.withdrawal)) / 1e8);
      let response;

      // Add New Currency here (default fallback is Runebase)
      if (settings.coin.setting === 'Runebase') {
        response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
      } else if (settings.coin.setting === 'Pirate') {
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
          bot.telegram.sendMessage(userTelegramId, withdrawalAcceptedMessage(transaction, updatedTrans));
          // bot.telegram.sendMessage(runesGroup, withdrawalAcceptedMessage(transaction, updatedTrans));
        }
        bot.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), withdrawalAcceptedAdminMessage(updatedTrans));
      }
    });
  }).catch((err) => {
    bot.telegram.sendMessage(Number(process.env.TELEGRAM_ADMIN_ID), `Something went wrong`);
  });
};
