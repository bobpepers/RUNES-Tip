import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  minimumWithdrawalMessage,
  invalidAmountMessage,
  invalidAddressMessage,
  userNotFoundMessage,
  insufficientBalanceMessage,
  reviewMessage,
  minimumTipMessage,
  minimumFloodMessage,
  minimumSleetMessage,
  minimumRainMessage,
  walletNotFoundMessage,
  notEnoughActiveUsersMessage,
  AfterSleetSuccessMessage,
  AfterFloodSuccessMessage,
  AfterRainSuccessMessage,
  unableToFindUserTipMessage,
  tipSuccessMessage,
  warnDirectMessage,
  depositAddressMessage,
  balanceMessage,
} from '../../messages/discord';

require('dotenv').config();

const { MessageAttachment } = require('discord.js');

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
// const qr = require('qr-image');
const QRCode = require('qrcode');
const logger = require('../../helpers/logger');

/**
 * Create Withdrawal
 */
export const withdrawDiscordCreate = async (message, filteredMessage) => {
  console.log(filteredMessage);
  logger.info(`Start Withdrawal Request: ${message.author.id}-${message.author.username}`);
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

    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      await message.author.send({ embeds: [minimumWithdrawalMessage(message)] });
    }
    if (amount % 1 !== 0) {
      await message.author.send({ embeds: [invalidAmountMessage(message, 'Withdraw')] });
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    if (!isRunebaseAddress) {
      await message.author.send({ embeds: [invalidAddressMessage(message)] });
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
        await message.author.send({ embeds: [userNotFoundMessage(message, 'Withdraw')] });
      }
      if (user) {
        if (amount > user.wallet.available) {
          await message.author.send({ embeds: [insufficientBalanceMessage(message, 'Withdraw')] });
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

          await message.author.send({ embeds: [reviewMessage(message)] });
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
    if (amount < Number(process.env.MINIMUM_RAIN)) { // smaller then 2 RUNES
      await message.channel.send({ embeds: [minimumRainMessage(message)] });
    }
    if (amount % 1 !== 0) {
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Rain')] });
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
        await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Rain')] });
      }
      if (user) {
        if (user.wallet.available < amount) {
          await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Rain')] });
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

            await message.channel.send({ embeds: [AfterRainSuccessMessage(message, amount, withoutBots, amountPerUser)] });
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
      await message.channel.send({ embeds: [invalidAmountMessage(message, 'Tip')] });
    } else if (amount < Number(process.env.MINIMUM_TIP)) { // smaller then 0.01 RUNES
      await message.channel.send({ embeds: [minimumTipMessage(message)] });
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
        await message.channel.send({ embeds: [unableToFindUserTipMessage] });
      }

      if (amount >= Number(process.env.MINIMUM_TIP) && amount % 1 === 0 && findUserToTip) {
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
          await message.channel.send({ embeds: [userNotFoundMessage(message, 'Tip')] });
        }
        if (user) {
          if (amount > user.wallet.available) {
            await message.channel.send({ embeds: [insufficientBalanceMessage(message)] });
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

            await message.channel.send({ embeds: [tipSuccessMessage(userId, userIdTipped, amount)] });
            logger.info(`Success tip Requested by: ${user.user_id}-${user.username} to ${findUserToTip.user_id}-${findUserToTip.username} with ${amount / 1e8} ${process.env.CURRENCY_SYMBOL}`);
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
      ctx.reply(`Minimum Withdrawal is 2 ${process.env.CURRENCY_SYMBOL}`);
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

      if (message.channel.type === 'DM') {
        await message.author.send({ embeds: [balanceMessage(userId, user, priceInfo)] });
      }
      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
        await message.author.send({ embeds: [balanceMessage(userId, user, priceInfo)] });
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

      if (message.channel.type === 'DM') {
        await message.author.send({
          embeds: [depositAddressMessage(userId, user)],
          files: [new MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')],
        });
      }
      if (message.channel.type === 'GUILD_TEXT') {
        await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
        await message.author.send({
          embeds: [depositAddressMessage(userId, user)],
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
