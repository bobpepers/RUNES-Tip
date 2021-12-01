import { Transaction } from "sequelize";
import BigNumber from "bignumber.js";
import db from '../../models';
import {
  invalidAmountMessage,
  userNotFoundMessage,
  unableToFindUserMessage,
  insufficientBalanceMessage,
  minimumTipMessage,
  tipSuccessMessage,
  generalErrorMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const tipRunesToUser = async (ctx, tipTo, tipAmount, bot, runesGroup, io, groupTask) => {
  let activity;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!user) {
      activity = await db.activity.create({
        type: 'tip_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      ctx.reply(userNotFoundMessage());
      return;
    }
    const amount = new BigNumber(tipAmount).times(1e8).toNumber();
    if (amount < Number(settings.min.telegram.tip)) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      ctx.reply(minimumTipMessage());
      return;
    }
    if (amount % 1 !== 0) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      ctx.reply(invalidAmountMessage());
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

    if (amount >= Number(settings.min.telegram.tip) && amount % 1 === 0 && findUserToTip) {
      if (user) {
        if (amount > user.wallet.available) {
          activity = await db.activity.create({
            type: 'tip_i',
            spenderId: user.id,
            amount,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          ctx.reply(insufficientBalanceMessage());
        }
        if (amount <= user.wallet.available) {
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const updatedFindUserToTip = findUserToTip.wallet.update({
            available: findUserToTip.wallet.available + amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          const tipTransaction = await db.tip.create({
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
            amount,
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
        }
      }
    }
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
