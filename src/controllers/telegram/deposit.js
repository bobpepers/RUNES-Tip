import { Transaction } from "sequelize";
import QRCode from "qrcode";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import db from '../../models';
import {
  depositAddressMessage,
  depositAddressNotFoundMessage,
  warnDirectMessage,
  errorMessage,
} from '../../messages/telegram';

import logger from "../../helpers/logger";

export const fetchWalletDepositAddress = async (
  ctx,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      ctx,
      t,
      'deposit',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    if (!user && !user.wallet && !user.wallet.addresses) {
      await ctx.replyWithHTML(
        await depositAddressNotFoundMessage(),
      );
      return;
    }

    const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
    const depositQrFixed = depositQr.replace('data:image/png;base64,', '');

    const userId = user.user_id.replace('telegram-', '');

    await ctx.telegram.sendPhoto(
      userId,
      {
        source: Buffer.from(depositQrFixed, 'base64'),
      },
      {
        caption: await depositAddressMessage(
          user,
        ),
        parse_mode: 'HTML',
      },
    );

    await ctx.telegram.sendMessage(
      userId,
      await depositAddressMessage(
        user,
      ),
      {
        parse_mode: 'HTML',
      },
    );

    if (
      ctx.update
      && ctx.update.message
      && ctx.update.message.chat
      && ctx.update.message.chat.type
      && ctx.update.message.chat.type !== 'private'
    ) {
      await ctx.replyWithHTML(
        await warnDirectMessage(
          user,
        ),
      );
    }

    const preActivity = await db.activity.create({
      type: 'deposit_s',
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
        await errorMessage(
          'Deposit',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
