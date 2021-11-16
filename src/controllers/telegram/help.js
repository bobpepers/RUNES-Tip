/* eslint-disable import/prefer-default-export */
import { Markup } from "telegraf";
import { helpMessage } from '../../messages/telegram';
import settings from '../../config/settings';

export const fetchHelp = async (ctx) => {
  ctx.replyWithHTML(helpMessage(), Markup.inlineKeyboard(
    settings.coin.name === 'Runebase'
      ? [
        [Markup.button.callback('Balance', 'Balance'),
          Markup.button.callback('Price', 'Price')],
        [Markup.button.callback('Exchanges', 'Exchanges'),
          Markup.button.callback('Deposit', 'Deposit')],
        [Markup.button.callback('Referral', 'Referral'),
          Markup.button.callback('Referral Top 10', 'ReferralTop')],
      ]
      : [
        [Markup.button.callback('Balance', 'Balance'),
          Markup.button.callback('Price', 'Price')],
        [Markup.button.callback('Exchanges', 'Exchanges'),
          Markup.button.callback('Deposit', 'Deposit')],
      ],
  ));
};