import BigNumber from "bignumber.js";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
} from '../../messages/matrix';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

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
  const capType = capitalize(type);
  let amount = 0;

  if (!preAmount) {
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
        capType,
      ),
    );
    // await message.channel.send({ embeds: [invalidAmountMessage(message, capType)] });
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

  if (amount < setting.min) {
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
      minimumMessage(
        message,
        setting,
        capType,
      ),
    );
    // await message.channel.send({ embeds: [minimumMessage(message, setting, capType)] });
    return [
      activity,
      amount,
    ];
  }

  if (tipType === 'each' && preAmount.toLowerCase() !== 'all') {
    amount *= usersToTip.length;
  }

  if (amount % 1 !== 0) {
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
        capType,
      ),
    );
    // await message.channel.send({ embeds: [invalidAmountMessage(message, capType)] });
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
    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      invalidAmountMessage(
        message,
        capType,
      ),
    );
    // await message.channel.send({ embeds: [invalidAmountMessage(message, capType)] });
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
    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      insufficientBalanceMessage(
        message,
        capType,
      ),
    );
    // await message.channel.send({ embeds: [insufficientBalanceMessage(message, capType)] });
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
