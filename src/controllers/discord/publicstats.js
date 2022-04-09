/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  disablePublicStatsMessage,
  enablePublicStatsMeMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const discordPublicStats = async (
  message,
  io,
) => {
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
      'publicstats',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    if (user.publicStats) {
      await user.update({
        publicStats: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({
        embeds: [
          disablePublicStatsMessage(
            message,
          ),
        ],
      });
    } else if (!user.publicStats) {
      await user.update({
        publicStats: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({
        embeds: [
          enablePublicStatsMeMessage(
            message,
          ),
        ],
      });
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
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "PublicStats",
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
