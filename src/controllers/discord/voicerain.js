/* eslint-disable import/prefer-default-export */
import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterSuccessMessage,
  NotInDirectMessage,
} from '../../messages/discord';

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
  console.log(channelTask);
  console.log('channelTask');
  console.log('channelTask');
  console.log('channelTask');
  console.log('channelTask');
  console.log('channelTask');
  console.log(filteredMessage);
  if (!filteredMessage[3].startsWith('<#')) {
    console.log('not a channel');
    return;
  }
  if (!filteredMessage[3].endsWith('>')) {
    console.log('not a channel');
    return;
  }
  const voiceChannelId = filteredMessage[3].substr(2).slice(0, -1);
  console.log(voiceChannelId);

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

  const members = await discordClient.channels.cache.get(voiceChannelId).members;
  console.log(members);
  console.log('members');
  const onlineMembers = members;
  const mappedMembersArray = onlineMembers.map((a) => a.user);
  const withoutBots = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const discordUser of mappedMembersArray) {
    // eslint-disable-next-line no-await-in-loop
    if (discordUser.bot === false) {
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${discordUser.id}`,
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
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          withoutBots.push(userExist);
        }
      }
    }
  }
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
    if (!user) {
      activity = await db.activity.create({
        type: 'voicerain_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Voicerain')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < setting.min) {
      activity = await db.activity.create({
        type: 'voicerain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumMessage(message, 'VoiceRain')] });
      return;
    }
    if (amount % 1 !== 0) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'VoiceRain')] });
      return;
    }
    if (amount <= 0) {
      activity = await db.activity.create({
        type: 'voicerain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'VoiceRain')] });
    }

    if (user.wallet.available < amount) {
      activity = await db.activity.create({
        type: 'voicerain_i',
        spenderId: user.id,
        amount,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'VoiceRain')] });
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
      await message.channel.send('Not enough online users');
      return;
    }
    console.log('123');

    console.log(user.wallet);
    console.log(amount);
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
    console.log('333333');
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
    console.log(999);
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
      console.log('before tipactivity record');

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
