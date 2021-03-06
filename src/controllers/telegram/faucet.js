/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import { Markup } from "telegraf";
import {
  claimTooFastFaucetMessage,
  faucetClaimedMessage,
  errorMessage,
} from '../../messages/telegram';
import db from '../../models';
import getCoinSettings from '../../config/settings';
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";
import logger from "../../helpers/logger";

const settings = getCoinSettings();

export const telegramFaucetClaim = async (
  ctx,
  io,
) => {
  const activity = [];
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const [
      user,
      userActivity,
    ] = await userWalletExist(
      ctx,
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
      const activityNotFound = await db.activity.create({
        type: 'faucettip_f',
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(activityNotFound);
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
      await ctx.replyWithHTML(
        await claimTooFastFaucetMessage(
          user,
          distance,
        ),
        {
          ...Markup.inlineKeyboard(
            [
              [Markup.button.callback('Claim Faucet', 'faucet')],
            ],
          ),
        },
      );
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
      amount: Number(amountToTip),
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

    activity.unshift(finalActivity);
    await ctx.replyWithHTML(
      await faucetClaimedMessage(
        faucetTip.id,
        user,
        amountToTip,
      ),
      {
        ...Markup.inlineKeyboard(
          [
            [
              Markup.button.callback(
                'Claim Faucet',
                'faucet',
              ),
            ],
          ],
        ),
      },
    );
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'faucet',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`Faucet error: ${err}`);
    try {
      await ctx.replyWithHTML(
        await errorMessage(
          'Faucet',
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
