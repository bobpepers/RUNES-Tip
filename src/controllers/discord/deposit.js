import {
  MessageAttachment,
  ChannelType,
} from "discord.js";
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
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";

export const fetchDiscordWalletDepositAddress = async (message, io) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      'deposit',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    if (user && user.wallet && !user.wallet.addresses) {
      await message.author.send("Deposit Address not found");
      return;
    }

    const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
    const depositQrFixed = depositQr.replace('data:image/png;base64,', '');

    const userId = user.user_id.replace('discord-', '');

    if (message.channel.type === ChannelType.DM) {
      await message.author.send({
        embeds: [
          depositAddressMessage(
            userId,
            user,
          ),
        ],
        files: [
          {
            attachment: Buffer.from(
              depositQrFixed,
              'base64',
            ),
            name: 'qr.png',
          },
        ],
      });
    }
    if (message.channel.type === ChannelType.GuildText) {
      await message.author.send({
        embeds: [
          depositAddressMessage(
            userId,
            user,
          ),
        ],
        files: [
          {
            attachment: Buffer.from(
              depositQrFixed,
              'base64',
            ),
            name: 'qr.png',
          },
        ],
      });
      await message.channel.send({
        embeds: [
          warnDirectMessage(
            userId,
            'Deposit',
          ),
        ],
      });
    }

    const preActivity = await db.activity.create({
      type: 'deposit_s',
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

    t.afterCommit(() => {
      console.log(`Success Deposit Address Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
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
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Deposit",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage("Deposit"),
        ],
      }).catch((e) => {
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
