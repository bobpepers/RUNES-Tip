/* eslint-disable import/prefer-default-export */
import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
  unableToFindUserTipMessage,
  userNotFoundMessage,
  tipSuccessMessage,
} from '../../messages/discord';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const tipRunesToDiscordUser = async (message, filteredMessage, userIdToTip, io) => {
  let activity;
  let user;
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
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
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
    if (amount < Number(settings.min.discord.tip)) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumMessage(message, 'Tip')] });

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
    const findUserToTip = await db.user.findOne({
      where: {
        user_id: `discord-${userIdToTip}`,
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
      await message.channel.send({ embeds: [unableToFindUserTipMessage] });
      return;
    }
    if (user.id === findUserToTip.id) {
      activity = await db.activity.create({
        type: 'tip_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send('cannot tip self');
      return;
    }

    const wallet = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const updatedFindUserToTip = await findUserToTip.wallet.update({
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
    console.log(updatedFindUserToTip);
    console.log("updatedFindUserToTip");
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

    const userId = user.user_id.replace('discord-', '');

    let tempUserName;
    if (findUserToTip.ignoreMe) {
      tempUserName = findUserToTip.username;
    } else {
      const userIdTipped = findUserToTip.user_id.replace('discord-', '');
      tempUserName = `<@${userIdTipped}>`;
    }

    await message.channel.send({ embeds: [tipSuccessMessage(userId, tempUserName, amount)] });
    logger.info(`Success tip Requested by: ${user.user_id}-${user.username} to ${findUserToTip.user_id}-${findUserToTip.username} with ${amount / 1e8} ${settings.coin.ticker}`);

    t.afterCommit(async () => {
      console.log('Done');
    });
  }).catch((err) => {
    message.channel.send("Something went wrong.");
  });
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
};
