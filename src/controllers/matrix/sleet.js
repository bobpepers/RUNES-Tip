/* eslint-disable import/prefer-default-export */
import { Transaction, Op } from "sequelize";
import db from '../../models';
import { validateAmount } from "../../helpers/matrix/validateAmount";
import { userWalletExist } from "../../helpers/matrix/userWalletExist";
import { waterFaucet } from "../../helpers/discord/waterFaucet";

import logger from "../../helpers/logger";

import {
  groupNotFoundMessage,
  notInDirectMessage,
  invalidTimeMessage,
  errorMessage,
  afterSuccessMessage,
  notEnoughUsers,
  userListMessage,
} from '../../messages/matrix';

export const matrixSleet = async (
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
  if (isCurrentRoomDirectMessage) {
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        notInDirectMessage(
          message,
          'Flood',
        ),
      );
    } catch (err) {
      console.log(err);
    }
    // await message.channel.send({ embeds: [NotInDirectMessage(message, 'Flood')] });
    return;
  }
  const activity = [];
  let userActivity;
  let user;
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
      filteredMessage[2],
      user,
      setting,
      filteredMessage[1].toLowerCase(),
    );
    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    const group = await db.group.findOne({
      where: {
        id: groupTask.id,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!group) {
      const groupFailActivity = await db.activity.create({
        type: 'sleet_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(groupFailActivity);
      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          groupNotFoundMessage(),
        );
      } catch (err) {
        console.log(err);
      }
      return;
    }
    let textTime;
    let cutLastTimeLetter;
    let cutNumberTime;
    let isnum;
    let lastSeenOptions = { [Op.gte]: new Date(Date.now() - (15 * 60 * 1000)) };
    // Optional Timer
    if (filteredMessage[3]) {
      // eslint-disable-next-line prefer-destructuring
      textTime = filteredMessage[3];
      cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
      cutNumberTime = textTime.substring(0, textTime.length - 1);
      isnum = /^\d+$/.test(cutNumberTime);
    }
    if (
      (filteredMessage[3]
        && !isnum)
      // && Number(cutNumberTime) < 0
      && (
        cutLastTimeLetter !== 'd'
        || cutLastTimeLetter !== 'h'
        || cutLastTimeLetter !== 'm'
        || cutLastTimeLetter !== 's')
    ) {
      console.log('not pass');
      console.log(user.id);
      const activityA = await db.activity.create({
        type: 'sleet_i',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityA);
      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          invalidTimeMessage(message, 'Sleet'),
        );
      } catch (err) {
        console.log(err);
      }
      return;
    }

    if (
      (filteredMessage[2]
        && isnum)
      // && Number(cutNumberTime) < 0
      && (
        cutLastTimeLetter === 'd'
        || cutLastTimeLetter === 'h'
        || cutLastTimeLetter === 'm'
        || cutLastTimeLetter === 's')
    ) {
      let dateObj = await new Date().getTime();
      if (cutLastTimeLetter === 'd') {
        dateObj -= Number(cutNumberTime) * 24 * 60 * 60 * 1000;
      }
      if (cutLastTimeLetter === 'h') {
        dateObj -= Number(cutNumberTime) * 60 * 60 * 1000;
      }
      if (cutLastTimeLetter === 'm') {
        dateObj -= Number(cutNumberTime) * 60 * 1000;
      }
      if (cutLastTimeLetter === 's') {
        dateObj -= Number(cutNumberTime) * 1000;
      }
      dateObj = await new Date(dateObj);
      lastSeenOptions = { [Op.gte]: dateObj };
    }
    //

    const usersToRain = await db.user.findAll({
      where: {
        [Op.and]: [
          {
            user_id: { [Op.not]: `matrix-${message.sender.userId}` },
          },
          {
            banned: false,
          },
        ],
      },
      include: [
        {
          model: db.active,
          as: 'active',
          // required: false,
          where: {
            [Op.and]: [
              {
                lastSeen: lastSeenOptions,
              },
              {
                groupId: group.id,
              },
            ],
          },
        },
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (usersToRain.length < 2) {
      const failActivity = await db.activity.create({
        type: 'sleet_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(failActivity);
      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          notEnoughUsers(
            message,
            'Sleet',
          ),
        );
      } catch (err) {
        console.log(err);
      }
      return;
    }
    if (usersToRain.length >= 2) {
      const updatedBalance = await user.wallet.update({
        available: user.wallet.available - amount,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const fee = ((amount / 100) * (setting.fee / 1e2)).toFixed(0);
      const amountPerUser = ((amount - Number(fee)) / usersToRain.length).toFixed(0);
      const faucetWatered = await waterFaucet(
        t,
        Number(fee),
        faucetSetting,
      );

      const sleetRecord = await db.sleet.create({
        feeAmount: fee,
        amount,
        userCount: usersToRain.length,
        userId: user.id,
        groupId: groupTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const preActivity = await db.activity.create({
        amount,
        type: 'sleet_s',
        spenderId: user.id,
        sleetId: sleetRecord.id,
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
            model: db.sleet,
            as: 'sleet',
          },
          {
            model: db.user,
            as: 'spender',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.push(finalActivity);
      const listOfUsersRained = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const sleetee of usersToRain) {
        // eslint-disable-next-line no-await-in-loop
        const sleeteeWallet = await sleetee.wallet.update({
          available: sleetee.wallet.available + Number(amountPerUser),
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        // eslint-disable-next-line no-await-in-loop
        const sleettipRecord = await db.sleettip.create({
          amount: Number(amountPerUser),
          userId: sleetee.id,
          sleetId: sleetRecord.id,
          groupId: groupTask.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (sleetee.ignoreMe) {
          listOfUsersRained.push(`${sleetee.username}`);
        } else {
          const userIdReceivedSleet = sleetee.user_id.replace('matrix-', '');
          listOfUsersRained.push(`<a href="https://matrix.to/#/${userIdReceivedSleet}">${sleetee.username}</a>`);
        }
        let tipActivity;
        // eslint-disable-next-line no-await-in-loop
        tipActivity = await db.activity.create({
          amount: Number(amountPerUser),
          type: 'sleettip_s',
          spenderId: user.id,
          earnerId: sleetee.id,
          sleetId: sleetRecord.id,
          sleettipId: sleettipRecord.id,
          earner_balance: sleeteeWallet.available + sleeteeWallet.locked,
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
              model: db.sleet,
              as: 'sleet',
            },
            {
              model: db.sleettip,
              as: 'sleettip',
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
        try {
          // eslint-disable-next-line no-await-in-loop
          await matrixClient.sendEvent(
            message.sender.roomId,
            "m.room.message",
            userListMessage(
              element,
            ),
          );
        } catch (err) {
          console.log(err);
        }
        // await message.channel.send(element);
      }

      try {
        await matrixClient.sendEvent(
          message.sender.roomId,
          "m.room.message",
          afterSuccessMessage(
            message,
            sleetRecord.id,
            amount,
            usersToRain,
            amountPerUser,
            'Sleet',
            'sleeted',
          ),
        );
      } catch (err) {
        console.log(err);
      }
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'sleet',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`sleet error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Sleet',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
