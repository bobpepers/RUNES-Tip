import { Transaction } from "sequelize";
import BigNumber from "bignumber.js";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  minimumWithdrawalMessage,
  invalidAmountMessage,
  invalidAddressMessage,
  userNotFoundMessage,
  insufficientBalanceMessage,
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
  if (ctx.update.message.chat.type !== 'private') {
    await ctx.reply("i have sent you a direct message");
  }
  let user;
  let activity;
  // await ctx.telegram.sendMessage(ctx.update.message.from.id, balanceMessage(telegramUserName, user, priceInfo));
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

    console.log('after user find');

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
    console.log('after validate amount');

    // Add new currencies here (default fallback Runebase)
    let isValidAddress = false;
    if (settings.coin.setting === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    } else if (settings.coin.setting === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(withdrawalAddress);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    }
    //
    if (!isValidAddress) {
      ctx.telegram.sendMessage(ctx.update.message.from.id, invalidAddressMessage());
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
    ctx.telegram.sendMessage(ctx.update.message.from.id, withdrawalReviewMessage());

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(generalErrorMessage());
  });
};
