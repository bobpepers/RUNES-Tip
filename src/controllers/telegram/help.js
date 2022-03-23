/* eslint-disable import/prefer-default-export */
import { Markup } from "telegraf";
import { Transaction } from "sequelize";
import {
  helpMessage,
  warnDirectMessage,
  errorMessage,
} from '../../messages/telegram';
import getCoinSettings from '../../config/settings';
import db from '../../models';
import logger from "../../helpers/logger";

const settings = getCoinSettings();

export const fetchHelp = async (
  ctx,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const withdraw = await db.features.findOne(
      {
        where: {
          type: 'global',
          name: 'withdraw',
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      },
    );

    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user) {
      return;
    }

    await ctx.telegram.sendMessage(
      ctx.update.message.from.id,
      await helpMessage(
        withdraw,
      ),
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
          settings.coin.setting === 'Runebase'
            ? [
              [Markup.button.callback('Balance', 'Balance'),
                Markup.button.callback('Price', 'Price')],
              [Markup.button.callback('Info', 'Info'),
                Markup.button.callback('Deposit', 'Deposit')],
              [Markup.button.callback('Referral', 'Referral'),
                Markup.button.callback('Referral Top 10', 'ReferralTop')],
            ]
            : [
              [Markup.button.callback('Balance', 'Balance'),
                Markup.button.callback('Price', 'Price')],
              [Markup.button.callback('Info', 'Info'),
                Markup.button.callback('Deposit', 'Deposit')],
            ],
        ),
      },
    );

    if (ctx.update.message.chat.type !== 'private') {
      await ctx.replyWithHTML(
        await warnDirectMessage(
          user,
        ),
      );
    }

    const activityCreateFinish = await db.activity.create({
      type: 'help',
      earnerId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const activityFinish = await db.activity.findOne({
      where: {
        id: activityCreateFinish.id,
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

    activity.unshift(activityFinish);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'help',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`help error: ${err}`);
    try {
      await ctx.replyWithHTML(errorMessage(
        'Help',
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
