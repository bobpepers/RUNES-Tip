import { Transaction } from "sequelize";
import db from '../../models';

export const updateDiscordChannel = async (
  client,
  message,
  group,
) => {
  let channelId;
  let channelRecord;

  if (message.type && message.type === "GUILD_VOICE") {
    console.log('GUILD_VOICE');
    channelId = message.id;
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
      console.log('done');
    });
  }).catch((err) => {
    console.log(err.message);
  });
  return channelRecord;
};
