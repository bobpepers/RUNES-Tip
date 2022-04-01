import { Transaction } from "sequelize";
import {
  priceMessage,
  walletNotFoundMessage,
  errorMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";

export const matrixPrice = async (
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

    if (!user && !user.wallet) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Tip',
        ),
      );
    }

    if (user && user.wallet) {
      const priceRecord = await db.currency.findAll({});
      let replyString = ``;
      replyString += priceRecord.map((a) => `${a.iso}: ${a.price}`).join('\n');
      let replyStringHtml = ``;
      replyStringHtml += priceRecord.map((a) => `${a.iso}: ${a.price}`).join('<br>');

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        priceMessage(
          replyString,
          replyStringHtml,
        ),
      );

      const createActivity = await db.activity.create({
        type: 'price',
        earnerId: user.id,
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
      console.log('done price request');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'price',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    logger.error(`Error Matrix Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Price',
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
