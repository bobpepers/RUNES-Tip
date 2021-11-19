import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  balanceMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";

export const fetchDiscordWalletBalance = async (message) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const priceInfo = await db.priceInfo.findOne({
      where: {
        currency: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      // ctx.reply(`Wallet not found`);
      await message.author.send("Wallet not found");
    }

    if (user && user.wallet) {
      const userId = user.user_id.replace('discord-', '');

      if (message.channel.type === 'DM') {
        await message.author.send({ embeds: [balanceMessage(userId, user, priceInfo)] });
      }

      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
        await message.author.send({ embeds: [balanceMessage(userId, user, priceInfo)] });
      }

      await db.activity.create({
        type: 'balance',
        earnerId: user.id,
      });
    }

    t.afterCommit(() => {
      logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
    });
  }).catch((err) => {
    logger.error(`Error Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
  });
};
