import { Transaction } from "sequelize";
import db from '../../models';
import {
  userNotFoundMessage,
  unableToFindUserMessage,
  tipSuccessMessage,
  generalErrorMessage,
} from '../../messages/telegram';
import getCoinSettings from '../../config/settings';
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";

import logger from "../../helpers/logger";

const settings = getCoinSettings();

export const tipRunesToUser = async (
  ctx,
  tipTo,
  tipAmount,
  bot,
  runesGroup,
  io,
  groupTask,
  setting,
) => {
  let user;
  let activity;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      activity,
    ] = await userWalletExist(
      ctx,
      t,
      'tip',
    );
    if (!user) return;

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      ctx,
      t,
      tipAmount,
      user,
      setting,
      'tip',
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
      return;
    }

    const userToTip = tipTo.substring(1);
    const findUserToTip = await db.user.findOne({
      where: {
        username: userToTip,
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
    if (!findUserToTip) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      ctx.reply(unableToFindUserMessage());
      return;
    }

    const wallet = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const userTipAmount = (amount - Number(fee));

    const updatedFindUserToTip = findUserToTip.wallet.update({
      available: findUserToTip.wallet.available + userTipAmount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const tipTransaction = await db.tip.create({
      feeAmount: Number(fee),
      userId: user.id,
      amount,
      type: 'split',
      userCount: 1,
      groupId: groupTask.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const tiptipTransaction = await db.tiptip.create({
      userId: findUserToTip.id,
      tipId: tipTransaction.id,
      amount: Number(userTipAmount),
      groupId: groupTask.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    activity = await db.activity.create({
      amount,
      type: 'tip_s',
      earnerId: findUserToTip.id,
      spenderId: user.id,
      earner_balance: updatedFindUserToTip.available + updatedFindUserToTip.locked,
      spender_balance: wallet.available + wallet.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    ctx.reply(tipSuccessMessage(user, amount, findUserToTip));
    logger.info(`Success tip Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} to ${findUserToTip.username} with ${amount / 1e8} ${settings.coin.ticker}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(generalErrorMessage());
  });
  if (activity) {
    activity = await db.activity.findOne({
      where: {
        id: activity.id,
      },
      include: [
        {
          model: db.user,
          as: 'earner',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
    });
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
