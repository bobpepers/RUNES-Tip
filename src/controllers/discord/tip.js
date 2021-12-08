/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
  tipSuccessMessage,
  NotInDirectMessage,
  userNotFoundMessage,
} from '../../messages/discord';
// import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const tipRunesToDiscordUser = async (
  message,
  filteredMessage,
  userIdToTip,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Tip')] });
    return;
  }
  let activity;
  let user;
  let AmountPosition = 1;
  let AmountPositionEnded = false;
  const usersToTip = [];
  let type = 'split';

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
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
    if (!user) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [userNotFoundMessage(message, 'Tip')] });
      return;
    }
    console.log(usersToTip);
    console.log(AmountPosition);
    console.log(type);

    // make users to tip array
    while (!AmountPositionEnded) {
      console.log(filteredMessage[AmountPosition]);
      const discordId = filteredMessage[AmountPosition].slice(3).slice(0, -1);
      console.log(discordId);
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${discordId}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            required: true,
            include: [
              {
                model: db.address,
                as: 'addresses',
                required: true,
              },
            ],
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          usersToTip.push(userExist);
        }
      }
      // usersToTip.push(filteredMessage[AmountPosition]);
      AmountPosition += 1;
      if (!filteredMessage[AmountPosition].startsWith('<@!')) {
        AmountPositionEnded = true;
      }
    }
    if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
      type = 'each';
    }

    // verify amount
    let amount = 0;
    if (filteredMessage[AmountPosition].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[AmountPosition]).times(1e8).toNumber();
    }
    if (amount < setting.min) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumMessage(message, 'Tip', setting.min)] });

      return;
    }
    if (type === 'each' && filteredMessage[AmountPosition].toLowerCase() !== 'all') {
      amount *= usersToTip.length;
    }
    if (amount % 1 !== 0) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Tip')] });
      return;
    }

    if (amount > user.wallet.available) {
      activity = await db.activity.create({
        type: 'tip_i',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Tip')] });
      return;
    }
    //
    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const userTipAmount = (amount - Number(fee)) / usersToTip.length;
    const tipRecord = await db.tip.create({
      feeAmount: fee,
      amount,
      type,
      userCount: usersToTip.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tipee of usersToTip) {
      // eslint-disable-next-line no-await-in-loop
      const tipeeWallet = await tipee.wallet.update({
        available: tipee.wallet.available + Number(userTipAmount),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const tiptipRecord = await db.tiptip.create({
        amount: Number(userTipAmount),
        userId: tipee.id,
        tipId: tipRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (tipee.ignoreMe) {
        listOfUsersRained.push(`${tipee.username}`);
      } else {
        const userIdReceivedRain = tipee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
    }
    await message.channel.send({ embeds: [tipSuccessMessage(message, listOfUsersRained, userTipAmount, type)] });

    // await message.channel.send({ embeds: [AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained)] });

    logger.info(`Success Tip Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
};
