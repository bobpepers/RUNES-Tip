import db from '../../models';

import settings from '../../config/settings';
import { Sequelize, Transaction, Op } from "sequelize";

const fetchPriceInfo = async (ctx) => {
  try {
    const priceRecord = await db.priceInfo.findAll({});
    let replyString = `<b><u>${settings.coin.ticker} PRICE</u></b>\n`;
    replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
    ctx.replyWithHTML(replyString);
  } catch (error) {
    console.log(error);
  }
};

export default fetchPriceInfo;
