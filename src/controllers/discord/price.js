import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  priceMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";

export const discordPrice = async (
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

      try {
        const priceRecord = await db.priceInfo.findAll({});
        let replyString = ``;
        replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
        if (message.channel.type === 'DM') {
          await message.author.send({ embeds: [priceMessage(replyString)] });
        }
        if (message.channel.type === 'GUILD_TEXT') {
          await message.channel.send({ embeds: [priceMessage(replyString)] });
        }
      } catch (error) {
        console.log(error);
      }

      const createActivity = await db.activity.create({
        type: 'price',
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
      logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
    });
  }).catch((err) => {
    logger.error(`Error Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
