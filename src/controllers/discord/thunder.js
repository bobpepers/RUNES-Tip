/* eslint-disable import/prefer-default-export */
import _ from "lodash";
import { Transaction } from "sequelize";
import db from '../../models';
import {
  notEnoughActiveUsersMessage,
  AfterThunderSuccess,
  discordErrorMessage,
} from '../../messages/discord';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { mapMembers } from "../../helpers/client/discord/mapMembers";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { waterFaucet } from "../../helpers/waterFaucet";

export const discordThunder = async (
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
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
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
      validAmount,
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
    if (!validAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
    const onlineMembers = members.filter((member) => member.presence
      && member.presence.status
      && member.presence.status === "online");

    const [
      preWithoutBots,
      optionalRole,
    ] = await mapMembers(
      message,
      t,
      filteredMessage[3],
      onlineMembers,
      setting,
    );

    const withoutBots = _.sampleSize(preWithoutBots, 1);

    if (withoutBots.length < 1) {
      const failActivity = await db.activity.create({
        type: 'thunder_f',
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(failActivity);
      await message.channel.send({
        embeds: [
          notEnoughActiveUsersMessage(
            user.user_id.replace('discord-', ''),
            'Thunder',
          ),
        ],
      });
      return;
    }
    if (withoutBots.length === 1) {
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

      const thunderRecord = await db.thunder.create({
        feeAmount: fee,
        amount,
        userCount: withoutBots.length,
        userId: user.id,
        groupId: groupTask.id,
        channelId: channelTask.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const preActivity = await db.activity.create({
        amount,
        type: 'thunder_s',
        spenderId: user.id,
        thunderId: thunderRecord.id,
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
            model: db.thunder,
            as: 'thunder',
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
      for (const thunderee of withoutBots) {
        // eslint-disable-next-line no-await-in-loop
        const thundereeWallet = await thunderee.wallet.update({
          available: thunderee.wallet.available + Number(amountPerUser),
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        // eslint-disable-next-line no-await-in-loop
        const thundertipRecord = await db.thundertip.create({
          amount: amountPerUser,
          userId: thunderee.id,
          thunderId: thunderRecord.id,
          groupId: groupTask.id,
          channelId: channelTask.id,
        }, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (thunderee.ignoreMe) {
          listOfUsersRained.push(`${thunderee.username}`);
        } else {
          const userIdReceivedRain = thunderee.user_id.replace('discord-', '');
          listOfUsersRained.push(`<@${userIdReceivedRain}>`);
        }
        let tipActivity;
        // eslint-disable-next-line no-await-in-loop
        tipActivity = await db.activity.create({
          amount: Number(amountPerUser),
          type: 'thundertip_s',
          spenderId: user.id,
          earnerId: thunderee.id,
          thunderId: thunderRecord.id,
          thundertipId: thundertipRecord.id,
          earner_balance: thundereeWallet.available + thundereeWallet.locked,
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
              model: db.thunder,
              as: 'thunder',
            },
            {
              model: db.thundertip,
              as: 'thundertip',
            },
          ],
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        activity.unshift(tipActivity);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const userThunder of listOfUsersRained) {
        // eslint-disable-next-line no-await-in-loop
        await message.channel.send({
          embeds: [
            AfterThunderSuccess(
              user.user_id.replace('discord-', ''),
              thunderRecord.id,
              amount,
              userThunder,
              optionalRole,
            ),
          ],
        });
      }
    }
    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'thunder',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`thunder error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Thunder",
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
