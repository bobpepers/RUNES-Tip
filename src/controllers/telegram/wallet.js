import db from '../../models';
import { getInstance } from '../../services/rclient';

require('dotenv').config();

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const QRCode = require('qrcode');
const logger = require('../../helpers/logger');

const minimumTip = 1 * 1e6;
const minimumRain = 1 * 1e7;

export const rainRunesToUsers = async (ctx, rainAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(rainAmount).times(1e8).toNumber();

    if (amount < (minimumRain)) { // smaller then 2 RUNES
      ctx.reply(`Minimum Rain is ${minimumRain / 1e8} ${process.env.CURRENCY_SYMBOL}`);
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }
    console.log('rain 1');
    // const userToTip = runesTipSplit[2].substring(1);
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${ctx.update.message.from.id}`,
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
      ctx.reply('User Not Found');
    }
    if (user) {
      if (user.wallet.available < amount) {
        ctx.reply('Insufficient Balance');
      }
      if (user.wallet.available >= amount) {
        const group = await db.group.findOne({
          where: {
            groupId: `telegram-${ctx.update.message.chat.id}`,
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (group) {
          const usersToRain = await db.user.findAll({
            where: {
              [Op.and]: [
                {
                  user_id: { [Op.not]: `telegram-${ctx.update.message.from.id}` },
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
                        [Op.gte]: new Date(Date.now() - (3 * 60 * 60 * 1000)),
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
          if (usersToRain.length < 2) {
            ctx.reply('not enough active users');
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
              // eslint-disable-next-line no-await-in-loop
              await rainee.wallet.update({
                available: rainee.wallet.available + Number(amountPerUser),
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              // eslint-disable-next-line no-await-in-loop
              await db.raintip.create({
                amount: amountPerUser,
                userId: rainee.id,
                rainId: rainRecord.id,
              }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
              });
              listOfUsersRained.push(`@${rainee.username}`);
            }

            await ctx.reply(`Raining ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`);

            const newStringListUsers = listOfUsersRained.join(", ");
            const cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g);
            // eslint-disable-next-line no-restricted-syntax
            for (const element of cutStringListUsers) {
              // eslint-disable-next-line no-await-in-loop
              await ctx.reply(element);
            }
            logger.info(`Success Rain Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} for ${amount / 1e8}`);
            // cutStringListUsers.forEach((element) => ctx.reply(element));
          }
        }
        if (!group) {
          await ctx.reply('Group not found');
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with raining');
  });
};

export const tipRunesToUser = async (ctx, tipTo, tipAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(tipAmount).times(1e8).toNumber();
    if (amount < (minimumTip)) { // smaller then 2 RUNES
      ctx.reply(`Minimum Tip is 0.01 ${process.env.CURRENCY_SYMBOL}`);
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }

    const userToTip = tipTo.substring(1);
    const findUserToTip = await db.user.findOne({
      where: {
        username: userToTip,
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
    if (!findUserToTip) {
      ctx.reply('Unable to find user to tip');
    }

    if (amount >= (minimumTip) && amount % 1 === 0 && findUserToTip) {
      const user = await db.user.findOne({
        where: {
          user_id: `telegram-${ctx.update.message.from.id}`,
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
        ctx.reply('User not found');
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.reply('Insufficient funds');
        }
        if (amount <= user.wallet.available) {
          const wallet = await user.wallet.update({
            available: user.wallet.available - amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
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
          ctx.reply(`@${user.username} tipped ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} to @${findUserToTip.username}`);
          logger.info(`Success tip Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} to ${findUserToTip.username} with ${amount / 1e8} ${process.env.CURRENCY_SYMBOL}`);
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
    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      ctx.reply(`Minimum ${process.env.CURRENCY_SYMBOL} is 2 ${process.env.CURRENCY_SYMBOL}`);
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

export const fetchWalletBalance = async (ctx, telegramUserId, telegramUserName) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${telegramUserId}`,
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
      ctx.reply(`Wallet not found`);
    }

    if (user && user.wallet) {
      await ctx.reply(`${telegramUserName}'s current available balance: ${user.wallet.available / 1e8} ${process.env.CURRENCY_SYMBOL}
${telegramUserName}'s current locked balance: ${user.wallet.locked / 1e8} ${process.env.CURRENCY_SYMBOL}
Estimated value of ${telegramUserName}'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`);
    }

    t.afterCommit(() => {
      logger.info(`Success Balance Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    logger.error(`Error Balance Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};

export const fetchWalletDepositAddress = async (ctx, telegramUserId, telegramUserName) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `telegram-${telegramUserId}`,
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
      ctx.reply(`Deposit Address not found`);
    }

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      await ctx.replyWithPhoto(
        {
          source: Buffer.from(depositQrFixed, 'base64'),
        }, {
          caption: `${telegramUserName}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
          parse_mode: 'MarkdownV2',
        },
      );

      await ctx.reply(`${telegramUserName}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
      { parse_mode: 'MarkdownV2' });
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};
