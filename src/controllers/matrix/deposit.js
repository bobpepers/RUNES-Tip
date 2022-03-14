import { MessageAttachment } from "discord.js";
import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  warnDirectMessage,
  depositAddressMessage,
} from '../../messages/matrix';
import logger from "../../helpers/logger";

export const matrixWalletDepositAddress = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const user = await db.user.findOne({
      where: {
        user_id: `matrix-${message.sender.userId}`,
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
      const userId = user.user_id.replace('matrix-', '');

      const uploadResponse = await matrixClient.uploadContent(Buffer.from(depositQrFixed, 'base64'), { rawResponse: false, type: 'image/png' });
      console.log(uploadResponse);
      console.log('uploadResponse');
      const matrixUrl = uploadResponse.content_uri;

      if (message.sender.roomId === userDirectMessageRoomId) {
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          {
            msgtype: "m.image",
            url: matrixUrl,
            info: `${user.wallet.addresses[0].address}`,
            body: `${user.wallet.addresses[0].address}`,
          },
        );
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          depositAddressMessage(user),
        );
      } else {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          warnDirectMessage(message.sender.name, 'Deposit'),
        );
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          {
            msgtype: "m.image",
            url: matrixUrl,
            info: `${user.wallet.addresses[0].address}`,
            body: `${user.wallet.addresses[0].address}`,
          },
        );
        await matrixClient.sendEvent(
          userDirectMessageRoomId,
          "m.room.message",
          depositAddressMessage(user),
        );
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
      console.log(`Success Deposit Address Request`);
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
    logger.error(`Error Deposit Address Request: ${err}`);
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
