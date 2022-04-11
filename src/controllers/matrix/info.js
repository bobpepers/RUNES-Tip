/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  errorMessage,
  coinInfoMessage,
  warnDirectMessage,
  walletNotFoundMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";
import { getInstance } from '../../services/rclient';

export const matrixCoinInfo = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
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
      'info',
    );
    if (userActivity) {
      activity.unshift(userActivity);
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Info',
        ),
      );
    }
    if (!user) return;

    const walletInfo = await getInstance().getWalletInfo();

    const blockHeight = await db.block.findOne({
      order: [['id', 'DESC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const priceInfo = await db.currency.findOne({
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (message.sender.roomId === userDirectMessageRoomId) {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        coinInfoMessage(
          blockHeight.id,
          priceInfo,
          walletInfo.walletversion,
        ),
      );
    } else {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        coinInfoMessage(
          blockHeight.id,
          priceInfo,
          walletInfo.walletversion,
        ),
      );
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        warnDirectMessage(
          message.sender.name,
          'Info',
        ),
      );
    }

    const preActivity = await db.activity.create({
      type: 'info_s',
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
        type: 'info',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`info error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Info',
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
