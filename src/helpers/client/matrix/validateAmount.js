import BigNumber from "bignumber.js";
import db from '../../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
} from '../../../messages/matrix';

export const validateAmount = async (
  matrixClient,
  message,
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
      spender_balance: user.wallet.available,
      failedAmount: 'No Amount Specified',
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

    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      invalidAmountMessage(
        message,
        type,
      ),
    );
    return [
      false,
      activity,
      amount,
    ];
  }

  if (preAmount.toLowerCase() === 'all') {
    amount = user.wallet.available;
  } else {
    amount = new BigNumber(preAmount).times(1e8).toNumber();
  }

  if (amount < setting.min) {
    const minAmountActivity = await db.activity.create({
      type: `${type}_f`,
      failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
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

    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      minimumMessage(
        message,
        setting,
        type,
      ),
    );
    return [
      false,
      activity,
      amount,
    ];
  }

  if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
    amount *= usersToTip.length;
  }

  if (amount % 1 !== 0) {
    const invalidAmountActivity = await db.activity.create({
      type: `${type}_f`,
      failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
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

    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      invalidAmountMessage(
        message,
        type,
      ),
    );
    return [
      false,
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
    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      invalidAmountMessage(
        message,
        type,
      ),
    );
    return [
      false,
      activity,
      amount,
    ];
  }

  if (user.wallet.available < amount) {
    const insufActivity = await db.activity.create({
      type: `${type}_i`,
      spenderId: user.id,
      spender_balance: user.wallet.available,
      failedAmount: preAmount.toString().length < 4000 ? preAmount.toString() : 'out of range',
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

    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      insufficientBalanceMessage(
        message,
        type,
      ),
    );
    return [
      false,
      activity,
      amount,
    ];
  }

  return [
    true,
    activity,
    amount,
  ];
};
