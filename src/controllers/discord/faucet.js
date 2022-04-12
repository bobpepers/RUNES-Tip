/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  MessageActionRow,
  MessageButton,
} from "discord.js";
import {
  dryFaucetMessage,
  claimTooFactFaucetMessage,
  faucetClaimedMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import getCoinSettings from '../../config/settings';
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import logger from "../../helpers/logger";

const settings = getCoinSettings();

export const discordFaucetClaim = async (
  message,
  io,
) => {
  let activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      message,
      t,
      'faucettip',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const faucet = await db.faucet.findOne({
      order: [
        ['id', 'DESC'],
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!faucet) {
      activity = await db.activity.create({
        type: 'faucettip_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send('faucet not found');
      return;
    }

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('claimFaucet')
        .setLabel('Claim Faucet')
        .setStyle('PRIMARY'),
    );

    if (Number(faucet.amount) < 10000) {
      const fActivity = await db.activity.create({
        type: 'faucettip_i',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.push(fActivity);
      await message.channel.send({
        embeds: [dryFaucetMessage()],
        components: [row],
      });
      return;
    }
    const lastFaucetTip = await db.faucettip.findOne({
      where: {
        userId: user.id,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
      order: [
        ['id', 'DESC'],
      ],
    });
    const userId = user.user_id.replace('discord-', '');
    const username = user.ignoreMe ? `${user.username}` : `<@${userId}>`;
    const dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + (4 * 60 * 60 * 1000);
    const dateNow = new Date().getTime();
    const distance = dateFuture && dateFuture - dateNow;

    if (distance
      && distance > 0
    ) {
      const activityTpre = await db.activity.create({
        type: 'faucettip_t',
        earnerId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      const activityT = await db.activity.findOne({
        where: {
          id: activityTpre.id,
        },
        include: [
          {
            model: db.user,
            as: 'earner',
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.push(activityT);
      await message.channel.send({
        embeds: [
          claimTooFactFaucetMessage(
            username,
            distance,
          ),
        ],
        components: [row],
      });
      return;
    }
    const amountToTip = Number(((faucet.amount / 100) * (settings.faucet / 1e2)).toFixed(0));
    const faucetTip = await db.faucettip.create({
      amount: amountToTip,
      faucetId: faucet.id,
      userId: user.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const updateFaucet = await faucet.update({
      amount: Number(faucet.amount) - Number(amountToTip),
      claims: faucet.claims + 1,
      totalAmountClaimed: faucet.totalAmountClaimed + Number(amountToTip),
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const updateWallet = await user.wallet.update({
      available: Number(user.wallet.available) + amountToTip,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const preActivity = await db.activity.create({
      type: 'faucettip_s',
      earnerId: user.id,
      faucettipId: faucetTip.id,
      amount: amountToTip,
      spender_balance: updateFaucet.amount,
      earner_balance: updateWallet.available + updateWallet.locked,
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
          model: db.user,
          as: 'earner',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity.push(finalActivity);
    await message.channel.send({
      embeds: [
        faucetClaimedMessage(
          faucetTip.id,
          username,
          amountToTip,
        ),
      ],
      components: [row],
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'faucet',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    console.log(err);
    logger.error(`faucet error: ${err}`);
    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Faucet",
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
