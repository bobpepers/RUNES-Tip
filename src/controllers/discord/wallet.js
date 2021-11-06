import db from '../../models';
import { getInstance } from '../../services/rclient';

const { MessageEmbed, MessageAttachment } = require('discord.js');

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const QRCode = require('qrcode');
const logger = require('../../helpers/logger');

const minimumTip = 1 * 1e6;
const minimumRain = 1 * 1e7;

/**
 * Create Withdrawal
 */
export const withdrawDiscordCreate = async (message, filteredMessage) => {
  console.log(filteredMessage);
  logger.info(`Start Withdrawal Request: ${message.author.id}-${message.author.username}`);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[3]).times(1e8).toNumber();
    console.log('withdrawal amount');
    console.log(amount);
    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      const toSmaallMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Withdraw')
        .setDescription(`<@${message.author.id}>, Minimum Withdrawal is 2 RUNES`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.author.send({ embeds: [toSmaallMessage] });
    }
    if (amount % 1 !== 0) {
      const invalidAmountMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Withdraw')
        .setDescription(`<@${message.author.id}>, Invalid Amount`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.author.send({ embeds: [invalidAmountMessage] });
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    if (!isRunebaseAddress) {
      const invalidAddressMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Withdraw')
        .setDescription(`<@${message.author.id}>, Invalid Runebase Address`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.author.send({ embeds: [invalidAddressMessage] });
    }

    if (amount >= (2 * 1e8) && amount % 1 === 0 && isRunebaseAddress) {
      const user = await db.user.findOne({
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
      if (!user) {
        const userNotFoundMessage = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Withdraw')
          .setDescription(`<@${message.author.id}>, Wallet not found`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await message.author.send({ embeds: [userNotFoundMessage] });
      }
      if (user) {
        if (amount > user.wallet.available) {
          const Insufficient = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Withdraw')
            .setDescription(`<@${message.author.id}>, Insufficient funds`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await message.author.send({ embeds: [Insufficient] });
        }
        if (amount <= user.wallet.available) {
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
            locked: user.wallet.locked + amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const transaction = await db.transaction.create({
            addressId: wallet.addresses[0].id,
            phase: 'review',
            type: 'send',
            to_from: filteredMessage[2],
            amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const activity = await db.activity.create(
            {
              spenderId: user.id,
              type: 'withdrawRequested',
              amount,
              transactionId: transaction.id,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
          const reviewMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Withdraw')
            .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await message.author.send({ embeds: [reviewMessage] });
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    message.author.send("Something went wrong.");
  });
};

export const discordSleet = async (client, message, filteredMessage) => {
  // const guild = await client.guilds.cache.get(message.guildId);
  // const members = guild.presences.cache;
  // const onlineMembers = members.filter((member) => member.status === 'online');
  // const onlineMembersIds = members.map((a) => a.userId);

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    console.log('rain amount');
    console.log(amount);
    if (amount < (minimumRain)) { // smaller then 2 RUNES
      const minimumSleetMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sleet')
        .setDescription(`<@${message.author.id}>, Minimum Rain is ${minimumRain / 1e8} RUNES`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [minimumSleetMessage] });
    }
    if (amount % 1 !== 0) {
      const invalidAmountMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sleet')
        .setDescription(`<@${message.author.id}>, Invalid Amount`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [invalidAmountMessage] });
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
      const walletNotFoundMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sleet')
        .setDescription(`<@${message.author.id}>, Wallet not found`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [walletNotFoundMessage] });
    }
    if (user) {
      if (user.wallet.available < amount) {
        const notEnoughBalanceMessage = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Sleet')
          .setDescription(`<@${message.author.id}>, Insufficient Balance`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await message.channel.send({ embeds: [notEnoughBalanceMessage] });
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
            const notEnoughActiveUsersMessage = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Sleet')
              .setDescription(`<@${message.author.id}>, not enough active users`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [notEnoughActiveUsersMessage] });
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
              console.log('after raintip create');
              listOfUsersRained.push(`<@${userIdTest}>`);
            }

            // await ctx.reply(`Raining ${amount / 1e8} RUNES on ${usersToRain.length} active users -- ${amountPerUser / 1e8} RUNES each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              // await ctx.reply(element);
              await message.channel.send(element);
            }
            const notEnoughActiveUsersMessage = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Sleet')
              .setDescription(`<@${message.author.id}> Sleeted ${amount / 1e8} RUNES on ${usersToRain.length} active users -- ${amountPerUser / 1e8} RUNES each`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [notEnoughActiveUsersMessage] });
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

export const discordFlood = async (client, message, filteredMessage) => {
  // console.log(message);
  const guild = await client.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  // const onlineMembers = members.filter((member) => member.status === 'online');
  const onlineMembersIds = members.map((a) => a.userId);
  // eslint-disable-next-line no-restricted-syntax
  const withoutBots = [];
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
    if (amount < (minimumRain)) { // smaller then 2 RUNES
      const minimumRainMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Flood')
        .setDescription(`<@${message.author.id}>, Minimum Flood is ${minimumRain / 1e8} RUNES`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [minimumRainMessage] });
    }
    if (amount % 1 !== 0) {
      const invalidAmountMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Flood')
        .setDescription(`<@${message.author.id}>, Invalid Amount`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [invalidAmountMessage] });
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
        const walletNotFound = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Flood')
          .setDescription(`<@${message.author.id}>, User Wallet Not Found`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await message.channel.send({ embeds: [walletNotFound] });
      }
      if (user) {
        if (user.wallet.available < amount) {
          const notEnoughBalanceRain = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Flood')
            .setDescription(`<@${message.author.id}>, Insufficient Balance`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await message.channel.send({ embeds: [notEnoughBalanceRain] });
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

            // await ctx.reply(`Raining ${amount / 1e8} RUNES on ${usersToRain.length} active users -- ${amountPerUser / 1e8} RUNES each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await message.channel.send(element);
            }
            const successRained = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Rain')
              .setDescription(`<@${message.author.id}> Flooded ${amount / 1e8} RUNES on ${withoutBots.length} users -- ${amountPerUser / 1e8} RUNES each`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [successRained] });
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

export const discordRain = async (client, message, filteredMessage) => {
  // console.log(message);
  const guild = await client.guilds.cache.get(message.guildId);
  const members = guild.presences.cache;
  const onlineMembers = members.filter((member) => member.status === 'online');
  const onlineMembersIds = onlineMembers.map((a) => a.userId);
  // eslint-disable-next-line no-restricted-syntax
  const withoutBots = [];
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
    if (amount < (minimumRain)) { // smaller then 2 RUNES
      const minimumRainMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Rain')
        .setDescription(`<@${message.author.id}>, Minimum Rain is ${minimumRain / 1e8} RUNES`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [minimumRainMessage] });
    }
    if (amount % 1 !== 0) {
      const invalidAmountMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Rain')
        .setDescription(`<@${message.author.id}>, Invalid Amount`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [invalidAmountMessage] });
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
        const walletNotFound = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Rain')
          .setDescription(`<@${message.author.id}>, User Wallet Not Found`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await message.channel.send({ embeds: [walletNotFound] });
      }
      if (user) {
        if (user.wallet.available < amount) {
          const notEnoughBalanceRain = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Rain')
            .setDescription(`<@${message.author.id}>, Insufficient Balance`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await message.channel.send({ embeds: [notEnoughBalanceRain] });
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

            // await ctx.reply(`Raining ${amount / 1e8} RUNES on ${usersToRain.length} active users -- ${amountPerUser / 1e8} RUNES each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            console.log(newStringListUsers);
            const cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await message.channel.send(element);
            }
            const successRained = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Rain')
              .setDescription(`<@${message.author.id}> rained ${amount / 1e8} RUNES on ${withoutBots.length} users -- ${amountPerUser / 1e8} RUNES each`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [successRained] });
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

export const tipRunesToDiscordUser = async (message, filteredMessage, userIdToTip) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let amount = 0;
    if (filteredMessage[2].toLowerCase() === 'all') {
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
      amount = new BigNumber(filteredMessage[2]).times(1e8).toNumber();
    }

    if (amount % 1 !== 0) {
      const invalidAmountMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Tip')
        .setDescription(`<@${message.author.id}>, Invalid Amount`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [invalidAmountMessage] });
    } else if (amount < (minimumTip)) { // smaller then 0.01 RUNES
      const minimumTipMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Tip')
        .setDescription(`<@${message.author.id}>, Minimum Tip is 0.01 RUNES`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await message.channel.send({ embeds: [minimumTipMessage] });
    } else {
      const findUserToTip = await db.user.findOne({
        where: {
          user_id: `discord-${userIdToTip}`,
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
      console.log('2');
      if (!findUserToTip) {
        const unableToFindUserMessage = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Tip')
          .setDescription(`Unable to find user to tip.`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await message.channel.send({ embeds: [unableToFindUserMessage] });
      }

      if (amount >= (minimumTip) && amount % 1 === 0 && findUserToTip) {
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
        if (!user) {
          const userNotFoundMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Tip')
            .setDescription(`User not found.`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await message.channel.send({ embeds: [userNotFoundMessage] });
        }
        if (user) {
          if (amount > user.wallet.available) {
            const notEnoughBalanceMessage = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Tip')
              .setDescription(`Insufficient Balance.`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [notEnoughBalanceMessage] });
            // ctx.reply('Insufficient funds');
          }
          if (amount <= user.wallet.available) {
            const wallet = await user.wallet.update({
              available: user.wallet.available - amount,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            console.log('4');
            const updatedFindUserToTip = findUserToTip.wallet.update({
              available: findUserToTip.wallet.available + amount,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            const tipTransaction = await db.tip.create({
              userId: user.id,
              userTippedId: findUserToTip.id,
              amount,
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            console.log(tipTransaction);
            console.log('6');
            const userId = user.user_id.replace('discord-', '');
            const userIdTipped = findUserToTip.user_id.replace('discord-', '');
            const userNotFoundMessage = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Tip')
              .setDescription(`<@${userId}> tipped ${amount / 1e8} RUNES to <@${userIdTipped}>`)
              .setTimestamp()
              .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
            await message.channel.send({ embeds: [userNotFoundMessage] });
            logger.info(`Success tip Requested by: ${user.user_id}-${user.username} to ${findUserToTip.user_id}-${findUserToTip.username} with ${amount / 1e8} RUNES`);
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with tipping');
  });
};

/**
 * Create Withdrawal
 */
export const withdrawTelegramCreate = async (ctx, withdrawalAddress, withdrawalAmount) => {
  logger.info(`Start Withdrawal Request: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(withdrawalAmount).times(1e8).toNumber();
    console.log('withdrawal amount');
    console.log(amount);
    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      ctx.reply('Minimum Withdrawal is 2 RUNES');
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    if (!isRunebaseAddress) {
      ctx.reply('Invalid Runebase Address');
    }

    if (amount >= (2 * 1e8) && amount % 1 === 0 && isRunebaseAddress) {
      const user = await db.user.findOne({
        where: {
          user_id: `telegram-${ctx.update.message.from.id}`,
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
      if (!user) {
        ctx.reply('User not found');
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.reply('Insufficient funds');
        }
        if (amount <= user.wallet.available) {
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
            locked: user.wallet.locked + amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const transaction = await db.transaction.create({
            addressId: wallet.addresses[0].id,
            phase: 'review',
            type: 'send',
            to_from: withdrawalAddress,
            amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const activity = await db.activity.create(
            {
              spenderId: user.id,
              type: 'withdrawRequested',
              amount,
              transactionId: transaction.id,
            },
            {
              transaction: t,
              lock: t.LOCK.UPDATE,
            },
          );
          ctx.reply('Withdrawal is being reviewed');
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong');
  });
};

export const fetchDiscordWalletBalance = async (message) => {
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

    const priceInfo = await db.priceInfo.findOne({
      where: {
        currency: 'USD',
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user && !user.wallet) {
      // ctx.reply(`Wallet not found`);
      await message.author.send("Wallet not found");
    }

    if (user && user.wallet) {
      const userId = user.user_id.replace('discord-', '');
      const directMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Balance')
        .setDescription(`<@${userId}>, I've sent you a direct message.`)
        .setThumbnail('https://downloads.runebase.io/logo-512x512.png')
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      const balanceMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Balance')
        .setDescription(`<@${userId}>'s current available balance: ${user.wallet.available / 1e8} RUNES
<@${userId}>'s current locked balance: ${user.wallet.locked / 1e8} RUNES
Estimated value of <@${userId}>'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`)
        .setThumbnail('https://downloads.runebase.io/logo-512x512.png')
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      console.log('messagechanneltype');
      console.log(message.channel.type);
      if (message.channel.type === 'DM') {
        await message.author.send({ embeds: [balanceMessage] });
      }
      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [directMessage] });
        await message.author.send({ embeds: [balanceMessage] });
      }
    }

    t.afterCommit(() => {
      logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
    });
  }).catch((err) => {
    logger.error(`Error Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
  });
};

export const fetchDiscordWalletDepositAddress = async (message) => {
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

    if (!user && !user.wallet && !user.wallet.addresses) {
      await message.author.send("Deposit Address not found");
    }

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');

      const userId = user.user_id.replace('discord-', '');

      const directMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Balance')
        .setDescription(`<@${userId}>, I've sent you a direct message.`)
        .setThumbnail('https://downloads.runebase.io/logo-512x512.png')
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');

      const depositAddressMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Deposit')
        .setDescription(`<@${userId}>'s deposit address:
*${user.wallet.addresses[0].address}*
        `)
        // .setThumbnail(Buffer.from(depositQrFixed, 'base64'))
        // .setImage(Buffer.from(depositQrFixed, 'base64'))
        // .attachFiles([file])
        // .setThumbnail("attachment://qr.png")
        .setImage("attachment://qr.png")
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');

      if (message.channel.type === 'DM') {
        await message.author.send({
          embeds: [depositAddressMessage],
          files: [new MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')],
        });
      }
      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [directMessage] });
        await message.author.send({
          embeds: [depositAddressMessage],
          files: [new MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')],
        });
      }
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
  });
};

/**
 * Fetch Wallet
 */
export const fetchWallet = async (req, res, next) => {
  console.log('Fetch wallet here');
  res.json({ success: true });
};
