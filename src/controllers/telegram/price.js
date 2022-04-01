import { Transaction } from "sequelize";
import db from '../../models';
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import getCoinSettings from '../../config/settings';
import logger from "../../helpers/logger";
import {
  priceMessage,
  errorMessage,
} from '../../messages/telegram';

const settings = getCoinSettings();

export const telegramPrice = async (
  ctx,
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
      ctx,
      t,
      'price',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const priceRecord = await db.currency.findAll({
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const createActivity = await db.activity.create({
      type: 'price',
      earnerId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const fetchActivity = await db.activity.findOne({
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
    activity.unshift(fetchActivity);

    await ctx.replyWithHTML(
      await priceMessage(
        priceRecord,
      ),
      // replyString,
    );
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'price',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`price error: ${err}`);
    try {
      await ctx.replyWithHTML(
        await errorMessage(
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
