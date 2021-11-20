import db from '../../models';

import settings from '../../config/settings';

const fetchPriceInfo = async (ctx, io) => {
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
