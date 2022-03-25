/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import logger from "../../helpers/logger";

export const updateDiscordGroup = async (
  client,
  message,
) => {
  let group;
  let guildId;

  if (message.guild && message.guild.id) {
    guildId = message.guild.id;
  } else if (message.guildId) {
    guildId = message.guildId;
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (guildId) {
      const guild = await client.guilds.cache.get(guildId);
      // console.log(guild);
      group = await db.group.findOne(
        {
          where: {
            groupId: `discord-${guildId}`,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      if (!group) {
        group = await db.group.create({
          groupId: `discord-${guildId}`,
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
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'group',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`channel error: ${err}`);
    console.log(err.message);
  });
  return group;
};
