/* eslint-disable import/prefer-default-export */
import { Markup } from "telegraf";
import { helpMessage } from '../../messages/telegram';
import settings from '../../config/settings';
import db from '../../models';

export const fetchHelp = async (ctx, io) => {
  if (ctx.update.message.chat.type !== 'private') {
    await ctx.reply("i have sent you a direct message");
  }
  const withdraw = await db.features.findOne(
    {
      where: {
        type: 'global',
        name: 'withdraw',
      },
    },
  );

  ctx.telegram.sendMessage(
    ctx.update.message.from.id,
    helpMessage(withdraw),
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
  let activity;
  const user = await db.user.findOne({
    where: {
      user_id: `telegram-${ctx.update.message.from.id}`,
    },
  });

  if (!user) {
    return;
  }

  activity = await db.activity.create({
    type: 'help',
    earnerId: user.id,
  });

  activity = await db.activity.findOne({
    where: {
      id: activity.id,
    },
    include: [
      {
        model: db.user,
        as: 'earner',
      },
    ],
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
