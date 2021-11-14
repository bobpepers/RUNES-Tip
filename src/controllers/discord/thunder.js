/* eslint-disable import/prefer-default-export */
import db from '../../models';
const _ = require('lodash');
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  walletNotFoundMessage,
  minimumRainMessage,
  AfterThunderSuccess,
} from '../../messages/discord';
import settings from '../../config/settings';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordThunder = async (discordClient, message, filteredMessage) => {
  const guild = await discordClient.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  const onlineMembers = members.filter((member) => member.status === 'online');
  const onlineMembersIds = onlineMembers.map((a) => a.userId)

  //const onlineMembersIds = _.sampleSize(onlineMembersIds, 1);
  
  console.log(onlineMembersIds);
  
  console.log('herererer');
  const preWithoutBots = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const onlineId of onlineMembersIds) {
    // eslint-disable-next-line no-await-in-loop
    const fetchUserDiscordClient = await discordClient.users.fetch(onlineId);
    if (fetchUserDiscordClient.bot === false) {
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${onlineId}`,
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
  console.log(withoutBots);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    if (amount < Number(settings.min.discord.rain)) {
      await message.channel.send({ embeds: [minimumRainMessage(message)] });
    } else if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Thunder')] });
    } else {
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
      }
      if (user) {
        if (user.wallet.available < amount) {
          await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Thunder')] });
        }
        if (user.wallet.available >= amount) {
          console.log(withoutBots.length);
          if (withoutBots.length < 1) {
            await message.channel.send('Not enough online users');
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
              console.log(amountPerUser);
              console.log(thunderee.id);
              console.log(thunderRecord.id);
              console.log('1231');
              await db.thundertip.create({
                amount: amountPerUser,
                userId: thunderee.id,
                thunderId: thunderRecord.id,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              console.log('af');
              const userIdReceivedRain = thunderee.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdReceivedRain}>`);
            }
            for (const userThunder of listOfUsersRained) {
                // eslint-disable-next-line no-await-in-loop
                console.log('waa');
                console.log(userThunder);
                await message.channel.send({ embeds: [AfterThunderSuccess(message, amount, userThunder)] });
                console.log("pfft");
              }
            
            logger.info(`Success Thunder Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
};
