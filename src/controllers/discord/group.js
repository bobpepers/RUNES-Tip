/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';

export const updateDiscordGroup = async (client, message) => {
  let group;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (message.guildId) {
      const guild = await client.guilds.cache.get(message.guildId);
      // console.log(guild);
      group = await db.group.findOne(
        {
          where: {
            groupId: `discord-${message.guildId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!group) {
        group = await db.group.create({
          groupId: `discord-${message.guildId}`,
          groupName: guild.name,
          lastActive: Date.now(),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (group) {
        group = await group.update(
          {
            groupName: guild.name,
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
      console.log('Update Group transaction done');
    });
  }).catch((err) => {
    console.log(err.message);
  });
  return group;
};
