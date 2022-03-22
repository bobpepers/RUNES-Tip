/* eslint-disable import/prefer-default-export */
import { InfoMessage } from '../../messages/telegram';
import db from '../../models';

export const fetchInfo = async (ctx) => {
  const blockHeight = await db.block.findOne({
    order: [['id', 'DESC']],
  });
  const priceInfo = await db.priceInfo.findOne({
    order: [['id', 'ASC']],
  });
  ctx.replyWithHTML(
    InfoMessage(
      blockHeight.id,
      priceInfo,
    ),
  );
};
