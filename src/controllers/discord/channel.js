import { Transaction } from "sequelize";
import db from '../../models';

export const updateDiscordChannel = async (client, message, group) => {
  console.log(message);
  console.log('updateDiscordMessage');
  let channelRecord;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    // const channel = await client.channels.cache.get(message.channelId);
    const channel = message.guild.channels.cache.get(message.channelId);
    console.log(channel);
    if (message.channelId) {
      channelRecord = await db.channel.findOne(
        {
          where: {
            channelId: `discord-${message.channelId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!channelRecord) {
        channelRecord = await db.channel.create({
          channelId: `discord-${message.channelId}`,
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
