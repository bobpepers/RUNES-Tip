import { Transaction } from "sequelize";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  invalidAddressMessage,
  errorMessage,
  withdrawalReviewMessage,
  warnDirectMessage,
} from '../../messages/telegram';
import getCoinSettings from '../../config/settings';
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";

import logger from "../../helpers/logger";

const settings = getCoinSettings();

export const withdrawTelegramCreate = async (
  ctx,
  withdrawalAddress,
  withdrawalAmount,
  io,
  setting,
) => {
  let user;
  let userActivity;
  let activity = [];
  let isValidAddress = false;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      userActivity,
    ] = await userWalletExist(
      ctx,
      t,
      'withdraw',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      ctx,
      t,
      withdrawalAmount,
      user,
      setting,
      'withdraw',
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    // Add new currencies here (default fallback Runebase)

    if (settings.coin.setting === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    } else if (settings.coin.setting === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(withdrawalAddress);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    }
    //
    if (!isValidAddress) {
      await ctx.telegram.sendMessage(
        ctx.update.message.from.id,
        await invalidAddressMessage(),
      );
      return;
    }

    const wallet = await user.wallet.update({
      available: user.wallet.available - amount,
      locked: user.wallet.locked + amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const transaction = await db.transaction.create({
      addressId: wallet.addresses[0].id,
      phase: 'review',
      type: 'send',
      to_from: withdrawalAddress,
      amount,
      feeAmount: Number(fee),
      userId: user.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    activity = await db.activity.create(
      {
        spenderId: user.id,
        type: 'withdrawRequested',
        amount,
        transactionId: transaction.id,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    await ctx.telegram.sendMessage(
      ctx.update.message.from.id,
      await withdrawalReviewMessage(),
    );

    if (ctx.update.message.chat.type !== 'private') {
      await ctx.replyWithHTML(
        await warnDirectMessage(
          user,
        ),
      );
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'withdraw',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`withdraw error: ${err}`);
    try {
      await ctx.replyWithHTML(errorMessage(
        'Withdraw',
      ));
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
