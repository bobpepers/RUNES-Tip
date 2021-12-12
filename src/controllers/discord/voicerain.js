/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import {
  AfterSuccessMessage,
  NotInDirectMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/discord/validateAmount";
import { mapMembers } from "../../helpers/discord/mapMembers";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

import logger from "../../helpers/logger";

export const discordVoiceRain = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Voicerain')] });
    return;
  }
  if (!filteredMessage[3].startsWith('<#')) {
    console.log('not a channel');
    return;
  }
  if (!filteredMessage[3].endsWith('>')) {
    console.log('not a channel');
    return;
  }
  const voiceChannelId = filteredMessage[3].substr(2).slice(0, -1);

  const voiceChannel = await db.channel.findOne({
    where: {
      channelId: `discord-${voiceChannelId}`,
      groupId: groupTask.id,
    },
  });
  if (!voiceChannel) {
    console.log('channel not found');
    return;
  }

  const onlineMembers = await discordClient.channels.cache.get(voiceChannelId).members;

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

    const withoutBots = await mapMembers(
      message,
      t,
      filteredMessage[4],
      onlineMembers,
    );

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity = activityValiateAmount;
      return;
    }

    if (withoutBots.length < 2) {
      activity = await db.activity.create({
        type: 'voicerain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send('Not enough users');
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

    const rainRecord = await db.voicerain.create({
      amount: Number(amount),
      feeAmount: Number(fee),
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: voiceChannel.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.create({
      amount,
      type: 'voicerain_s',
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
    for (const rainee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const raineeWallet = await rainee.wallet.update({
        available: rainee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const raintipRecord = await db.voiceraintip.create({
        amount: Number(amountPerUser),
        userId: rainee.id,
        voicerainId: rainRecord.id,
        groupId: groupTask.id,
        channelId: voiceChannel.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (rainee.ignoreMe) {
        listOfUsersRained.push(`${rainee.username}`);
      } else {
        const userIdReceivedRain = rainee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'voiceraintip_s',
        spenderId: user.id,
        earnerId: rainee.id,
        voicerainId: rainRecord.id,
        voiceraintipId: raintipRecord.id,
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
      console.log(tipActivity);
      io.to('admin').emit('updateActivity', {
        activity: tipActivity,
      });
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    console.log(newStringListUsers);
    const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
      await message.channel.send(element);
    }

    await message.channel.send({ embeds: [AfterSuccessMessage(message, amount, withoutBots, amountPerUser, 'Rain', 'rained')] });
    logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

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
