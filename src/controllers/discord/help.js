/* eslint-disable import/prefer-default-export */
import {
  ChannelType,
} from 'discord.js';
import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  helpMessageOne,
  helpMessageTwo,
  cannotSendMessageUser,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { fetchDiscordChannel } from '../../helpers/client/discord/fetchDiscordChannel';

export const discordHelp = async (
  discordClient,
  message,
  io,
) => {
  console.log('running help');
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
      'help',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;
    const [
      discordChannel,
      discordUserDMChannel,
    ] = await fetchDiscordChannel(
      discordClient,
      message,
    );
    console.log('found user');
    console.log(user);

    const withdraw = await db.features.findOne(
      {
        where: {
          type: 'global',
          name: 'withdraw',
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      },
    );
    console.log(message.channel.type);
    if (message.channel.type === ChannelType.DM) {
      console.log('channel is of type DM');
      await discordUserDMChannel.send({
        embeds: [
          helpMessageOne(
            withdraw,
          ),
        ],
      });
      await discordUserDMChannel.send({
        embeds: [
          helpMessageTwo(
            withdraw,
          ),
        ],
      });
    }
    if (message.channel.type === ChannelType.GuildText) {
      console.log('channel is of type guildText');
      await discordUserDMChannel.send({
        embeds: [
          helpMessageOne(
            withdraw,
          ),
        ],
      });
      await discordUserDMChannel.send({
        embeds: [
          helpMessageTwo(
            withdraw,
          ),
        ],
      });
      await discordChannel.send({
        embeds: [
          warnDirectMessage(
            user.user_id.replace('discord-', ''),
            'Help',
          ),
        ],
      });
    }
    console.log(user);
    console.log(user.id);
    const preActivity = await db.activity.create({
      type: 'help_s',
      earnerId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const finalActivity = await db.activity.findOne({
      where: {
        id: preActivity.id,
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
    activity.unshift(finalActivity);
  }).catch(async (err) => {
    console.log(err);
    try {
      await db.error.create({
        type: 'help',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    // logger.error(`Error Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Help",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            "Help",
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    }
  });

  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
