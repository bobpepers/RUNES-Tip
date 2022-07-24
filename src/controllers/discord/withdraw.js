/* eslint-disable import/prefer-default-export */
import {
  ChannelType,
  InteractionType,
} from 'discord.js';
import { Transaction } from "sequelize";
import db from '../../models';
import {
  invalidAddressMessage,
  reviewMessage,
  warnDirectMessage,
  discordErrorMessage,
  cannotSendMessageUser,
  unableToWithdrawToSelfMessage,
  discordTransactionMemoTooLongMessage,
} from '../../messages/discord';
import logger from "../../helpers/logger";
import { validateAmount } from "../../helpers/client/discord/validateAmount";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { validateWithdrawalAddress } from '../../helpers/blockchain/validateWithdrawalAddress';
import { disallowWithdrawToSelf } from '../../helpers/withdraw/disallowWithdrawToSelf';
import { createOrUseExternalWithdrawAddress } from '../../helpers/withdraw/createOrUseExternalWithdrawAddress';
import { extractWithdrawMemo } from '../../helpers/withdraw/extractWithdrawMemo';
import { fetchDiscordChannel } from '../../helpers/client/discord/fetchDiscordChannel';

import getCoinSettings from '../../config/settings';

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
      discordChannel,
      discordUserDMChannel,
    ] = await fetchDiscordChannel(
      discordClient,
      message,
    );

    const [
      validAmount,
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
    if (!validAmount) {
      activity.unshift(activityValiateAmount);
      return;
    }

    const userId = user.user_id.replace('discord-', '');

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
      await discordUserDMChannel.send('Runebase node offline');
    }

    if (isInvalidAddress) {
      await discordUserDMChannel.send({
        embeds: [
          invalidAddressMessage(
            userId,
          ),
        ],
      });
    }

    if (isInvalidAddress || isNodeOffline) {
      if (message.channel.type !== ChannelType.DM) {
        await discordChannel.send({
          embeds: [
            warnDirectMessage(
              userId,
              'Withdraw',
            ),
          ],
        });
      }
    }

    if (failWithdrawalActivity) {
      activity.unshift(failWithdrawalActivity);
      return;
    }

    const isMyAddressActivity = await disallowWithdrawToSelf(
      filteredMessage[2],
      user,
      t,
    );

    if (isMyAddressActivity) {
      await discordUserDMChannel.send({
        embeds: [
          unableToWithdrawToSelfMessage(
            userId,
          ),
        ],
      });
      if (message.channel.type !== ChannelType.DM) {
        await discordChannel.send({
          embeds: [
            warnDirectMessage(
              userId,
              'Withdraw',
            ),
          ],
        });
      }
      activity.unshift(isMyAddressActivity);
      return;
    }

    let memo = null;
    if (settings.coin.setting === 'Pirate') {
      let messageContent;
      console.log(message);
      if (message.type && message.type === InteractionType.ApplicationCommand) {
        messageContent = filteredMessage.join(' ');
      } else {
        messageContent = message.content;
      }
      memo = await extractWithdrawMemo(
        messageContent,
        filteredMessage,
      );
      if (memo.length > 512) {
        await discordChannel.send({
          embeds: [
            discordTransactionMemoTooLongMessage(
              userId,
              memo.length,
            ),
          ],
        });
        return;
      }
    }

    const addressExternal = await createOrUseExternalWithdrawAddress(
      filteredMessage[2],
      user,
      t,
    );

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
      memo,
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

    if (message.channel.type === ChannelType.DM) {
      await discordUserDMChannel.send({
        embeds: [
          reviewMessage(
            userId,
            transaction,
          ),
        ],
      });
    }

    if (message.channel.type === ChannelType.GuildText) {
      await discordUserDMChannel.send({
        embeds: [
          reviewMessage(
            userId,
            transaction,
          ),
        ],
      });
      await discordChannel.send({
        embeds: [
          warnDirectMessage(
            userId,
            'Withdraw',
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
        type: 'withdraw',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`withdraw error: ${err}`);
    if (err.code && err.code === 50007) {
      await message.channel.send({
        embeds: [
          cannotSendMessageUser(
            "Withdraw",
            message,
          ),
        ],
      }).catch((e) => {
        console.log(e);
      });
    } else {
      await message.channel.send({
        embeds: [
          discordErrorMessage(
            "Withdraw",
          ),
        ],
      }).catch((e) => {
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
