import db from '../models';
import { getInstance } from '../services/rclient';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const qr = require('qr-image');
const QRCode = require('qrcode');
const logger = require('../helpers/logger');

const minimumTip = 1 * 1e6;
const minimumRain = 1 * 1e7;

export const rainRunesToUsers = async (ctx, runesTipSplit, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(runesTipSplit[2]).times(1e8).toNumber();
    console.log('rain amount');
    console.log(amount);
    if (amount < (minimumRain)) { // smaller then 2 RUNES
      ctx.reply(`Minimum Rain is ${minimumRain / 1e8} RUNES`);
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
      console.log('foudn the user for rain');
      if (user.wallet.available < amount) {
        ctx.reply('Insufficient Balance');
      }
      if (user.wallet.available >= amount) {
        console.log('rain 3');
        const usersToRain = await db.user.findAll({
          where: {
            [Op.and]: [
              {
                lastSeen: {
                  [Op.gte]: new Date(Date.now() - (3 * 60 * 60 * 1000)),
                },
              },
              {
                user_id: { [Op.not]: `telegram-${ctx.update.message.from.id}` },
              },
            ],
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
        console.log('rain 4');
        console.log(usersToRain);
        if (usersToRain.length < 2) {
          ctx.reply('not enough active users');
        }
        if (usersToRain.length >= 2) {
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
            console.log('after raintip create');
            listOfUsersRained.push(`@${rainee.username}`);
          }

          await ctx.reply(`Raining ${amount / 1e8} RUNES on ${usersToRain.length} active users -- ${amountPerUser / 1e8} RUNES each`);

          const newStringListUsers = listOfUsersRained.join(", ");
          console.log(newStringListUsers);
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
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong with raining');
  });
};

export const tipRunesToUser = async (ctx, runesTipSplit, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(runesTipSplit[3]).times(1e8).toNumber();
    console.log('tip amount');
    console.log(amount);
    if (amount < (minimumTip)) { // smaller then 2 RUNES
      ctx.reply('Minimum Tip is 0.01 RUNES');
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }
    console.log('1');
    const userToTip = runesTipSplit[2].substring(1);
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
    console.log('2');
    if (!findUserToTip) {
      ctx.reply('Unable to find user to tip');
    }

    if (amount >= (minimumTip) && amount % 1 === 0 && findUserToTip) {
      console.log('beforeuserfind');
      console.log(ctx.update.message.from.id);
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
      console.log('3');
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
          console.log('4');
          const updatedFindUserToTip = findUserToTip.wallet.update({
            available: findUserToTip.wallet.available + amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          console.log('5');
          console.log('----');
          console.log(user.id);
          console.log(findUserToTip.id);
          console.log(amount);
          console.log('----');

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
          bot.telegram.sendMessage(runesGroup, `${user.username} tipped ${amount / 1e8} RUNES to ${findUserToTip.username}`);
          logger.info(`Success tip Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} to ${findUserToTip.username} with ${amount / 1e8} RUNES`);
          // ctx.reply(`${user.username} tipped ${amount / 1e8} RUNES to ${updatedFindUserToTip.username}`);
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
export const withdrawTelegramCreate = async (ctx, runesTipSplit) => {
  logger.info(`Start Withdrawal Request: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(runesTipSplit[3]).times(1e8).toNumber();
    console.log('withdrawal amount');
    console.log(amount);
    if (amount < (2 * 1e8)) { // smaller then 2 RUNES
      ctx.reply('Minimum Withdrawal is 2 RUNES');
    }
    if (amount % 1 !== 0) {
      ctx.reply('Invalid amount');
    }
    const isRunebaseAddress = await getInstance().utils.isRunebaseAddress(runesTipSplit[2]);
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
            to_from: runesTipSplit[2],
            amount,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
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

export const fetchWalletBalance = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
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
      await ctx.reply(`${ctx.update.message.from.username}'s current available balance: ${user.wallet.available / 1e8} RUNES
${ctx.update.message.from.username}'s current locked balance: ${user.wallet.locked / 1e8} RUNES
Estimated value of ${ctx.update.message.from.username}'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(8)}`);
    }

    t.afterCommit(() => {
      logger.info(`Success Balance Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
    });
  }).catch((err) => {
    logger.error(`Error Balance Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} - ${err}`);
  });
};

export const fetchWalletDepositAddress = async (ctx) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
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

    if (!user && !user.wallet && !user.wallet.addresses) {
      ctx.reply(`Deposit Address not found`);
    }

    if (user && user.wallet && user.wallet.addresses) {
      // const qr_png = qr.image(user.wallet.addresses[0].address, { type: 'png' });
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      console.log(user.wallet.addresses);
      console.log(depositQrFixed);
      // console.log(qr_png);
      await ctx.replyWithPhoto(
        {
          source: Buffer.from(depositQrFixed, 'base64'),
        }, {
          caption: `${ctx.update.message.from.username}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
          parse_mode: 'MarkdownV2',
        },
      );
      // ctx.replyWithPhoto(depositQrFixed, {caption:'Your caption here'});
      await ctx.reply(`${ctx.update.message.from.username}'s deposit address: 
*${user.wallet.addresses[0].address}*`,
      { parse_mode: 'MarkdownV2' });
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} - ${err}`);
  });
};

/**
 * Fetch Wallet
 */
export const fetchWallet = async (req, res, next) => {
  console.log('Fetch wallet here');
  res.json({ success: true });
};
