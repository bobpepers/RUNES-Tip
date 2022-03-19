/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ignoreMeMessage,
  unIngoreMeMessage,
  errorMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";

export const setIgnoreMe = async (
  matrixClient,
  message,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `matrix-${message.sender.userId}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      const activityA = await db.activity.create({
        type: 'ignoreme_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityA);
      // await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Ignore me')] });
      return;
    }
    if (user.ignoreMe) {
      await user.update({
        ignoreMe: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          unIngoreMeMessage(
            message,
          ),
        );
      } catch (err) {
        console.log(err);
      }
      // message.channel.send({ embeds: [unIngoreMeMessage(message)] });
      return;
    }
    if (!user.ignoreMe) {
      await user.update({
        ignoreMe: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          ignoreMeMessage(
            message,
          ),
        );
      } catch (err) {
        console.log(err);
      }
      // message.channel.send({ embeds: [ignoreMeMessage(message)] });
      return;
    }
    const preActivity = await db.activity.create({
      type: 'ignoreme_s',
      earnerId: user.id,
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
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`ignoreme error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Ignore me',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
