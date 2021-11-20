import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  depositAddressMessage,
  depositAddressNotFoundMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const fetchWalletDepositAddress = async (ctx, telegramUserId, telegramUserName, io) => {
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

    if (!user && !user.wallet && !user.wallet.addresses) {
      ctx.reply(depositAddressNotFoundMessage());
    }

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      await ctx.replyWithPhoto({
        source: Buffer.from(depositQrFixed, 'base64'),
      }, {
        caption: depositAddressMessage(telegramUserName, user),
        parse_mode: 'MarkdownV2',
      });

      await ctx.reply(
        depositAddressMessage(telegramUserName, user),
        { parse_mode: 'MarkdownV2' },
      );
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};
