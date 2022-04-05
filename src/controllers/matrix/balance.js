import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  balanceMessage,
  walletNotFoundMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";

export const matrixBalance = async (
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
      'balance',
    );
    if (userActivity) {
      activity.unshift(userActivity);
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Balance',
        ),
      );
    }
    if (!user) return;

    const priceInfo = await db.currency.findOne({
      where: {
        iso: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const userId = user.user_id.replace('matrix-', '');

    if (isCurrentRoomDirectMessage) {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        balanceMessage(
          userId,
          user,
          priceInfo,
        ),
      );
    } else {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        balanceMessage(
          userId,
          user,
          priceInfo,
        ),
      );
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        warnDirectMessage(message.sender.name, 'Help'),
      );
    }

    const createActivity = await db.activity.create({
      type: 'balance_s',
      earnerId: user.id,
      earner_balance: user.wallet.available + user.wallet.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const findActivity = await db.activity.findOne({
      where: {
        id: createActivity.id,
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
    activity.unshift(findActivity);

    t.afterCommit(() => {
      console.log('done balance request');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'balance',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    logger.error(`Error Matrix Balance Requested by: ${err}`);
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
