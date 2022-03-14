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

    const priceInfo = await db.priceInfo.findOne({
      where: {
        currency: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      // ctx.reply(`Wallet not found`);
      await message.author.send("Wallet not found");
    }

    if (user && user.wallet) {
      const userId = user.user_id.replace('matrix-', '');

      if (message.sender.roomId === userDirectMessageRoomId) {
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          balanceMessage(userId, user, priceInfo),
        );
      } else {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          warnDirectMessage(message.sender.name, 'Help'),
        );
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          balanceMessage(userId, user, priceInfo),
        );
      }

      const createActivity = await db.activity.create({
        type: 'balance',
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
      // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
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
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
