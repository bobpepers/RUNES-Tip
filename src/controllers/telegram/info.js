/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  InfoMessage,
  errorMessage,
} from '../../messages/telegram';
import db from '../../models';
import logger from "../../helpers/logger";

export const fetchInfo = async (
  ctx,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const blockHeight = await db.block.findOne({
      order: [['id', 'DESC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const priceInfo = await db.priceInfo.findOne({
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const user = await db.user.findOne({
      where: {
        user_id: `discord-${ctx.update.message.from.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const preActivity = await db.activity.create({
      type: 'info',
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
    await ctx.replyWithHTML(
      await InfoMessage(
        blockHeight.id,
        priceInfo,
      ),
    );

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
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`info error: ${err}`);
    try {
      await ctx.replyWithHTML(errorMessage(
        'Info',
      ));
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
