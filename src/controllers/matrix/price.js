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
      try {
        const priceRecord = await db.priceInfo.findAll({});
        let replyString = ``;
        replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
        let replyStringHtml = ``;
        replyStringHtml += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('<br>');

        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          priceMessage(
            replyString,
            replyStringHtml,
          ),
        );
      } catch (error) {
        console.log(error);
      }

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
      // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
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
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
