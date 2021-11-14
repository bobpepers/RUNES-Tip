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

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordSoak = async (discordClient, message, filteredMessage) => {
  const guild = await discordClient.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  console.log(members);
  const onlineMembers = members.filter((member) => member.status === 'online' || member.status === 'idle' || member.status === 'dnd');
  const onlineMembersIds = onlineMembers.map((a) => a.userId);
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
    if (amount < Number(settings.min.discord.soak)) {
      await message.channel.send({ embeds: [minimumMessage(message, 'Soak')] });
    } else if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Soak')] });
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
        await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Soak')] });
      }
      if (user) {
        if (user.wallet.available < amount) {
          await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Soak')] });
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
            const soakRecord = await db.soak.create({
              amount,
              userCount: withoutBots.length,
              userId: user.id,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const listOfUsersRained = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const soakee of withoutBots) {
              // eslint-disable-next-line no-await-in-loop
              await soakee.wallet.update({
                available: soakee.wallet.available + Number(amountPerUser),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              // eslint-disable-next-line no-await-in-loop
              await db.soaktip.create({
                amount: amountPerUser,
                userId: soakee.id,
                soakId: soakRecord.id,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              const userIdReceivedRain = soakee.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdReceivedRain}>`);
            }

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await message.channel.send(element);
            }

            await message.channel.send({ embeds: [AfterSuccessMessage(message, amount, withoutBots, amountPerUser, 'Soak', 'soaked')] });
            logger.info(`Success Soak Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
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
