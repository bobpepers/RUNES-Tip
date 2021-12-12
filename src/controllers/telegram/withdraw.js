import { Transaction } from "sequelize";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  invalidAddressMessage,
  generalErrorMessage,
  withdrawalReviewMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';
import { validateAmount } from "../../helpers/telegram/validateAmount";
import { userWalletExist } from "../../helpers/telegram/userWalletExist";

import logger from "../../helpers/logger";

export const withdrawTelegramCreate = async (
  ctx,
  withdrawalAddress,
  withdrawalAmount,
  io,
  setting,
) => {
  logger.info(`Start Withdrawal Request: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);

  let user;
  let activity;
  let isValidAddress = false;
  let complete = false;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      activity,
    ] = await userWalletExist(
      ctx,
      t,
      'withdraw',
    );
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
      activity = activityValiateAmount;
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

    t.afterCommit(() => {
      complete = true;
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(generalErrorMessage());
  });
  if (ctx.update.message.chat.type !== 'private' && complete) {
    await ctx.reply("i have sent you a direct message");
  }
  if (!isValidAddress) {
    ctx.telegram.sendMessage(ctx.update.message.from.id, invalidAddressMessage());
    return;
  }
  ctx.telegram.sendMessage(ctx.update.message.from.id, withdrawalReviewMessage());
};
