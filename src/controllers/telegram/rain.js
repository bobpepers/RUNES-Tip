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
import logger from "../../helpers/logger";

export const rainRunesToUsers = async (ctx, rainAmount, bot, runesGroup, io, setting) => {
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
        type: 'rain_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await ctx.reply(userNotFoundMessage());
      return;
    }
    if (ctx.update.message.chat.id === ctx.update.message.from.id) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      return;
    }
    const amount = new BigNumber(rainAmount)
      .times(1e8)
      .toFixed(0)
      .toString();
    if (Number(amount) < Number(setting.min)) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await ctx.reply(minimumRainMessage(setting));
      return;
    }
    if (Number(amount) % 1 !== 0) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await ctx.reply(invalidAmountMessage());
      return;
    }

    if (user.wallet.available < Number(amount)) {
      activity = await db.activity.create({
        type: 'rain_i',
        spenderId: user.id,
        // amount: Number(amount), // fix this? fails with big numbers
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await ctx.reply(insufficientBalanceMessage());
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
        activity = await db.activity.create({
          type: 'rain_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
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
        activity = await db.activity.create({
          type: 'rain_f',
          spenderId: user.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        await ctx.reply(notEnoughActiveUsersMessage());
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
        activity = await db.activity.create({
          amount,
          type: 'rain_s',
          spenderId: user.id,
          rainId: rainRecord.id,
          spender_balance: updatedBalance.available + updatedBalance.locked,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        activity = await db.activity.findOne({
          where: {
            id: activity.id,
          },
          include: [
            {
              model: db.rain,
              as: 'rain',
            },
            {
              model: db.user,
              as: 'spender',
            },
          ],
          lock: t.LOCK.UPDATE,
          transaction: t,

        });
        const listOfUsersRained = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const rainee of usersToRain) {
          // eslint-disable-next-line no-await-in-loop
          const raineeWallet = await rainee.wallet.update({
            available: rainee.wallet.available + Number(amountPerUser),
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          // eslint-disable-next-line no-await-in-loop
          const raintipRecord = await db.raintip.create({
            amount: amountPerUser,
            userId: rainee.id,
            rainId: rainRecord.id,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          listOfUsersRained.push(`@${rainee.username}`);
          let tipActivity;
          // eslint-disable-next-line no-await-in-loop
          tipActivity = await db.activity.create({
            amount: Number(amountPerUser),
            type: 'raintip_s',
            spenderId: user.id,
            earnerId: rainee.id,
            rainId: rainRecord.id,
            raintipId: raintipRecord.id,
            earner_balance: raineeWallet.available + raineeWallet.locked,
            spender_balance: updatedBalance.available + updatedBalance.locked,
          }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          tipActivity = await db.activity.findOne({
            where: {
              id: tipActivity.id,
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
              {
                model: db.rain,
                as: 'rain',
              },
              {
                model: db.raintip,
                as: 'raintip',
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          // console.log(tipActivity);
          io.to('admin').emit('updateActivity', {
            activity: tipActivity,
          });
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
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
