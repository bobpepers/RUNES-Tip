/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  walletNotFoundMessage,
  AfterHurricaneSuccess,
  hurricaneMaxUserAmountMessage,
  hurricaneInvalidUserAmount,
  hurricaneUserZeroAmountMessage,
  NotInDirectMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/discord/validateAmount";
import { mapMembers } from "../../helpers/discord/mapMembers";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

import _ from "lodash";

import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordHurricane = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Flood')] });
    return;
  }
  if (Number(filteredMessage[2]) > 50) {
    await message.channel.send({ embeds: [hurricaneMaxUserAmountMessage(message)] });
    return;
  }
  if (Number(filteredMessage[2]) % 1 !== 0) {
    await message.channel.send({ embeds: [hurricaneInvalidUserAmount(message)] });
    return;
  }
  if (Number(filteredMessage[2]) <= 0) {
    await message.channel.send({ embeds: [hurricaneUserZeroAmountMessage(message)] });
    return;
  }
  const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
  const onlineMembers = members.filter((member) =>
    member.presence?.status === "online"
    || member.presence?.status === "idle"
    || member.presence?.status === "dnd"
  );

  let activity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      activity,
    ] = await userWalletExist(
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (!user) return;

    const preWithoutBots = await mapMembers(
      message,
      t,
      filteredMessage[4],
      onlineMembers,
    );
    const withoutBots = _.sampleSize(preWithoutBots, Number(filteredMessage[2]));

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[3],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
      return;
    }

    if (withoutBots.length < 1) {
      activity = await db.activity.create({
        type: 'hurricane_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send('Not enough online users');
      return;
    }

    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);

    const hurricaneRecord = await db.hurricane.create({
      amount,
      feeAmount: fee,
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity = await db.activity.create({
      amount,
      type: 'hurricane_s',
      spenderId: user.id,
      hurricaneId: hurricaneRecord.id,
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
          model: db.hurricane,
          as: 'hurricane'
        },
        {
          model: db.user,
          as: 'spender'
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,

    });
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const hurricaneee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const hurricaneeeWallet = await hurricaneee.wallet.update({
        available: hurricaneee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      console.log(amountPerUser);
      console.log(hurricaneee.id);
      console.log(hurricaneRecord.id);

      const hurricanetipRecord = await db.hurricanetip.create({
        amount: amountPerUser,
        userId: hurricaneee.id,
        hurricaneId: hurricaneRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (hurricaneee.ignoreMe) {
        listOfUsersRained.push(`${hurricaneee.username}`);
      } else {
        const userIdReceivedRain = hurricaneee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);;
      }
      let tipActivity;
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'hurricanetip_s',
        spenderId: user.id,
        earnerId: hurricaneee.id,
        hurricaneId: hurricaneRecord.id,
        hurricanetipId: hurricanetipRecord.id,
        earner_balance: hurricaneeeWallet.available + hurricaneeeWallet.locked,
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
            as: 'earner'
          },
          {
            model: db.user,
            as: 'spender'
          },
          {
            model: db.hurricane,
            as: 'hurricane'
          },
          {
            model: db.hurricanetip,
            as: 'hurricanetip'
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      console.log(tipActivity);
      io.to('admin').emit('updateActivity', {
        activity: tipActivity,
      });
    }
    await message.channel.send({ embeds: [AfterHurricaneSuccess(message, amount, amountPerUser, listOfUsersRained)] });

    logger.info(`Success Hurricane Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
