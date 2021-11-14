/* eslint-disable import/prefer-default-export */
import db from '../../models';
const _ = require('lodash');
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

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordThunderStorm = async (discordClient, message, filteredMessage) => {

  if (Number(filteredMessage[2]) > 50) {
    await message.channel.send({ embeds: [thunderstormMaxUserAmountMessage(message)] });
  } else if (Number(filteredMessage[2]) % 1 !== 0) {
    await message.channel.send({ embeds: [thunderstormInvalidUserAmount(message)] });
  } else if (Number(filteredMessage[2]) <= 0) {
    await message.channel.send({ embeds: [thunderstormUserZeroAmountMessage(message)] });
  } else {
    const guild = await discordClient.guilds.cache.get(message.guildId);
    const members = guild.presences.cache;
    const onlineMembers = members.filter((member) => member.status === 'online');
    const onlineMembersIds = onlineMembers.map((a) => a.userId)
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
    const withoutBots = _.sampleSize(preWithoutBots, Number(filteredMessage[2]));
    console.log(withoutBots);
  
    await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      let amount = 0;
      if (filteredMessage[3].toLowerCase() === 'all') {
        const tipper = await db.user.findOne({
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
        if (tipper) {
          amount = tipper.wallet.available;
        } else {
          amount = 0;
        }
      } else {
        amount = new BigNumber(filteredMessage[3]).times(1e8).toNumber();
      }
      if (amount < Number(settings.min.discord.thunderstorm)) {
        await message.channel.send({ embeds: [minimumMessage(message, 'ThunderStorm')] });
      } else if (amount % 1 !== 0) {
        await message.channel.send({ embeds: [invalidAmountMessage(message, 'ThunderStorm')] });
      } else if (amount <= 0) {
        await message.channel.send({ embeds: [invalidAmountMessage(message, 'ThunderStorm')] });
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
          await message.channel.send({ embeds: [walletNotFoundMessage(message, 'ThunderStorm')] });
        }
        if (user) {
          if (user.wallet.available < amount) {
            await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'ThunderStorm')] });
          }
          if (user.wallet.available >= amount) {
            console.log(withoutBots.length);
            if (withoutBots.length < 1) {
              await message.channel.send('Not enough online users');
            }
            if (withoutBots.length >= 1) {
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              console.log('amount');
              
              console.log(amount);
              console.log(user.wallet);
              const updatedBalance = await user.wallet.update({
                available: user.wallet.available - amount,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              console.log(updatedBalance);
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
                const userIdReceivedRain = thunderee.user_id.replace('discord-', '');
                listOfUsersRained.push(`<@${userIdReceivedRain}>`);
              }
              await message.channel.send({ embeds: [AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained)] });
              //for (const userThunder of listOfUsersRained) {
              //    // eslint-disable-next-line no-await-in-loop
              //    await message.channel.send({ embeds: [AfterThunderSuccess(message, amount, userThunder)] });
              //  }
              
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
  }

};
