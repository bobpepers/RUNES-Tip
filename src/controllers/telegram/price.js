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
    type: 'price',
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

export default fetchPriceInfo;
