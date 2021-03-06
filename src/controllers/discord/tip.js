/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  tipSingleSuccessMessage,
  tipMultipleSuccessMessage,
  notEnoughUsersToTip,
  tipFaucetSuccessMessage,
  discordErrorMessage,
} from '../../messages/discord';
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { waterFaucet } from "../../helpers/waterFaucet";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { generateUserWalletAndAddress } from './user';

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
      'tip',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const discordUserSelfId = user.user_id.replace('discord-', '');
    console.log("1");
    // make users to tip array
    while (!AmountPositionEnded) {
      let discordId;
      if (filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@!')) {
        discordId = filteredMessage[parseInt(AmountPosition, 10)].slice(3).slice(0, -1);
      } else if (
        filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@&')
      ) {
        discordId = filteredMessage[parseInt(AmountPosition, 10)].slice(3).slice(0, -1);
      } else if (
        filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@')
        && !filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@!')
        && !filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@&')
      ) {
        discordId = filteredMessage[parseInt(AmountPosition, 10)].slice(2).slice(0, -1);
      }
      console.log("2");
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
        if (userIdTest !== discordUserSelfId) {
          if (!usersToTip.find((o) => o.id === userExist.id)) {
            usersToTip.push(userExist);
          }
        }
      }
      if (!userExist) {
        if (discordId !== discordUserSelfId) {
          const userClient = await discordClient.users.fetch(discordId);
          if (
            userClient
            && !userClient.bot
          ) {
            const [
              newUser,
              newAccount,
            ] = await generateUserWalletAndAddress(
              userClient,
              t,
            );

            const newUserExist = await db.user.findOne({
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
            if (newUserExist) {
              const userNewIdTest = newUserExist.user_id.replace('discord-', '');
              if (userNewIdTest !== discordUserSelfId) {
                if (!usersToTip.find((o) => o.id === newUserExist.id)) {
                  usersToTip.push(newUserExist);
                }
              }
            }
          }
        }
      }
      // usersToTip.push(filteredMessage[AmountPosition]);
      AmountPosition += 1;
      if (
        !filteredMessage[parseInt(AmountPosition, 10)]
        || !filteredMessage[parseInt(AmountPosition, 10)].startsWith('<@')
      ) {
        AmountPositionEnded = true;
      }
    }
    console.log("3");
    if (usersToTip.length < 1) {
      await message.channel.send({
        embeds: [
          notEnoughUsersToTip(
            discordUserSelfId,
          ),
        ],
      });
      return;
    }
    console.log("4");
    if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
      type = 'each';
    }
    // verify amount
    const [
      validAmount,
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      message,
      t,
      filteredMessage[parseInt(AmountPosition, 10)],
      user,
      setting,
      'tip',
      type,
      usersToTip,
    );
    if (!validAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }
    console.log("5");
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
            discordUserSelfId,
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
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Tip",
        ),
      ],
    }).catch((e) => {
      console.log(e);
    });
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
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
      await message.channel.send({
        embeds: [
          notEnoughUsersToTip(message),
        ],
      });
      return;
    }

    // verify amount
    const [
      validAmount,
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

    if (!validAmount) {
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
    const discordUserId = user.user_id.replace('discord-', '');
    await message.channel.send({
      embeds: [
        tipFaucetSuccessMessage(
          discordUserId,
          userTipAmount,
        ),
      ],
    });

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'tipFaucet',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`tipFaucet Discord: ${e}`);
    }
    console.log(err);
    logger.error(`tipFaucet error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage("Tip"),
      ],
    }).catch((e) => {
      console.log(e);
    });
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
