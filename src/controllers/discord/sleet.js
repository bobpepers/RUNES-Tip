/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  notEnoughActiveUsersMessage,
  walletNotFoundMessage,
  minimumSleetMessage,
  AfterSleetSuccessMessage,
} from '../../messages/discord';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

export const discordSleet = async (client, message, filteredMessage) => {
  // const guild = await client.guilds.cache.get(message.guildId);
  // const members = guild.presences.cache;
  // const onlineMembers = members.filter((member) => member.status === 'online');
  // const onlineMembersIds = members.map((a) => a.userId);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    console.log('sleet amount');
    console.log(amount);
    if (amount < Number(process.env.MINIMUM_SLEET)) { // smaller then 2 RUNES
      await message.channel.send({ embeds: [minimumSleetMessage(message)] });
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Sleet')] });
    }
    // const userToTip = runesTipSplit[2].substring(1);
    const user = await db.user.findOne({
      where: {
        user_id: `discord-${message.author.id}`,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    console.log(user);
    if (!user) {
      await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Sleet')] });
    }
    if (user) {
      if (user.wallet.available < amount) {
        await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Sleet')] });
      }
      if (user.wallet.available >= amount) {
        const group = await db.group.findOne({
          where: {
            groupId: `discord-${message.guildId}`,
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        console.log(group);
        if (group) {
          console.log('fetchuserstart');
          const usersToRain = await db.user.findAll({
            where: {
              [Op.and]: [
                {
                  user_id: { [Op.not]: `discord-${message.author.id}` },
                },
              ],
            },
            include: [
              {
                model: db.active,
                as: 'active',
                // required: false,
                where: {
                  [Op.and]: [
                    {
                      lastSeen: {
                        [Op.gte]: new Date(Date.now() - (15 * 60 * 1000)),
                      },
                    },
                    {
                      groupId: group.id,
                    },
                  ],
                },
              },
              {
                model: db.wallet,
                as: 'wallet',
              },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
          });
          console.log('fetched');
          console.log('rain 4');
          console.log(usersToRain);
          if (usersToRain.length < 2) {
            await message.channel.send({ embeds: [notEnoughActiveUsersMessage(message, 'Sleet')] });
          }
          if (usersToRain.length >= 2) {
            const updatedBalance = await user.wallet.update({
              available: user.wallet.available - amount,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const amountPerUser = (((amount / usersToRain.length).toFixed(0)));
            const rainRecord = await db.rain.create({
              amount,
              userCount: usersToRain.length,
              userId: user.id,
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });
            const listOfUsersRained = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const rainee of usersToRain) {
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
              const userIdTest = rainee.user_id.replace('discord-', '');
              listOfUsersRained.push(`<@${userIdTest}>`);
            }

            // await ctx.reply(`Raining ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              // await ctx.reply(element);
              await message.channel.send(element);
            }

            await message.channel.send({ embeds: [AfterSleetSuccessMessage(message, amount, usersToRain, amountPerUser)] });
            logger.info(`Success Rain Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);
            // cutStringListUsers.forEach((element) => ctx.reply(element));
          }
        }
        if (!group) {
          await message.channel.send("Group not found");
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.channel.send("Somethign went wrong.");
  });
};
