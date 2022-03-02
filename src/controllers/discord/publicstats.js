/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  disablePublicStatsMessage,
  enablePublicStatsMeMessage,
  walletNotFoundMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";

export const discordPublicStats = async (
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      const activityA = await db.activity.create({
        type: 'publicstats_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityA);
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Ignore me')] });
      return;
    }

    if (user.publicStats) {
      await user.update({
        publicStats: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [disablePublicStatsMessage(message)] });
    } else if (!user.publicStats) {
      await user.update({
        publicStats: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [enablePublicStatsMeMessage(message)] });
    }

    const preActivity = await db.activity.create({
      type: 'publicstats_s',
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

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'publicStats',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`publicstats error: ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("PublicStats")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
