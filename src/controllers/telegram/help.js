/* eslint-disable import/prefer-default-export */
import { helpMessage } from '../../messages/telegram';

require('dotenv').config();

const { Markup } = require('telegraf');

export const fetchHelp = async (ctx) => {
  ctx.replyWithHTML(helpMessage(), Markup.inlineKeyboard(
    process.env.CURRENCY_NAME === 'Runebase'
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
