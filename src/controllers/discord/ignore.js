/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ignoreMeMessage,
  unIngoreMeMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const setIgnoreMe = async (message, io) => {
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
      'ignoreme',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;
    const userId = user.user_id.replace('discord-', '');

    if (user.ignoreMe) {
      await user.update({
        ignoreMe: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({
        embeds: [
          unIngoreMeMessage(
            userId,
          ),
        ],
      });
    } else if (!user.ignoreMe) {
      await user.update({
        ignoreMe: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({
        embeds: [
          ignoreMeMessage(
            userId,
          ),
        ],
      });
    }
    const preActivity = await db.activity.create({
      type: 'ignoreme_s',
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
        type: 'ignoreme',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`ignoreme error: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Ignore me",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            "Ignore me",
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
