/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterSuccessMessage,
} from '../../messages/discord';
import settings from '../../config/settings';

import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordRain = async (discordClient, message, filteredMessage, io) => {
  const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
  const onlineMembers = members.filter((member) =>
    member.presence?.status === "online"
  );
  const mappedMembersArray = onlineMembers.map((a) => {
    return a.user;
  });
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
        type: 'rain_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Rain')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < Number(settings.min.discord.rain)) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [minimumMessage(message, 'Rain')] });
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
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Rain')] });
      return;
    }
    if (amount <= 0) {
      activity = await db.activity.create({
        type: 'rain_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Rain')] });
    }

    if (user.wallet.available < amount) {
      activity = await db.activity.create({
        type: 'rain_i',
        spenderId: user.id,
        amount,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Rain')] });
      return;
    }
    if (withoutBots.length < 2) {
      activity = await db.activity.create({
        type: 'rain_f',
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
    const amountPerUser = (((amount / withoutBots.length).toFixed(0)));
    const rainRecord = await db.rain.create({
      amount,
      userCount: withoutBots.length,
      userId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity = await db.activity.create({
      amount,
      type: 'rain_s',
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
          as: 'rain'
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
    for (const rainee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const raineeWallet = await rainee.wallet.update({
        available: rainee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.raintip.create({
        amount: amountPerUser,
        userId: rainee.id,
        rainId: rainRecord.id,
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
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'raintip_s',
        spenderId: user.id,
        earnerId: rainee.id,
        rainId: rainRecord.id,
        raintipId: rainRecord.id,
        earner_balance: raineeWallet.available + raineeWallet.locked,
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
            model: db.rain,
            as: 'rain'
          },
          {
            model: db.raintip,
            as: 'raintip'
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
