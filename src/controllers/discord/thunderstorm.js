/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterThunderStormSuccess,
  thunderstormMaxUserAmountMessage,
  thunderstormInvalidUserAmount,
  thunderstormUserZeroAmountMessage,
} from '../../messages/discord';
import settings from '../../config/settings';

import _ from "lodash";

import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordThunderStorm = async (discordClient, message, filteredMessage) => {
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
  const onlineMembers = members.filter((member) => 
    member.presence?.status === "online"
  );
  const mappedMembersArray = onlineMembers.map((a) => {
    return a.user;
  });
  const preWithoutBots = [];

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
          preWithoutBots.push(userExist);
        }
      }
    }
  }
  const withoutBots = _.sampleSize(preWithoutBots, Number(filteredMessage[2]));

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
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
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'ThunderStorm')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[3].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[3]).times(1e8).toNumber();
    }
    if (amount < Number(settings.min.discord.thunderstorm)) {
      await message.channel.send({ embeds: [minimumMessage(message, 'ThunderStorm')] });
      return;
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'ThunderStorm')] });
      return;
    }
    if (amount <= 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'ThunderStorm')] });
      return;
    }

    if (user.wallet.available < amount) {
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'ThunderStorm')] });
      return;
    }
    if (withoutBots.length < 1) {
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
    const thunderRecord = await db.thunder.create({
      amount,
      userCount: withoutBots.length,
      userId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const thunderee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      await thunderee.wallet.update({
        available: thunderee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.thundertip.create({
        amount: amountPerUser,
        userId: thunderee.id,
        thunderId: thunderRecord.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      
      if (thunderee.ignoreMe) {
        listOfUsersRained.push(`${thunderee.username}`);
      } else {
        const userIdReceivedRain = thunderee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);;
      }
    }
    await message.channel.send({ embeds: [AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained)] });

    logger.info(`Success Thunder Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
};
