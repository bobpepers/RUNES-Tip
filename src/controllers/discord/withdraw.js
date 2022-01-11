/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import db from '../../models';
import { getInstance } from '../../services/rclient';
import {
  invalidAddressMessage,
  reviewMessage,
  warnDirectMessage,
} from '../../messages/discord';
import getCoinSettings from '../../config/settings';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/discord/validateAmount";
import { userWalletExist } from "../../helpers/discord/userWalletExist";

const settings = getCoinSettings();

export const withdrawDiscordCreate = async (
  discordClient,
  message,
  filteredMessage,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  logger.info(`Start Withdrawal Request: ${message.author.id}-${message.author.username}`);
  let user;
  let activity;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      activity,
    ] = await userWalletExist(
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (!user) return;
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
      activity = activityValiateAmount;
      return;
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
      await message.author.send({ embeds: [invalidAddressMessage(message)] });
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
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    activity = await db.activity.create(
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
    const userId = user.user_id.replace('discord-', '');

    if (message.channel.type === 'DM') {
      await message.author.send({ embeds: [reviewMessage(message)] });
    }

    if (message.channel.type === 'GUILD_TEXT') {
      await message.channel.send({ embeds: [warnDirectMessage(userId, 'Balance')] });
      await message.author.send({ embeds: [reviewMessage(message)] });
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    console.log(err);
    message.author.send("Something went wrong.");
  });
};
