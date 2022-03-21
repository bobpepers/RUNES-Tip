/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import {
  afterSuccessMessage,
  notInDirectMessage,
  notEnoughUsers,
  userListMessage,
  errorMessage,
} from '../../messages/matrix';

import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/matrix/validateAmount";
import { mapMembers } from "../../helpers/matrix/mapMembers";
import { userWalletExist } from "../../helpers/matrix/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";

export const matrixFlood = async (
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
  let userActivity;
  let currentRoom;
  let members;
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (isCurrentRoomDirectMessage) {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notInDirectMessage(
          message,
          'Flood',
        ),
      );
      return;
    }

    currentRoom = await matrixClient.getRoom(message.sender.roomId);
    members = await currentRoom.getMembers();

    const onlineMembers = members.filter((member) => {
      console.log(member);
      console.log(member.presence);
      return member;
    });

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

    const withoutBots = await mapMembers(
      matrixClient,
      message,
      t,
      onlineMembers,
      setting,
    );

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      matrixClient,
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );

    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    if (withoutBots.length < 2) {
      const factivity = await db.activity.create({
        type: 'flood_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(factivity);

      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notEnoughUsers(),
      );
      return;
    }
    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
    const amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);

    const faucetWatered = await waterFaucet(
      t,
      Number(fee),
      faucetSetting,
    );

    const floodRecord = await db.flood.create({
      feeAmount: fee,
      amount,
      userCount: withoutBots.length,
      userId: user.id,
      groupId: groupTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const cactivity = await db.activity.create({
      amount,
      type: 'flood_s',
      spenderId: user.id,
      floodId: floodRecord.id,
      spender_balance: updatedBalance.available + updatedBalance.locked,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const activityCreate = await db.activity.findOne({
      where: {
        id: cactivity.id,
      },
      include: [
        {
          model: db.flood,
          as: 'flood',
        },
        {
          model: db.user,
          as: 'spender',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,

    });
    activity.unshift(activityCreate);
    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const floodee of withoutBots) {
      // eslint-disable-next-line no-await-in-loop
      const floodeeWallet = await floodee.wallet.update({
        available: floodee.wallet.available + Number(amountPerUser),
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      // eslint-disable-next-line no-await-in-loop
      const floodtipRecord = await db.floodtip.create({
        amount: amountPerUser,
        userId: floodee.id,
        floodId: floodRecord.id,
        groupId: groupTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (floodee.ignoreMe) {
        listOfUsersRained.push(`${floodee.username}`);
      } else {
        const userIdReceivedRain = floodee.user_id.replace('matrix-', '');
        listOfUsersRained.push(`<a href="https://matrix.to/#/${userIdReceivedRain}">${floodee.username}</a>`);
      }
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(amountPerUser),
        type: 'floodtip_s',
        spenderId: user.id,
        earnerId: floodee.id,
        floodId: floodRecord.id,
        floodtipId: floodtipRecord.id,
        earner_balance: floodeeWallet.available + floodeeWallet.locked,
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
            model: db.flood,
            as: 'flood',
          },
          {
            model: db.floodtip,
            as: 'floodtip',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(tipActivity);
    }

    const newStringListUsers = listOfUsersRained.join(", ");
    const cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g);
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
      afterSuccessMessage(
        message,
        floodRecord.id,
        amount,
        withoutBots,
        amountPerUser,
        'Flood',
        'flooded',
      ),
    );

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'flood',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`flood error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Flood',
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
