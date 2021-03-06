/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction, Op } from "sequelize";
import { Api } from 'telegram';
import db from '../../models';
import {
  notEnoughUsers,
  userListMessage,
  tipSingleSuccessMessage,
  tipMultipleSuccessMessage,
  errorMessage,
} from '../../messages/telegram';
import { validateAmount } from "../../helpers/client/telegram/validateAmount";
import { waterFaucet } from "../../helpers/waterFaucet";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import { getUserToMentionFromDatabaseRecord } from "../../helpers/client/telegram/userToMention";
import { generateUserWalletAndAddress } from "./user";

import logger from "../../helpers/logger";

export const tipToTelegramUser = async (
  telegramClient,
  telegramApiClient,
  ctx,
  filteredMessage,
  io,
  groupTask,
  setting,
  faucetSetting,
  queue,
) => {
  const activity = [];
  let AmountPosition = 1;
  let AmountPositionEnded = false;
  const usersToTip = [];
  let type = 'split';

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      ctx,
      t,
      'tip',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    // make users to tip array
    while (!AmountPositionEnded) {
      let userExist = false;
      if (
        ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'text_mention'
       && !ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.is_bot
      ) {
        userExist = await db.user.findOne({
          where: {
            user_id: `telegram-${ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id}`,
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
      } else if (ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'mention') {
        userExist = await db.user.findOne({
          where: {
            username: `${filteredMessage[parseInt(AmountPosition, 10)].substring(1)}`,
            user_id: { [Op.startsWith]: 'telegram-' },
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
      }

      if (userExist) {
        const userIdTest = userExist.user_id.replace('telegram-', '');
        if (Number(userIdTest) !== ctx.update.message.from.id) {
          if (!usersToTip.find((o) => o.id === userExist.id)) {
            usersToTip.push(userExist);
          }
        }
      } else if (!userExist) {
        let newUserExist;
        if (
          ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'text_mention'
          && !ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.is_bot
        ) {
          let newUserInfo;
          try {
            newUserInfo = await telegramApiClient.invoke(
              new Api.users.GetFullUser({
                id: `${ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id}`,
              }),
            );
          } catch (e) {
            console.log(e);
          }
          if (
            newUserInfo
            && newUserInfo.users.length > 0
            && !newUserInfo.users[0].bot
          ) {
            const myNewUserInfo = {
              userId: Number(newUserInfo.users[0].id.value),
              username: newUserInfo.users[0].username,
              firstname: newUserInfo.users[0].firstName,
              lastname: newUserInfo.users[0].lastName,
            };
            const [
              newUser,
              newAccount,
            ] = await generateUserWalletAndAddress(
              myNewUserInfo,
              t,
            );
            newUserExist = await db.user.findOne({
              where: {
                user_id: `telegram-${ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].user.id}`,
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
          }
        } else if (ctx.update.message.entities[parseInt(AmountPosition - 1, 10)].type === 'mention') {
          let newUserInfo;
          try {
            newUserInfo = await telegramApiClient.invoke(
              new Api.contacts.ResolveUsername({
                username: `${filteredMessage[parseInt(AmountPosition, 10)].substring(1)}`,
              }),
            );
          } catch (e) {
            console.log(e);
          }
          if (
            newUserInfo
            && newUserInfo.users.length > 0
            && !newUserInfo.users[0].bot
          ) {
            const myNewUserInfo = {
              userId: Number(newUserInfo.users[0].id.value),
              username: newUserInfo.users[0].username,
              firstname: newUserInfo.users[0].firstName,
              lastname: newUserInfo.users[0].lastName,
            };
            const [
              newUser,
              newAccount,
            ] = await generateUserWalletAndAddress(
              myNewUserInfo,
              t,
            );
            newUserExist = await db.user.findOne({
              where: {
                username: `${filteredMessage[parseInt(AmountPosition, 10)].substring(1)}`,
                user_id: { [Op.startsWith]: 'telegram-' },
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
          }
        }
        if (newUserExist) {
          const userIdTest = newUserExist.user_id.replace('telegram-', '');
          if (Number(userIdTest) !== ctx.update.message.from.id) {
            if (!usersToTip.find((o) => o.id === newUserExist.id)) {
              usersToTip.push(newUserExist);
            }
          }
        }
      }

      AmountPosition += 1;
      if (AmountPosition > ctx.update.message.entities.length) {
        AmountPositionEnded = true;
      }
    }

    if (usersToTip.length < 1) {
      await ctx.replyWithHTML(
        notEnoughUsers(
          'Tip',
        ),
      );
      return;
    }

    if (filteredMessage[AmountPosition + 1] && filteredMessage[AmountPosition + 1].toLowerCase() === 'each') {
      type = 'each';
    }

    const [
      validAmount,
      activityValiateAmount,
      amount,
    ] = await validateAmount(
      ctx,
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

      const [
        userToMention,
        userId,
      ] = await getUserToMentionFromDatabaseRecord(tipee);

      if (tipee.ignoreMe) {
        listOfUsersRained.push(`${userToMention}`);
      } else {
        listOfUsersRained.push(`<a href="tg://user?id=${userId}">${userToMention}</a>`);
      }
    }

    if (listOfUsersRained.length === 1) {
      await ctx.replyWithHTML(
        await tipSingleSuccessMessage(
          ctx,
          tipRecord.id,
          listOfUsersRained,
          userTipAmount,
        ),
      );
    } else if (listOfUsersRained.length > 1) {
      const cutStringListUsers = [];
      let i = 0;
      listOfUsersRained.forEach((word) => {
        if (!cutStringListUsers[parseInt(i, 10)]) {
          cutStringListUsers[parseInt(i, 10)] = word;
        } else if (cutStringListUsers[parseInt(i, 10)].length + word.length + 1 <= 3500) {
          cutStringListUsers[parseInt(i, 10)] += `,${word}`;
        } else {
          i += 1;
          cutStringListUsers[parseInt(i, 10)] = word;
        }
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const element of cutStringListUsers) {
        // eslint-disable-next-line no-await-in-loop
        await ctx.replyWithHTML(
          await userListMessage(
            element,
          ),
        );
      }

      await ctx.replyWithHTML(
        await tipMultipleSuccessMessage(
          ctx,
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
        type: 'Tip',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`tip error: ${err}`);
    try {
      await ctx.replyWithHTML(
        await errorMessage(
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
