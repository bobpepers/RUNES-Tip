/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  thunderstormMaxUserAmountMessage,
  thunderstormInvalidUserAmount,
  thunderstormUserZeroAmountMessage,
  NotInDirectMessage,
  AfterSuccessMessage,
  discordErrorMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/discord/validateAmount";
import { mapMembers } from "../../helpers/discord/mapMembers";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

import logger from "../../helpers/logger";
import { waterFaucet } from "../../helpers/waterFaucet";

export const discordThunderStorm = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
  queue,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Thunderstorm')] });
    return;
  }
  if (Number(filteredMessage[2]) > 50) {
    await message.channel.send({ embeds: [thunderstormMaxUserAmountMessage(message)] });
    return;
  }
  if (Number(filteredMessage[2]) % 1 !== 0) {
    await message.channel.send({ embeds: [thunderstormInvalidUserAmount(message)] });
    return;
  }
  if (Number(filteredMessage[2]) <= 0) {
    await message.channel.send({ embeds: [thunderstormUserZeroAmountMessage(message)] });
    return;
  }
  const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
  const onlineMembers = members.filter((member) => member && member.presence && member.presence.status && member.presence.status === "online");

  const activity = [];
  let userActivity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const preWithoutBots = await mapMembers(
      message,
      t,
      filteredMessage[4],
      onlineMembers,
      setting,
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
      'thunderstorm',
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    if (withoutBots.length < 1) {
      const failActivity = await db.activity.create({
        type: 'thunderstorm_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(failActivity);
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
    const amountPerUser = (((amount - Number(fee)) / withoutBots.length).toFixed(0));

    const faucetWatered = await waterFaucet(
      t,
      Number(fee),
      faucetSetting,
    );
    const thunderstormRecord = await db.thunderstorm.create({
      feeAmount: fee,
      amount,
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      amount,
      type: 'thunderstorm_s',
      spenderId: user.id,
      thunderstormId: thunderstormRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const finalActivity = await db.activity.findOne({
      where: {
        id: preActivity.id,
      },
      include: [
        {
          model: db.thunderstorm,
          as: 'thunderstorm',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(finalActivity);
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const thunderstormee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const thunderstormeeWallet = await thunderstormee.wallet.update({
        available: thunderstormee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const thunderstormtipRecord = await db.thunderstormtip.create({
        amount: amountPerUser,
        userId: thunderstormee.id,
        thunderstormId: thunderstormRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (thunderstormee.ignoreMe) {
        listOfUsersRained.push(`${thunderstormee.username}`);
      } else {
        const userIdReceivedRain = thunderstormee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'thunderstormtip_s',
        spenderId: user.id,
        earnerId: thunderstormee.id,
        thunderstormId: thunderstormRecord.id,
        thunderstormtipId: thunderstormtipRecord.id,
        earner_balance: thunderstormeeWallet.available + thunderstormeeWallet.locked,
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
            model: db.thunderstorm,
            as: 'thunderstorm',
          },
          {
            model: db.thunderstormtip,
            as: 'thunderstormtip',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(tipActivity);
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await message.channel.send(element);
    }
    await message.channel.send({
      embeds: [
        AfterSuccessMessage(
          message,
          thunderstormRecord.id,
          amount,
          withoutBots,
          amountPerUser,
          '⛈ Thunderstorm ⛈',
          'thunderstormed',
        ),
      ],
    });

    // logger.info(`Success ThunderStorm Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'thunderstorm',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`thunderstorm error: ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("ThunderStorm")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
