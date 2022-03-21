import { Transaction } from "sequelize";
import {
  feeMessage,
  errorMessage,
} from '../../messages/matrix';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/matrix/userWalletExist";

export const findFee = async (
  name,
  groupId,
  t,
) => {
  let fee;

  fee = await db.features.findOne({
    where: {
      type: 'local',
      name,
      groupId,
    },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
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

export const fetchFeeSchedule = async (
  matrixClient,
  message,
  filteredMessage,
  io,
  guildId = null,
) => {
  const fee = {};
  const activity = [];
  let userActivity;
  let user;
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    [
      user,
      userActivity,
    ] = await userWalletExist(
      matrixClient,
      message,
      t,
      filteredMessage[1].toLowerCase(),
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    fee.tip = await findFee(
      'tip',
      guildId,
      t,
    );

    // fee.reactdrop = await findFee(
    //  'reactdrop',
    //  guildId,
    // t,
    // );

    // fee.trivia = await findFee(
    //  'trivia',
    //  guildId,
    // t,
    // );

    // fee.soak = await findFee(
    //  'soak',
    //  guildId,
    // t,
    // );

    // fee.rain = await findFee(
    //  'rain',
    //  guildId,
    // t,
    // );

    // fee.voicerain = await findFee(
    //  'voicerain',
    //  guildId,
    // t,
    // );

    // fee.thunder = await findFee(
    //  'thunder',
    //  guildId,
    // t,
    // );

    // fee.thunderstorm = await findFee(
    //  'thunderstorm',
    //  guildId,
    // t,
    // );

    // fee.hurricane = await findFee(
    //  'hurricane',
    //  guildId,
    // t,
    // );

    fee.flood = await findFee(
      'flood',
      guildId,
      t,
    );
    fee.sleet = await findFee(
      'sleet',
      guildId,
      t,
    );

    fee.withdraw = await findFee(
      'withdraw',
      guildId,
      t,
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

    await matrixClient.sendEvent(
      message.sender.roomId,
      "m.room.message",
      feeMessage(
        message,
        fee,
      ),
    );

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'fee',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Matrix: ${e}`);
    }
    console.log(err);
    logger.error(`fee error: ${err}`);
    try {
      await matrixClient.sendEvent(
        message.sender.roomId,
        "m.room.message",
        errorMessage(
          'Fee',
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
