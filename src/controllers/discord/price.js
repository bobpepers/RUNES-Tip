import {
  ChannelType,
} from 'discord.js';
import { Transaction } from "sequelize";
import {
  priceMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const discordPrice = async (
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      'price',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    // const userId = user.user_id.replace('discord-', '');

    const priceRecord = await db.currency.findAll({});
    let replyString = ``;
    replyString += priceRecord.map((a) => `${a.iso}: ${a.price}`).join('\n');

    const createActivity = await db.activity.create({
      type: 'price_s',
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

    if (message.channel.type === ChannelType.DM) {
      await message.author.send({
        embeds: [
          priceMessage(
            replyString,
          ),
        ],
      });
    }
    if (message.channel.type === ChannelType.GuildText) {
      await message.channel.send({
        embeds: [
          priceMessage(
            replyString,
          ),
        ],
      });
    }

    t.afterCommit(() => {
      console.log('done price request');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'price',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`Error Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    message.channel.send({
      embeds: [
        discordErrorMessage(
          "Price",
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
