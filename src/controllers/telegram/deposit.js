import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  depositAddressMessage,
  depositAddressNotFoundMessage,
  errorMessage,
} from '../../messages/telegram';

import logger from "../../helpers/logger";

export const fetchWalletDepositAddress = async (
  ctx,
  telegramUserId,
  telegramUserName,
  io,
) => {
  const activity = [];
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
      await ctx.reply(depositAddressNotFoundMessage());
    }

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      await ctx.replyWithPhoto({
        source: Buffer.from(depositQrFixed, 'base64'),
      }, {
        caption: await depositAddressMessage(
          user,
        ),
        parse_mode: 'HTML',
      });

      await ctx.reply(
        await depositAddressMessage(
          user,
        ),
        {
          parse_mode: 'HTML',
        },
      );

      const preActivity = await db.activity.create({
        type: 'deposit',
        earnerId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const finalActivity = await db.activity.findOne({
        where: {
          id: preActivity.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(finalActivity);
    }

    t.afterCommit(() => {
      console.log('telegram deposit address request done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'deposit',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`deposit error: ${err}`);
    try {
      await ctx.replyWithHTML(
        errorMessage(
          'Deposit',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
