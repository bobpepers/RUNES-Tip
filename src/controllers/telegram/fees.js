import { Transaction } from "sequelize";
import {
  telegramFeeMessage,
  errorMessage,
} from '../../messages/telegram';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/telegram/userWalletExist";

export const findFee = async (
  name,
  t,
  groupId,
  channelId,
) => {
  let fee;

  fee = await db.features.findOne({
    where: {
      type: 'local',
      name,
      groupId,
      channelId,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (!fee) {
    fee = await db.features.findOne({
      where: {
        type: 'local',
        name,
        groupId,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }
  if (!fee) {
    fee = await db.features.findOne({
      where: {
        type: 'global',
        name,
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
  }
  return fee;
};

export const telegramFeeSchedule = async (
  ctx,
  io,
  guildId = null,
  channelId = null,
) => {
  const fee = {};
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
      'fees',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    fee.tip = await findFee(
      'tip',
      t,
      guildId,
      channelId,
    );

    // fee.reactdrop = await findFee(
    //  'reactdrop',
    //  t,
    //  guildId,
    //  channelId,
    // );

    // fee.trivia = await findFee(
    //  'trivia',
    //  t,
    //  guildId,
    //  channelId,
    // );

    // fee.soak = await findFee(
    //  'soak',
    //  t,
    //  guildId,
    //  channelId,
    // );

    fee.rain = await findFee(
      'rain',
      t,
      guildId,
      channelId,
    );

    // fee.voicerain = await findFee(
    //  'voicerain',
    //  t,
    //  guildId,
    //  channelId,
    // );

    // fee.thunder = await findFee(
    //  'thunder',
    //  t,
    //  guildId,
    //  channelId,
    // );

    // fee.thunderstorm = await findFee(
    //  'thunderstorm',
    //  t,
    //  guildId,
    //  channelId,
    // );

    // fee.hurricane = await findFee(
    //  'hurricane',
    //  t,
    //  guildId,
    //  channelId,
    // );

    fee.flood = await findFee(
      'flood',
      t,
      guildId,
      channelId,
    );
    fee.sleet = await findFee(
      'sleet',
      t,
      guildId,
      channelId,
    );

    fee.withdraw = await findFee(
      'withdraw',
      t,
      guildId,
      channelId,
    );

    const preActivity = await db.activity.create({
      type: 'fees_s',
      earnerId: user.id,
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
      await telegramFeeMessage(
        fee,
      ),
    );
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'fees',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`fees error: ${err}`);
    try {
      await ctx.replyWithHTML(
        await errorMessage(
          'Fees',
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
