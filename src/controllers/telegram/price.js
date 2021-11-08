import db from '../../models';

require('dotenv').config();
const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
const fetchPriceInfo = async (ctx) => {
  try {
    const priceRecord = await db.priceInfo.findAll({});
    console.log(priceRecord);
    // res.locals.price = priceRecord;
    // next();
    let replyString = `<b><u>${process.env.CURRENCY_SYMBOL} PRICE</u></b>\n`;
    replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
    ctx.replyWithHTML(replyString);
  } catch (error) {
    console.log(error);
  }
};

export default fetchPriceInfo;
