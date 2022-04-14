import { Transaction } from "sequelize";
import db from '../../models';
import {
  balanceMessage,
  warnDirectMessage,
  errorMessage,
  unableToDirectMessageErrorMessage,
} from '../../messages/telegram';
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";

import logger from "../../helpers/logger";

export const telegramBalance = async (
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
      'balance',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

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

    const priceInfo = await db.currency.findOne({
      where: {
        iso: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (ctx.update.callback_query) {
      await ctx.telegram.sendMessage(
        ctx.update.callback_query.from.id,
        await balanceMessage(
          user,
          priceInfo,
        ),
        {
          parse_mode: 'HTML',
        },
      );
    } else {
      await ctx.telegram.sendMessage(
        ctx.update.message.from.id,
        await balanceMessage(
          user,
          priceInfo,
        ),
        {
          parse_mode: 'HTML',
        },
      );
    }

    if (
      ctx.update
      && ctx.update.message
      && ctx.update.message.chat
      && ctx.update.message.chat.type
      && ctx.update.message.chat.type !== 'private'
    ) {
      await ctx.replyWithHTML(
        await warnDirectMessage(
          user,
        ),
      );
    }

    t.afterCommit(() => {
      logger.info(`Success Balance Requested`);
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'balance',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`Balance error: ${err}`);
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
            'Balance',
          ),
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await ctx.replyWithHTML(
          await errorMessage(
            'Balance',
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
