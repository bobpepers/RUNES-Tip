import BigNumber from "bignumber.js";
import db from '../../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
} from '../../../messages/telegram';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

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
  const capType = capitalize(type);

  if (!preAmount) {
    activity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await ctx.replyWithHTML(
      await invalidAmountMessage(),
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
    activity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await ctx.replyWithHTML(
      await minimumMessage(setting, capitalize(type)),
    );
    return [
      activity,
      amount,
    ];
  }
  if (amount % 1 !== 0) {
    activity = await db.activity.create({
      type: `${type}_f`,
      spenderId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await ctx.replyWithHTML(
      await invalidAmountMessage(),
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
      await invalidAmountMessage(),
    );
    return [
      activity,
      amount,
    ];
  }

  if (user.wallet.available < amount) {
    activity = await db.activity.create({
      type: `${type}_i`,
      spenderId: user.id,
      amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    await ctx.replyWithHTML(
      await insufficientBalanceMessage(capType),
    );
    return [
      activity,
      amount,
    ];
  }
  console.log(`amount: ${amount}`);
  return [
    activity,
    amount,
  ];
};
