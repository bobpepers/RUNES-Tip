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

export const discordFlood = async (client, message, filteredMessage) => {
  // console.log(message);
  const guild = await client.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  // const onlineMembers = members.filter((member) => member.status === 'online');
  const onlineMembersIds = members.map((a) => a.userId);
  // eslint-disable-next-line no-restricted-syntax
  const withoutBots = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const onlineId of onlineMembersIds) {
    const thanos = await client.users.fetch(onlineId);
    if (thanos.bot === false) {
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
  console.log(withoutBots);
  console.log('withoutBots');

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    console.log('rain amount');
    console.log(amount);
    if (amount < Number(process.env.MINIMUM_FLOOD)) { // smaller then 2 RUNES
      await message.channel.send({ embeds: [minimumFloodMessage(message)] });
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Flood')] });
    } else {
      console.log('rain 1');
      // const userToTip = runesTipSplit[2].substring(1);
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
            await message.channel.send('not enough online users');
          }
          if (withoutBots.length >= 2) {
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
            const listOfUsersRained = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const rainee of withoutBots) {
              console.log('raineee');
              console.log(rainee);
              console.log(amountPerUser);
              console.log(rainee.id);
              console.log(rainRecord.id);
              // eslint-disable-next-line no-await-in-loop
              await rainee.wallet.update({
                available: rainee.wallet.available + Number(amountPerUser),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              console.log('afterrainee update');
              console.log(amountPerUser);
              console.log(rainee.id);
              console.log(rainRecord.id);
              // eslint-disable-next-line no-await-in-loop
              await db.raintip.create({
                amount: amountPerUser,
                userId: rainee.id,
                rainId: rainRecord.id,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              console.log('after raintip create');
              const userIdReceivedRain = rainee.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdReceivedRain}>`);
            }

            // await ctx.reply(`Raining ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await message.channel.send(element);
            }

            await message.channel.send({ embeds: [AfterFloodSuccessMessage(message, amount, withoutBots, amountPerUser)] });
            logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
            // cutStringListUsers.forEach((element) => ctx.reply(element));
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
