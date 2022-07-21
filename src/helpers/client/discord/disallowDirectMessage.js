import {
  ChannelType,
} from 'discord.js';
import { Transaction } from "sequelize";
import db from '../../../models';
import logger from "../../logger";
import {
  NotInDirectMessage,
  discordErrorMessage,
} from '../../../messages/discord';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const disallowDirectMessage = async (
  message,
  user,
  functionType,
  io,
) => {
  const activity = [];
  let disallow = false;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (message.channel.type === ChannelType.DM) {
      const notDirectActivity = await db.activity.create({
        type: `${functionType}_f`,
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(notDirectActivity);
      await message.channel.send({
        embeds: [
          NotInDirectMessage(
            message,
            capitalize(functionType),
          ),
        ],
      });
      disallow = true;
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: functionType,
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`${functionType} error: ${err}`);
    try {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            capitalize(functionType),
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
  return disallow;
};
