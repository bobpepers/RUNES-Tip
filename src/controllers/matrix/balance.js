import { Transaction } from "sequelize";
import {
  warnDirectMessage,
  balanceMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";

export const matrixBalance = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
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
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const priceInfo = await db.currency.findOne({
      where: {
        iso: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      // ctx.reply(`Wallet not found`);
      // await message.author.send("Wallet not found");
      // add message for matrix
      return;
    }

    if (user && user.wallet) {
      const userId = user.user_id.replace('matrix-', '');

      if (message.sender.roomId === userDirectMessageRoomId) {
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
    }
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
