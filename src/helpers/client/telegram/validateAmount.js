import BigNumber from "bignumber.js";
import db from '../../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
} from '../../../messages/telegram';

export const validateAmount = async (
  ctx,
  t,
  preAmount,
  user,
  setting,
  type,
  tipType = null,
  usersToTip = null,
) => {
  let activity;
  let amount = 0;

  if (!preAmount) {
    const noPreAmountActivity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.findOne({
      where: {
        id: noPreAmountActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    await ctx.replyWithHTML(
      await invalidAmountMessage(
        type,
      ),
    );
    return [
      activity,
      amount,
    ];
  }

  if (preAmount.toLowerCase() === 'all') {
    amount = user.wallet.available;
  } else {
    amount = new BigNumber(preAmount).times(1e8).toNumber();
  }

  if (amount < Number(setting.min)) {
    const minAmountActivity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
      spender_balance: user.wallet.available,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.findOne({
      where: {
        id: minAmountActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    await ctx.replyWithHTML(
      await minimumMessage(
        setting,
        type,
      ),
    );
    return [
      activity,
      amount,
    ];
  }

  if (
    tipType === 'each'
    && preAmount.toLowerCase() !== 'all' // Perhaps remove preAmount.toLowerCase() !== 'all and make tip amount invalidate when casting "all" and "each" instead of splitting up all available balance
  ) {
    amount *= usersToTip.length;
  }

  if (amount % 1 !== 0) {
    const invalidAmountActivity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
      spender_balance: user.wallet.available,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.findOne({
      where: {
        id: invalidAmountActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    await ctx.replyWithHTML(
      await invalidAmountMessage(
        type,
      ),
    );
    return [
      activity,
      amount,
    ];
  }

  if (amount <= 0) {
    activity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await ctx.replyWithHTML(
      await invalidAmountMessage(
        type,
      ),
    );
    return [
      activity,
      amount,
    ];
  }

  if (user.wallet.available < amount) {
    const insufActivity = await db.activity.create({
      type: `${type}_i`,
      spenderId: user.id,
      spender_balance: user.wallet.available,
      amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.findOne({
      where: {
        id: insufActivity.id,
      },
      include: [
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    await ctx.replyWithHTML(
      await insufficientBalanceMessage(
        type,
      ),
    );
    return [
      activity,
      amount,
    ];
  }
  return [
    activity,
    amount,
  ];
};
