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
  generalErrorMessage,
  withdrawalReviewMessage,
} from '../../messages/telegram';
import settings from '../../config/settings';

import logger from "../../helpers/logger";

export const withdrawTelegramCreate = async (ctx, withdrawalAddress, withdrawalAmount, io) => {
  logger.info(`Start Withdrawal Request: ${ctx.update.message.from.id}-${ctx.update.message.from.username}`);
  if (ctx.update.message.chat.type !== 'private') {
    await ctx.reply("i have send you a direct message");
  }

  // await ctx.telegram.sendMessage(ctx.update.message.from.id, balanceMessage(telegramUserName, user, priceInfo));
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const amount = new BigNumber(withdrawalAmount).times(1e8).toNumber();
    if (amount < Number(settings.min.withdrawal)) {
      ctx.reply(minimumWithdrawalMessage());
    }
    if (amount % 1 !== 0) {
      ctx.reply(invalidAmountMessage());
    }

    // Add new currencies here (default fallback Runebase)
    let isValidAddress = false;
    if (settings.coin.name === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    } else if (settings.coin.name === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(withdrawalAddress);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(withdrawalAddress);
    }
    //
    if (!isValidAddress) {
      ctx.telegram.sendMessage(ctx.update.message.from.id, invalidAddressMessage());
    }

    if (amount >= Number(settings.min.withdrawal) && amount % 1 === 0 && isValidAddress) {
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
        ctx.telegram.sendMessage(ctx.update.message.from.id, userNotFoundMessage());
      }
      if (user) {
        if (amount > user.wallet.available) {
          ctx.telegram.sendMessage(ctx.update.message.from.id, insufficientBalanceMessage());
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
          ctx.telegram.sendMessage(ctx.update.message.from.id, withdrawalReviewMessage());
        }
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply(generalErrorMessage());
  });
};
