/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  tipSingleSuccessMessage,
  tipMultipleSuccessMessage,
  notInDirectMessage,
  notEnoughUsers,
  errorMessage,
  userListMessage,
} from '../../messages/matrix';
import { validateAmount } from "../../helpers/matrix/validateAmount";
import { waterFaucet } from "../../helpers/waterFaucet";
import { userWalletExist } from "../../helpers/matrix/userWalletExist";

import logger from "../../helpers/logger";

export const tipRunesToMatrixUser = async (
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
  const activity = [];
  let user;
  let AmountPosition = 1;
  let AmountPositionEnded = false;
  const usersToTip = [];
  let type = 'split';
  let userActivity;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (isCurrentRoomDirectMessage) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notInDirectMessage(
          message,
          'Tip',
        ),
      );
      return;
    }

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

    // make users to tip array
    while (!AmountPositionEnded) {
      let matrixId;
      if (filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
        const linkRx = /<a[^>]*href=["']([^"']*)["']/g;
        // const link = filteredMessage[AmountPosition].match(linkRx);
        const link = linkRx.exec(filteredMessage[parseInt(AmountPosition, 10)]);
        matrixId = link[1].split("/").pop();
      }

      console.log(matrixId);
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `matrix-${matrixId}`,
        },
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            required: true,
            include: [
              {
                model: db.address,
                as: 'addresses',
                required: true,
              },
            ],
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (userExist) {
        const userIdTest = userExist.user_id.replace('matrix-', '');
        if (userIdTest !== message.sender.userId) {
          if (!usersToTip.find((o) => o.id === userExist.id)) {
            usersToTip.push(userExist);
          }
        }
      }
      AmountPosition += 1;
      if (!filteredMessage[parseInt(AmountPosition, 10)].startsWith('<a')) {
        AmountPositionEnded = true;
      }
    }

    if (usersToTip.length < 1) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notEnoughUsers(
          message,
          'Tip',
        ),
      );
      return;
    }

    if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
      type = 'each';
    }
    // verify amount
    console.log(filteredMessage[parseInt(AmountPosition, 10)]);
    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      matrixClient,
      message,
      t,
      filteredMessage[parseInt(AmountPosition, 10)],
      user,
      setting,
      'tip',
      type,
      usersToTip,
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    //
    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const userTipAmount = (amount - Number(fee)) / usersToTip.length;

    const faucetWatered = await waterFaucet(
      t,
      Number(fee),
      faucetSetting,
    );
    const tipRecord = await db.tip.create({
      feeAmount: fee,
      amount,
      type,
      userCount: usersToTip.length,
      userId: user.id,
      groupId: groupTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      amount,
      type: 'tip_s',
      spenderId: user.id,
      tipId: tipRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
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
          model: db.tip,
          as: 'tip',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.unshift(finalActivity);

    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tipee of usersToTip) {
      // eslint-disable-next-line no-await-in-loop
      const tipeeWallet = await tipee.wallet.update({
        available: tipee.wallet.available + Number(userTipAmount),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const tiptipRecord = await db.tiptip.create({
        amount: Number(userTipAmount),
        userId: tipee.id,
        tipId: tipRecord.id,
        groupId: groupTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(userTipAmount),
        type: 'tiptip_s',
        spenderId: user.id,
        earnerId: tipee.id,
        tipId: tipRecord.id,
        tiptipId: tiptipRecord.id,
        earner_balance: tipeeWallet.available + tipeeWallet.locked,
        spender_balance: updatedBalance.available + updatedBalance.locked,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.findOne({
        where: {
          id: tipActivity.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
          {
            model: db.user,
            as: 'spender',
          },
          {
            model: db.tip,
            as: 'tip',
          },
          {
            model: db.tiptip,
            as: 'tiptip',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(tipActivity);
      if (tipee.ignoreMe) {
        listOfUsersRained.push(`${tipee.username}`);
      } else {
        const userIdReceivedRain = tipee.user_id.replace('matrix-', '');
        listOfUsersRained.push(`<a href="https://matrix.to/#/${userIdReceivedRain}">${tipee.username}</a>`);
      }
    }

    if (listOfUsersRained.length === 1) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        tipSingleSuccessMessage(
          message,
          tipRecord.id,
          listOfUsersRained,
          userTipAmount,
        ),
      );
    } else if (listOfUsersRained.length > 1) {
      const newStringListUsers = listOfUsersRained.join(", ");
      const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          userListMessage(
            element,
          ),
        );
      }

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        tipMultipleSuccessMessage(
          message,
          tipRecord.id,
          listOfUsersRained,
          userTipAmount,
          type,
        ),
      );
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'tip',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`tip error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Tip',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
