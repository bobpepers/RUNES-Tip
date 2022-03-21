import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  notEnoughActiveUsersMessage,
  rainSuccessMessage,
  generalErrorMessage,
  groupNotFoundMessage,
} from '../../messages/telegram';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";

export const rainRunesToUsers = async (
  ctx,
  rainAmount,
  bot,
  runesGroup,
  io,
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
      'rain',
    );
    if (!user) return;

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      ctx,
      t,
      rainAmount,
      user,
      setting,
      'rain',
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
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
                  [Op.gte]: new Date(Date.now() - (24 * 60 * 60 * 1000)),
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
      const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
      const amountPerUser = ((amount - Number(fee)) / usersToRain.length).toFixed(0);
      const rainRecord = await db.rain.create({
        feeAmount: fee,
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
        // eslint-disable-next-line no-await-in-loop
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
