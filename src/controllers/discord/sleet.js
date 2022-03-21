/* eslint-disable import/prefer-default-export */
import { Transaction, Op } from "sequelize";
import db from '../../models';
import {
  notEnoughActiveUsersMessage,
  // walletNotFoundMessage,
  AfterSuccessMessage,
  NotInDirectMessage,
  discordErrorMessage,
  invalidTimeMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/discord/validateAmount";
import { userWalletExist } from "../../helpers/discord/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";

import logger from "../../helpers/logger";

export const discordSleet = async (
  client,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
  queue,
) => {
  const activity = [];
  let userActivity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (!groupTask || !channelTask) {
      await message.channel.send({ embeds: [NotInDirectMessage(message, 'Sleet')] }).catch((e) => {
        console.log(e);
      });
      return;
    }

    [
      user,
      userActivity,
    ] = await userWalletExist(
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
        groupId: `discord-${message.guildId}`,
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
      await message.channel.send("Group not found");
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
      await message.channel.send({ embeds: [invalidTimeMessage(message, 'Sleet')] });
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
            user_id: { [Op.not]: `discord-${message.author.id}` },
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
      await message.channel.send({ embeds: [notEnoughActiveUsersMessage(message, 'Sleet')] });
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
        channelId: channelTask.id,
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
          channelId: channelTask.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (sleetee.ignoreMe) {
          listOfUsersRained.push(`${sleetee.username}`);
        } else {
          const userIdTest = sleetee.user_id.replace('discord-', '');
          listOfUsersRained.push(`<@${userIdTest}>`);
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
      const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const element of cutStringListUsers) {
        // eslint-disable-next-line no-await-in-loop
        await message.channel.send(element);
      }

      await message.channel.send({
        embeds: [
          AfterSuccessMessage(
            message,
            sleetRecord.id,
            amount,
            usersToRain,
            amountPerUser,
            'Sleet',
            'sleeted',
          ),
        ],
      });
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
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`sleet error: ${err}`);
    await message.channel.send({ embeds: [discordErrorMessage("Sleet")] }).catch((e) => {
      console.log(e);
    });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
