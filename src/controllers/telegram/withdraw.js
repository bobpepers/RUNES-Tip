/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import {
  nodeIsOfflineMessage,
  invalidAddressMessage,
  warnDirectMessage,
  errorMessage,
  reviewMessage,
} from '../../messages/telegram';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import { validateWithdrawalAddress } from '../../helpers/blockchain/validateWithdrawalAddress';

export const withdrawTelegramCreate = async (
  telegramClient,
  telegramApiClient,
  ctx,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
  queue,
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
      filteredMessage[1].toLowerCase(),
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
      filteredMessage[3],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );

    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    const [
      isInvalidAddress,
      isNodeOffline,
      failWithdrawalActivity,
    ] = await validateWithdrawalAddress(
      filteredMessage[2],
      user,
      t,
    );

    if (isNodeOffline) {
      await ctx.telegram.sendMessage(
        ctx.update.message.from.id,
        await nodeIsOfflineMessage(),
        {
          parse_mode: 'HTML',
        },
      );
    }

    if (isInvalidAddress) {
      await ctx.telegram.sendMessage(
        ctx.update.message.from.id,
        await invalidAddressMessage(),
        {
          parse_mode: 'HTML',
        },
      );
    }

    if (isInvalidAddress || isNodeOffline) {
      if (ctx.update.message.chat.type !== 'private') {
        await ctx.replyWithHTML(
          await warnDirectMessage(
            user,
          ),
        );
      }
    }

    if (failWithdrawalActivity) {
      activity.unshift(failWithdrawalActivity);
      return;
    }

    let addressExternal;
    let UserExternalAddressMnMAssociation;

    addressExternal = await db.addressExternal.findOne({
      where: {
        address: filteredMessage[2],
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!addressExternal) {
      addressExternal = await db.addressExternal.create({
        address: filteredMessage[2],
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    UserExternalAddressMnMAssociation = await db.UserAddressExternal.findOne({
      where: {
        addressExternalId: addressExternal.id,
        userId: user.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!UserExternalAddressMnMAssociation) {
      UserExternalAddressMnMAssociation = await db.UserAddressExternal.create({
        addressExternalId: addressExternal.id,
        userId: user.id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
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
      addressExternalId: addressExternal.id,
      phase: 'review',
      type: 'send',
      to_from: filteredMessage[2],
      amount,
      feeAmount: Number(fee),
      userId: user.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const activityCreate = await db.activity.create(
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
    activity.unshift(activityCreate);

    await ctx.telegram.sendMessage(
      ctx.update.message.from.id,
      await reviewMessage(
        user,
        transaction,
      ),
      {
        parse_mode: 'HTML',
      },
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
        type: 'Withdraw',
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
