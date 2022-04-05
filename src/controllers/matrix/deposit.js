import { Transaction } from "sequelize";
import QRCode from "qrcode";
import db from '../../models';
import {
  warnDirectMessage,
  depositAddressMessage,
  walletNotFoundMessage,
} from '../../messages/matrix';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";

export const matrixWalletDepositAddress = async (
  matrixClient,
  message,
  userDirectMessageRoomId,
  isCurrentRoomDirectMessage,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      matrixClient,
      message,
      t,
      'deposit',
    );
    if (userActivity) {
      activity.unshift(userActivity);
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        walletNotFoundMessage(
          message,
          'Deposit',
        ),
      );
    }
    if (!user) return;

    if (user && user.wallet && user.wallet.addresses) {
      const depositQr = await QRCode.toDataURL(user.wallet.addresses[0].address);
      const depositQrFixed = depositQr.replace('data:image/png;base64,', '');
      const userId = user.user_id.replace('matrix-', '');

      const uploadResponse = await matrixClient.uploadContent(Buffer.from(depositQrFixed, 'base64'), { rawResponse: false, type: 'image/png' });
      const matrixUrl = uploadResponse.content_uri;

      if (isCurrentRoomDirectMessage) {
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
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          warnDirectMessage(message.sender.name, 'Deposit'),
        );
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
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
