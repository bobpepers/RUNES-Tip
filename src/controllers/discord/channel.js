/* eslint-disable import/prefer-default-export */
import db from '../../models';
import { Transaction } from "sequelize";

export const updateDiscordChannel = async (client, message) => {
  console.log(message);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (message.channelId) {
      // const guild = await client.guilds.cache.get(message.guildId);
    // const channel = await client.guilds.cache.get(message.guildId).channels.cache.get(message.channelId);
      let channelRecord = await db.channel.findOne(
        {
          where: {
            channelId: `${message.channelId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!channelRecord) {
        channelRecord = await db.channel.create({
          channelId: `discord-${message.channelId}`,
          // groupName: guild.name,
          lastActive: Date.now(),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (channelRecord) {
        channelRecord = await channelRecord.update(
          {
          // groupName: guild.name,
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
};
