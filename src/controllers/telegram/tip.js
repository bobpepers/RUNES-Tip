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
  somethingWentWrongMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const tipRunesToUser = async (ctx, tipTo, tipAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(tipAmount).times(1e8).toNumber();
    if (amount < Number(settings.min.telegram.tip)) {
      ctx.reply(minimumTipMessage());
    }
    if (amount % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
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
      ctx.reply(unableToFindUserMessage());
    }

    if (amount >= Number(settings.min.telegram.tip) && amount % 1 === 0 && findUserToTip) {
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
        ctx.reply(userNotFoundMessage());
      }
      if (user) {
        if (amount > user.wallet.available) {
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
            userTippedId: findUserToTip.id,
            amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
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
    ctx.reply(somethingWentWrongMessage());
  });
};
