import { Transaction, Op } from "sequelize";
import BigNumber from "bignumber.js";
import db from '../../models';
import {
  invalidAmountMessage,
  userNotFoundMessage,
  insufficientBalanceMessage,
  notEnoughActiveUsersMessage,
  minimumRainMessage,
  rainSuccessMessage,
  generalErrorMessage,
  groupNotFoundMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const rainRunesToUsers = async (ctx, rainAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(rainAmount).times(1e8).toNumber();

    if (Number(amount) < Number(settings.min.telegram.rain)) {
      ctx.reply(minimumRainMessage());
      return;
    }
    if (Number(amount) % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
      return;
    }

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
      return;
    }

    if (user.wallet.available < amount) {
      ctx.reply(insufficientBalanceMessage());
      return;
    }
    if (user.wallet.available >= amount) {
      const group = await db.group.findOne({
        where: {
          groupId: `telegram-${ctx.update.message.chat.id}`,
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!group) {
        await ctx.reply(groupNotFoundMessage());
        return;
      }

      const usersToRain = await db.user.findAll({
        where: {
          [Op.and]: [
            {
              user_id: { [Op.not]: `telegram-${ctx.update.message.from.id}` },
            },
          ],
        },
        include: [
          {
            model: db.active,
            as: 'active',
            // required: false,
            where: {
              [Op.and]: [
                {
                  lastSeen: {
                    [Op.gte]: new Date(Date.now() - (3 * 60 * 60 * 1000)),
                  },
                },
                {
                  groupId: group.id,
                },
              ],
            },
          },
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (usersToRain.length < 2) {
        ctx.reply(notEnoughActiveUsersMessage());
        return;
      }
      if (usersToRain.length >= 2) {
        const updatedBalance = await user.wallet.update({
          available: user.wallet.available - amount,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        const amountPerUser = (((amount / usersToRain.length).toFixed(0)));
        const rainRecord = await db.rain.create({
          amount,
          userCount: usersToRain.length,
          userId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        const listOfUsersRained = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const rainee of usersToRain) {
          // eslint-disable-next-line no-await-in-loop
          await rainee.wallet.update({
            available: rainee.wallet.available + Number(amountPerUser),
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          // eslint-disable-next-line no-await-in-loop
          await db.raintip.create({
            amount: amountPerUser,
            userId: rainee.id,
            rainId: rainRecord.id,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          listOfUsersRained.push(`@${rainee.username}`);
        }

        await ctx.reply(rainSuccessMessage(amount, usersToRain, amountPerUser));

        const newStringListUsers = listOfUsersRained.join(", ");
        const cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g);
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cutStringListUsers) {
          // eslint-disable-next-line no-await-in-loop
          await ctx.reply(element);
        }
        logger.info(`Success Rain Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} for ${amount / 1e8}`);
        // cutStringListUsers.forEach((element) => ctx.reply(element));
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(generalErrorMessage());
  });
};
