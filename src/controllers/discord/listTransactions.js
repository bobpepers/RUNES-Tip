import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  listTransactionsMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";

export const fetchDiscordListTransactions = async (
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user) {
      // ctx.reply(`Wallet not found`);
      const createFailActivity = await db.activity.create({
        type: 'listtransactions_f',
        earnerId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(createFailActivity);
      await message.author.send("User not found");
    }
    if (user) {
      const userId = user.user_id.replace('discord-', '');
      const transactions = await db.transaction.findAll({
        where: {
          userId: user.id,
        },
        order: [
          [
            'id',
            'DESC',
          ],
        ],
        limit: 10,
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (message.channel.type === 'DM') {
        await message.author.send({ embeds: [listTransactionsMessage(userId, user, transactions)] });
      }

      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
        await message.author.send({ embeds: [listTransactionsMessage(userId, user, transactions)] });
      }
      const createActivity = await db.activity.create({
        type: 'listtransactions_s',
        earnerId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      const findActivity = await db.activity.findOne({
        where: {
          id: createActivity.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(findActivity);
    }

    t.afterCommit(() => {
      // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
      console.log('done list transactions request');
    });
  }).catch((err) => {
    logger.error(`Error Discord List Transactions Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("List transactions")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
