/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  invalidAddressMessage,
  reviewMessage,
  warnDirectMessage,
  errorMessage,
  nodeOfflineMessage,
} from '../../messages/matrix';
import getCoinSettings from '../../config/settings';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/matrix/validateAmount";
import { userWalletExist } from "../../helpers/client/matrix/userWalletExist";

const settings = getCoinSettings();

export const withdrawMatrixCreate = async (
  matrixClient,
  message,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
  queue,
  userDirectMessageRoomId,
  isCurrentRoomDirectMessage,
) => {
  let user;
  const activity = [];
  let userActivity;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      userActivity,
    ] = await userWalletExist(
      matrixClient,
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;
    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      matrixClient,
      message,
      t,
      filteredMessage[3],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    // Add new currencies here (default fallback Runebase)
    let isValidAddressInfo = false;
    if (settings.coin.setting === 'Runebase') {
      try {
        isValidAddressInfo = await getInstance().getAddressInfo(filteredMessage[2]);
      } catch (e) {
        if (e.response && e.response.status === 500) {
          await matrixClient.sendEvent(
            message.sender.roomId,
            "m.room.message",
            invalidAddressMessage(
              message,
            ),
          );
          return;
        }
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          nodeOfflineMessage(),
        );
        return;
      }
    }

    // Add new currencies here (default fallback Runebase)
    let isValidAddress = false;
    if (settings.coin.setting === 'Runebase') {
      isValidAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    } else if (settings.coin.setting === 'Pirate') {
      isValidAddress = await getInstance().utils.isPirateAddress(filteredMessage[2]);
    } else if (settings.coin.setting === 'Komodo') {
      isValidAddress = await getInstance().utils.isKomodoAddress(filteredMessage[2]);
    } else {
      isValidAddress = await getInstance().utils.isRunebaseAddress(filteredMessage[2]);
    }
    //

    if (!isValidAddress) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        invalidAddressMessage(
          message,
        ),
      );
      return;
    }

    let addressExternal;
    let UserExternalAddressMnMAssociation;

    addressExternal = await db.addressExternal.findOne({
      where: {
        address: filteredMessage[2],
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!addressExternal) {
      addressExternal = await db.addressExternal.create({
        address: filteredMessage[2],
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    UserExternalAddressMnMAssociation = await db.UserAddressExternal.findOne({
      where: {
        addressExternalId: addressExternal.id,
        userId: user.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!UserExternalAddressMnMAssociation) {
      UserExternalAddressMnMAssociation = await db.UserAddressExternal.create({
        addressExternalId: addressExternal.id,
        userId: user.id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    const wallet = await user.wallet.update({
      available: user.wallet.available - amount,
      locked: user.wallet.locked + amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const transaction = await db.transaction.create({
      addressId: wallet.addresses[0].id,
      addressExternalId: addressExternal.id,
      phase: 'review',
      type: 'send',
      to_from: filteredMessage[2],
      amount,
      feeAmount: Number(fee),
      userId: user.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const activityCreate = await db.activity.create(
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
    activity.unshift(activityCreate);
    // const userId = user.user_id.replace('matrix-', '');

    if (message.sender.roomId === userDirectMessageRoomId) {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        reviewMessage(
          message,
          transaction,
        ),
      );
    } else {
      await matrixClient.sendEvent(
        userDirectMessageRoomId,
        "m.room.message",
        reviewMessage(
          message,
          transaction,
        ),
      );
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        warnDirectMessage(message.sender.name, 'Withdraw'),
      );
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'withdraw',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`withdraw error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          "Withdraw",
        ),
      );
    } catch (e) {
      console.log(e);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
