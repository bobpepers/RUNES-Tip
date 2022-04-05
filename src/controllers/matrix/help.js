/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  errorMessage,
  warnDirectMessage,
  helpMessage,
  walletNotFoundMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";

export const matrixHelp = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
  isCurrentRoomDirectMessage,
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
      matrixClient,
      message,
      t,
      'help',
    );
    if (userActivity) {
      activity.unshift(userActivity);
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Help',
        ),
      );
    }
    if (!user) return;

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

    if (isCurrentRoomDirectMessage) {
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
