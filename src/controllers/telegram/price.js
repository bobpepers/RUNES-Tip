import db from '../../models';

require('dotenv').config();
const { Sequelize, Transaction, Op } = require('sequelize');

const fetchPriceInfo = async (ctx) => {
  try {
    const priceRecord = await db.priceInfo.findAll({});
    let replyString = `<b><u>${process.env.CURRENCY_SYMBOL} PRICE</u></b>\n`;
    replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
    ctx.replyWithHTML(replyString);
  } catch (error) {
    console.log(error);
  }
};

export default fetchPriceInfo;
