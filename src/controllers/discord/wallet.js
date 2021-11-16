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
import { config } from "dotenv";
config();

import { MessageAttachment } from "discord.js";

import { Transaction, Op } from "sequelize";
import BigNumber from "bignumber.js";
// const qr = require('qr-image');
import QRCode from "qrcode";
import logger from "../../helpers/logger";

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
