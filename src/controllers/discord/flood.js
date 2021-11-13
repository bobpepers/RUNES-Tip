/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumFloodMessage,
  walletNotFoundMessage,
  AfterFloodSuccessMessage,
} from '../../messages/discord';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordFlood = async (discordClient, message, filteredMessage) => {
  const guild = await discordClient.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  // const onlineMembers = members.filter((member) => member.status === 'online');
  const onlineMembersIds = members.map((a) => a.userId);
  // eslint-disable-next-line no-restricted-syntax
  const withoutBots = [];
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
          withoutBots.push(userExist);
        }
      }
    }
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    if (amount < Number(process.env.MINIMUM_FLOOD)) {
      await message.channel.send({ embeds: [minimumFloodMessage(message)] });
    } else if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Flood')] });
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
      console.log(user);
      if (!user) {
        await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Flood')] });
      }
      if (user) {
        if (user.wallet.available < amount) {
          await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Flood')] });
        }
        if (user.wallet.available >= amount) {
          if (withoutBots.length < 2) {
            await message.channel.send('Not enough online users');
          }
          if (withoutBots.length >= 2) {
            const updatedBalance = await user.wallet.update({
              available: user.wallet.available - amount,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const amountPerUser = (((amount / withoutBots.length).toFixed(0)));
            const floodRecord = await db.flood.create({
              amount,
              userCount: withoutBots.length,
              userId: user.id,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const listOfUsersRained = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const floodee of withoutBots) {
              console.log('add flood tip');
              // eslint-disable-next-line no-await-in-loop
              await floodee.wallet.update({
                available: floodee.wallet.available + Number(amountPerUser),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              // eslint-disable-next-line no-await-in-loop
              await db.floodtip.create({
                amount: amountPerUser,
                userId: floodee.id,
                floodId: floodRecord.id,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              const userIdReceivedRain = floodee.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdReceivedRain}>`);
            }

            const newStringListUsers = listOfUsersRained.join(", ");
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await message.channel.send(element);
            }

            await message.channel.send({ embeds: [AfterFloodSuccessMessage(message, amount, withoutBots, amountPerUser)] });
            logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    message.channel.send('something went wrong');
  });
};
