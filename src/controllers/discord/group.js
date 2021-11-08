/* eslint-disable import/prefer-default-export */
import db from '../../models';

const { Transaction, Op } = require('sequelize');

export const updateDiscordGroup = async (client, message) => {
  console.log(message);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const guild = await client.guilds.cache.get(message.guildId);
    console.log(guild);
    let group = await db.group.findOne(
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

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err.message);
  });
};
