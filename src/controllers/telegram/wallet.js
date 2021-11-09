import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  depositAddressMessage,
  minimumWithdrawalMessage,
  invalidAmountMessage,
  invalidAddressMessage,
  userNotFoundMessage,
  unableToFindUserMessage,
  insufficientBalanceMessage,
  notEnoughActiveUsersMessage,
  minimumRainMessage,
  rainSuccessMessage,
  rainErrorMessage,
  groupNotFoundMessage,
  minimumTipMessage,
  tipSuccessMessage,
  somethingWentWrongMessage,
  withdrawalReviewMessage,
  depositAddressNotFoundMessage,
  balanceMessage,
} from '../../messages/telegram';

require('dotenv').config();

const { Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const QRCode = require('qrcode');
const logger = require('../../helpers/logger');

export const rainRunesToUsers = async (ctx, rainAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(rainAmount).times(1e8).toNumber();

    if (amount < Number(process.env.MINIMUM_RAIN)) { // smaller then 2 RUNES
      ctx.reply(minimumRainMessage());
    }
    if (amount % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
    }

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
      ctx.reply(userNotFoundMessage());
    }
    if (user) {
      if (user.wallet.available < amount) {
        ctx.reply(insufficientBalanceMessage());
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
            ctx.reply(notEnoughActiveUsersMessage());
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

            await ctx.reply(rainSuccessMessage(amount, usersToRain, amountPerUser));

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
          await ctx.reply(groupNotFoundMessage());
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(rainErrorMessage());
  });
};

export const tipRunesToUser = async (ctx, tipTo, tipAmount, bot, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(tipAmount).times(1e8).toNumber();
    if (amount < Number(process.env.MINIMUM_TIP)) { // smaller then 2 RUNES
      ctx.reply(minimumTipMessage());
    }
    if (amount % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
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
      ctx.reply(unableToFindUserMessage());
    }

    if (amount >= Number(process.env.MINIMUM_TIP) && amount % 1 === 0 && findUserToTip) {
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
        ctx.reply(userNotFoundMessage());
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.reply(insufficientBalanceMessage());
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

          ctx.reply(tipSuccessMessage(user, amount, findUserToTip));
          logger.info(`Success tip Requested by: ${ctx.update.message.from.id}-${ctx.update.message.from.username} to ${findUserToTip.username} with ${amount / 1e8} ${process.env.CURRENCY_SYMBOL}`);
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(somethingWentWrongMessage());
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
    if (amount < Number(process.env.MINIMUM_WITHDRAWAL)) { // smaller then 2 RUNES
      ctx.reply(minimumWithdrawalMessage());
    }
    if (amount % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
    }

    // Add new currencies here (default fallback Runebase)
    let isValidAddress = false;
    if (process.env.CURRENCY_NAME === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    } else if (process.env.CURRENCY_NAME === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(withdrawalAddress);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    }
    //
    if (!isValidAddress) {
      ctx.reply(invalidAddressMessage());
    }

    if (amount >= Number(process.env.MINIMUM_WITHDRAWAL) && amount % 1 === 0 && isValidAddress) {
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
        ctx.reply(userNotFoundMessage());
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.reply(insufficientBalanceMessage());
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
          ctx.reply(withdrawalReviewMessage());
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(somethingWentWrongMessage());
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
      await ctx.reply(balanceMessage(telegramUserName, user, priceInfo));
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
      ctx.reply(depositAddressNotFoundMessage());
    }

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      await ctx.replyWithPhoto(
        {
          source: Buffer.from(depositQrFixed, 'base64'),
        }, {
          caption: depositAddressMessage(telegramUserName, user),
          parse_mode: 'MarkdownV2',
        },
      );

      await ctx.reply(depositAddressMessage(telegramUserName, user),
        { parse_mode: 'MarkdownV2' });
    }

    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${telegramUserId}-${telegramUserName}`);
    });
  }).catch((err) => {
    logger.error(`Error Deposit Address Requested by: ${telegramUserId}-${telegramUserName} - ${err}`);
  });
};
