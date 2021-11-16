/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumMessage,
  AfterThunderSuccess,
} from '../../messages/discord';
import settings from '../../config/settings';

import _ from "lodash";

import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordThunder = async (discordClient, message, filteredMessage) => {
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
  const withoutBots = _.sampleSize(preWithoutBots, 1);

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
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Thunder')] });
      return;
    }
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
      amount = user.wallet.available;
    } else {
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }
    if (amount < Number(settings.min.discord.thunder)) {
      await message.channel.send({ embeds: [minimumMessage(message, 'Thunder')] });
      return;
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Thunder')] });
      return;
    }
    if (amount <= 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Thunder')] });
      return;
    }

    if (user.wallet.available < amount) {
      await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Thunder')] });
      return;
    }

    if (withoutBots.length < 1) {
      await message.channel.send('Not enough online users');
      return;
    }
    if (withoutBots.length === 1) {
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
          listOfUsersRained.push(`<@${userIdReceivedRain}>`);
        }
      }
      for (const userThunder of listOfUsersRained) {
        // eslint-disable-next-line no-await-in-loop
        await message.channel.send({ embeds: [AfterThunderSuccess(message, amount, userThunder)] });
      }

      logger.info(`Success Thunder Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
};
