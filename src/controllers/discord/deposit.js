import { MessageAttachment } from "discord.js";
import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  warnDirectMessage,
  depositAddressMessage,
} from '../../messages/discord';
import logger from "../../helpers/logger";

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
