/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import BigNumber from "bignumber.js";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  minimumWithdrawalMessage,
  invalidAmountMessage,
  invalidAddressMessage,
  userNotFoundMessage,
  insufficientBalanceMessage,
  reviewMessage,
  warnDirectMessage,
} from '../../messages/discord';
import settings from '../../config/settings';
import logger from "../../helpers/logger";
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

    if (amount < Number(settings.min.withdrawal)) { // smaller then 2 RUNES
      await message.author.send({ embeds: [minimumWithdrawalMessage(message)] });
    }

    if (amount % 1 !== 0) {
      await message.author.send({ embeds: [invalidAmountMessage(message, 'Withdraw')] });
    }

    // Add new currencies here (default fallback Runebase)
    let isValidAddress = false;
    if (settings.coin.name === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    } else if (settings.coin.name === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(filteredMessage[2]);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    }
    //

    if (!isValidAddress) {
      await message.author.send({ embeds: [invalidAddressMessage(message)] });
    }
    if (amount >= Number(settings.min.withdrawal) && amount % 1 === 0 && isValidAddress) {
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
      console.log('5');
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
          console.log('6');
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
          const userId = user.user_id.replace('discord-', '');

          if (message.channel.type === 'DM') {
            await message.author.send({ embeds: [reviewMessage(message)] });
          }

          if (message.channel.type === 'GUILD_TEXT') {
            await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
            await message.author.send({ embeds: [reviewMessage(message)] });
          }
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
