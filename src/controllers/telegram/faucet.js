/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  claimTooFastFaucetMessage,
  faucetClaimedMessage,
} from '../../messages/telegram';
import db from '../../models';
import getCoinSettings from '../../config/settings';
import { userWalletExist } from "../../helpers/telegram/userWalletExist";

const settings = getCoinSettings();

export const telegramFaucetClaim = async (
  ctx,
  io,
) => {
  let user;
  let userActivity;
  let activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      userActivity,
    ] = await userWalletExist(
      ctx,
      t,
      'rain',
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
      await ctx.reply('Faucet not found');
      return;
    }

    if (Number(faucet.amount) < 10000) {
      const fActivity = await db.activity.create({
        type: 'faucettip_i',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.push(fActivity);
      await ctx.reply('Faucet is dry');
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
    const username = `${user.username}`;
    const dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + (4 * 60 * 60 * 1000);
    const dateNow = new Date().getTime();
    const distance = dateFuture && dateFuture - dateNow;
    console.log(distance);

    if (distance
      && distance > 0
    ) {
      const activityT = await db.activity.create({
        type: 'faucettip_t',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.push(activityT);
      await ctx.reply(claimTooFastFaucetMessage(username, distance));
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
    console.log(finalActivity);
    activity.unshift(finalActivity);
    await ctx.reply(faucetClaimedMessage(username, amountToTip));
  }).catch((err) => {
    console.log(err);
    ctx.reply('something went wrong');
  });
  io.to('admin').emit('updateActivity', {
    activity,
  });

  return true;
};
