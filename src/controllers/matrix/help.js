/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  errorMessage,
  warnDirectMessage,
  helpMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";

export const matrixHelp = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const withdraw = await db.features.findOne(
      {
        where: {
          type: 'global',
          name: 'withdraw',
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      },
    );

    if (message.sender.roomId === userDirectMessageRoomId) {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        helpMessage(),
      );
    } else {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        helpMessage(),
      );
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        warnDirectMessage(message.sender.name, 'Help'),
      );
    }

    const user = await db.user.findOne({
      where: {
        user_id: `matrix-${message.sender.userId}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user) {
      return;
    }

    const preActivity = await db.activity.create({
      type: 'help_s',
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
        type: 'help',
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
          'Help',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });

  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
