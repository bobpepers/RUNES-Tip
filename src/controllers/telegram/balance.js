import { Transaction } from "sequelize";
import db from '../../models';
import {
  balanceMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const fetchWalletBalance = async (ctx, telegramUserId, telegramUserName) => {
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

    const priceInfo = await db.priceInfo.findOne({
      where: {
        currency: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      ctx.reply(`Wallet not found`);
    }

    if (user && user.wallet) {
      await ctx.reply(balanceMessage(telegramUserName, user, priceInfo));
    }

    t.afterCommit(() => {
      logger.info(`Success Balance Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    logger.error(`Error Balance Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};
