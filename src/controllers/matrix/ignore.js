/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  ignoreMeMessage,
  unIngoreMeMessage,
  errorMessage,
  walletNotFoundMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";

export const setIgnoreMe = async (
  matrixClient,
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
      matrixClient,
      message,
      t,
      'ignoreme',
    );
    if (userActivity) {
      activity.unshift(userActivity);
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Ignore me',
        ),
      );
    }
    if (!user) return;

    if (user.ignoreMe) {
      await user.update({
        ignoreMe: false,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        unIngoreMeMessage(
          message,
        ),
      );
    } else if (!user.ignoreMe) {
      await user.update({
        ignoreMe: true,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        ignoreMeMessage(
          message,
        ),
      );
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
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
