/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumTipMessage,
  unableToFindUserTipMessage,
  userNotFoundMessage,
  tipSuccessMessage,
} from '../../messages/discord';

const BigNumber = require('bignumber.js');
const { Transaction, Op } = require('sequelize');
const logger = require('../../helpers/logger');

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
            await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Tip')] });
            // ctx.reply('Insufficient funds');
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

            const userId = user.user_id.replace('discord-', '');
            const userIdTipped = findUserToTip.user_id.replace('discord-', '');

            await message.channel.send({ embeds: [tipSuccessMessage(userId, userIdTipped, amount)] });
            logger.info(`Success tip Requested by: ${user.user_id}-${user.username} to ${findUserToTip.user_id}-${findUserToTip.username} with ${amount / 1e8} ${process.env.CURRENCY_SYMBOL}`);
          }
        }
      }
    }

    t.afterCommit(() => {
      console.log('Done');
    });
  }).catch((err) => {
    message.channel.send("Somethign went wrong.");
  });
};
