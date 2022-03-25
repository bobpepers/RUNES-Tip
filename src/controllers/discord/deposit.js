import { MessageAttachment } from "discord.js";
import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  warnDirectMessage,
  depositAddressMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import logger from "../../helpers/logger";

export const fetchDiscordWalletDepositAddress = async (message, io) => {
  const activity = [];
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
        await message.author.send({
          embeds: [depositAddressMessage(userId, user)],
          files: [new MessageAttachment(Buffer.from(depositQrFixed, 'base64'), 'qr.png')],
        });
        await message.channel.send({ embeds: [warnDirectMessage(userId, 'Deposit')] });
      }

      const preActivity = await db.activity.create({
        type: 'deposit',
        earnerId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const finalActivity = await db.activity.findOne({
        where: {
          id: preActivity.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(finalActivity);
    }
    t.afterCommit(() => {
      logger.info(`Success Deposit Address Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'deposit',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`Error Deposit Address Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);
    console.log(err.code);
    if (err.code && err.code === 50007) {
      await message.channel.send({ embeds: [cannotSendMessageUser("Deposit", message)] }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({ embeds: [discordErrorMessage("Deposit")] }).catch((e) => {
        console.log(e);
      });
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
