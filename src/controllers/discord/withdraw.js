/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import {
  invalidAddressMessage,
  reviewMessage,
  warnDirectMessage,
  discordErrorMessage,
  cannotSendMessageUser,
} from '../../messages/discord';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { validateWithdrawalAddress } from '../../helpers/blockchain/validateWithdrawalAddress';

export const withdrawDiscordCreate = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  let user;
  let userActivity;
  const activity = [];
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
    const userId = user.user_id.replace('discord-', '');

    const [
      activityValiateAmount,
      amount,
    ] = await validateAmount(
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

    const [
      isInvalidAddress,
      isNodeOffline,
      failWithdrawalActivity,
    ] = await validateWithdrawalAddress(
      filteredMessage[2],
      user,
      t,
    );

    if (isNodeOffline) {
      await message.author.send('Runebase node offline');
    }

    if (isInvalidAddress) {
      await message.author.send({
        embeds: [
          invalidAddressMessage(message),
        ],
      });
    }

    if (isInvalidAddress || isNodeOffline) {
      if (message.channel.type !== 'DM') {
        await message.channel.send({
          embeds: [
            warnDirectMessage(userId, 'Withdraw'),
          ],
        });
      }
    }

    if (failWithdrawalActivity) {
      activity.unshift(failWithdrawalActivity);
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

    if (message.channel.type === 'DM') {
      await message.author.send({ embeds: [reviewMessage(message, transaction)] });
    }

    if (message.channel.type === 'GUILD_TEXT') {
      await message.author.send({ embeds: [reviewMessage(message, transaction)] });
      await message.channel.send({ embeds: [warnDirectMessage(userId, 'Withdraw')] });
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
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`withdraw error: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({ embeds: [cannotSendMessageUser("Withdraw", message)] }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({ embeds: [discordErrorMessage("Withdraw")] }).catch((e) => {
        console.log(e);
      });
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
};
