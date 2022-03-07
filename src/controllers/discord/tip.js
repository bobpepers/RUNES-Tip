/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  tipSingleSuccessMessage,
  tipMultipleSuccessMessage,
  NotInDirectMessage,
  notEnoughUsersToTip,
  tipFaucetSuccessMessage,
  discordErrorMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/discord/validateAmount";
import { waterFaucet } from "../../helpers/discord/waterFaucet";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

import logger from "../../helpers/logger";

export const tipRunesToDiscordUser = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
  queue,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Tip')] });
    return;
  }
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
    console.log(usersToTip);
    console.log(AmountPosition);
    console.log(type);

    // make users to tip array
    while (!AmountPositionEnded) {
      let discordId;
      if (filteredMessage[AmountPosition].startsWith('<@!')) {
        discordId = filteredMessage[AmountPosition].slice(3).slice(0, -1);
      } else if (
        filteredMessage[AmountPosition].startsWith('<@')
        && !filteredMessage[AmountPosition].startsWith('<@!')
      ) {
        discordId = filteredMessage[AmountPosition].slice(2).slice(0, -1);
      }

      console.log(discordId);
      // eslint-disable-next-line no-await-in-loop
      const userExist = await db.user.findOne({
        where: {
          user_id: `discord-${discordId}`,
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
        const userIdTest = userExist.user_id.replace('discord-', '');
        if (userIdTest !== message.author.id) {
          if (!usersToTip.find((o) => o.id === userExist.id)) {
            usersToTip.push(userExist);
          }
        }
      }
      // usersToTip.push(filteredMessage[AmountPosition]);
      AmountPosition += 1;
      if (!filteredMessage[AmountPosition].startsWith('<@')) {
        AmountPositionEnded = true;
      }
    }

    if (usersToTip.length < 1) {
      await message.channel.send({ embeds: [notEnoughUsersToTip(message)] });
      return;
    }

    if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
      type = 'each';
    }
    // verify amount
    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[AmountPosition],
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
      channelId: channelTask.id,
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
        channelId: channelTask.id,
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
        const userIdReceivedRain = tipee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
    }

    if (listOfUsersRained.length === 1) {
      await message.channel.send({
        embeds: [
          tipSingleSuccessMessage(
            message,
            tipRecord.id,
            listOfUsersRained,
            userTipAmount,
          ),
        ],
      });
    } else if (listOfUsersRained.length > 1) {
      const newStringListUsers = listOfUsersRained.join(", ");
      const cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g);
      // eslint-disable-next-line no-restricted-syntax
      for (const element of cutStringListUsers) {
      // eslint-disable-next-line no-await-in-loop
        await message.channel.send(element);
      }

      await message.channel.send({
        embeds: [
          tipMultipleSuccessMessage(
            message,
            tipRecord.id,
            listOfUsersRained,
            userTipAmount,
            type,
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
        type: 'tip',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`tip error: ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("Tip")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};

export const tipCoinsToDiscordFaucet = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
  faucetSetting,
  queue,
) => {
  if (!groupTask || !channelTask) {
    await message.channel.send({ embeds: [NotInDirectMessage(message, 'Tip')] });
    return;
  }
  const activity = [];
  let user;
  const usersToTip = [];
  let userActivity;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
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
    // console.lgo(discordClient);

    const userExist = await db.user.findOne({
      where: {
        user_id: `discord-${discordClient.user.id}`,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (userExist) {
      usersToTip.push(userExist);
    }

    if (usersToTip.length < 1) {
      await message.channel.send({ embeds: [notEnoughUsersToTip(message)] });
      return;
    }

    // verify amount
    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[2],
      user,
      setting,
      'tip',
      'each',
      usersToTip,
    );

    if (activityValiateAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    const updatedBalance = await user.wallet.update({
      available: user.wallet.available - amount,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const userTipAmount = Number(amount);

    const tipRecord = await db.tip.create({
      feeAmount: 0,
      amount,
      type: 'each',
      userCount: usersToTip.length,
      userId: user.id,
      groupId: groupTask.id,
      channelId: channelTask.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      amount,
      type: 'tip_faucet_s',
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

    const faucet = await db.faucet.findOne({
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const updatedFaucet = await faucet.update({
      amount: faucet.amount + Number(userTipAmount),
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const listOfUsersRained = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tipee of usersToTip) {
      // eslint-disable-next-line no-await-in-loop
      const tiptipRecord = await db.tiptip.create({
        amount: Number(userTipAmount),
        userId: tipee.id,
        tipId: tipRecord.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      let tipActivity;
      // eslint-disable-next-line no-await-in-loop
      tipActivity = await db.activity.create({
        amount: Number(userTipAmount),
        type: 'tiptip_faucet_s',
        spenderId: user.id,
        earnerId: tipee.id,
        tipId: tipRecord.id,
        tiptipId: tiptipRecord.id,
        earner_balance: updatedFaucet.amount,
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
        const userIdReceivedRain = tipee.user_id.replace('discord-', '');
        listOfUsersRained.push(`<@${userIdReceivedRain}>`);
      }
    }
    await message.channel.send({ embeds: [tipFaucetSuccessMessage(message, userTipAmount)] });

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    logger.error(`tip error: ${err}`);
    message.channel.send({ embeds: [discordErrorMessage("Tip")] });
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });
};
