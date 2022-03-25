import { Transaction } from "sequelize";
import db from '../../models';
import logger from "../../helpers/logger";

export const updateDiscordChannel = async (
  message,
  group,
) => {
  let channelId;
  let channelRecord;

  if (message.type && message.type === "GUILD_VOICE") {
    channelId = message.id;
  } else if (message.guild && message.guild.id && message.channelId) {
    channelId = message.channelId;
  } else if (message.guildId && message.channelId) {
    channelId = message.channelId;
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (channelId) {
      // const channel = await client.channels.cache.get(message.channelId);
      const channel = await message.guild.channels.cache.get(channelId);

      channelRecord = await db.channel.findOne(
        {
          where: {
            channelId: `discord-${channelId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!channelRecord) {
        channelRecord = await db.channel.create({
          channelId: `discord-${channelId}`,
          lastActive: Date.now(),
          channelName: channel.name,
          groupId: group.id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (channelRecord) {
        channelRecord = await channelRecord.update(
          {
            channelName: channel.name,
            lastActive: Date.now(),
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
      }
    }

    t.afterCommit(() => {
      console.log('done update discord channel');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'channel',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`channel error: ${err}`);
    console.log(err.message);
  });
  return channelRecord;
};
