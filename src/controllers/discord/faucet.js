/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  dryFaucetMessage,
  claimTooFactFaucetMessage,
  faucetClaimedMessage,
} from '../../messages/discord';
import db from '../../models';
import getCoinSettings from '../../config/settings';
import { userWalletExist } from "../../helpers/discord/userWalletExist";

const settings = getCoinSettings();

export const discordFaucetClaim = async (
  message,
  filteredMessage,
  io,
) => {
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

    if (Number(faucet.amount) < 10000) {
      activity = await db.activity.create({
        type: 'faucettip_i',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      await message.channel.send({ embeds: [dryFaucetMessage(message)] });
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
    const username = user.ignoreme ? `<@${userId}>` : `${user.username}`;
    const dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + (4 * 60 * 60 * 1000);
    const dateNow = new Date().getTime();
    const distance = dateFuture && dateFuture - dateNow;
    console.log(distance);

    if (distance
      && distance > 0
    ) {
      activity = await db.activity.create({
        type: 'faucettip_t',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      await message.channel.send({ embeds: [claimTooFactFaucetMessage(message, username, distance)] });
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
    console.log(Number(user.wallet.available));
    console.log(amountToTip);
    const updateWallet = await user.wallet.update({
      available: Number(user.wallet.available) + amountToTip,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    activity = await db.activity.create({
      type: 'faucettip_s',
      earnerId: user.id,
      faucettipId: faucetTip.id,
    }, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    activity = await db.activity.findOne({
      where: {
        id: activity.id,
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
    await message.channel.send({ embeds: [faucetClaimedMessage(message, username, amountToTip)] });
  }).catch((err) => {
    message.channel.send('something went wrong');
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });

  return true;
};
