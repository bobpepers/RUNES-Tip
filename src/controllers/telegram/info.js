/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  InfoMessage,
  errorMessage,
  unableToDirectMessageErrorMessage,
} from '../../messages/telegram';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import { getInstance } from '../../services/rclient';

export const fetchInfo = async (
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
      'info',
    );
    if (userActivity) {
      activity.unshift(userActivity);
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

    await ctx.replyWithHTML(
      await InfoMessage(
        blockHeight.id,
        priceInfo,
        walletInfo.walletversion,
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
    if (
      err
      && err.response
      && err.response.error_code
      && err.response.error_code === 403
    ) {
      try {
        await ctx.replyWithHTML(
          await unableToDirectMessageErrorMessage(
            ctx,
            'Info',
          ),
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await ctx.replyWithHTML(
          await errorMessage(
            'Info',
          ),
        );
      } catch (err) {
        console.log(err);
      }
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
