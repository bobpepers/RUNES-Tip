/* eslint-disable import/prefer-default-export */
import { exchangeListMessage } from '../../messages/telegram';

export const fetchExchangeList = async (ctx) => {
  ctx.replyWithHTML(exchangeListMessage());
};
