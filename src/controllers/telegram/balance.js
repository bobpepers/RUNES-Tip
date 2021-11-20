import { Transaction } from "sequelize";
import db from '../../models';
import {
  balanceMessage,
} from '../../messages/telegram';
// import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const fetchWalletBalance = async (ctx, telegramUserId, telegramUserName, io) => {
  console.log(ctx.update.message);
  console.log(ctx.update.message.chat.type);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${telegramUserId}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [
            {
              model: db.address,
              as: 'addresses',
            },
          ],
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user) {
      ctx.reply(`User not found`);
      return;
    }
    if (!user.wallet) {
      ctx.reply(`Wallet not found`);
      return;
    }

    const priceInfo = await db.priceInfo.findOne({
      where: {
        currency: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (ctx.update.message.chat.type !== 'private') {
      await ctx.reply("i have send you a direct message");
    }

    await ctx.telegram.sendMessage(ctx.update.message.from.id, balanceMessage(telegramUserName, user, priceInfo));

    t.afterCommit(() => {
      logger.info(`Success Balance Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    console.log(err);
    logger.error(`Error Balance Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};
