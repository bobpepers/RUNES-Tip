/* eslint-disable import/prefer-default-export */
import { Transaction } from "sequelize";
import {
  halvingMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { getInstance } from '../../services/rclient';

export const discordHalving = async (
  message,
  halvingData,
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
      message,
      t,
      'halving',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const currentBlockHeight = await getInstance().getBlockCount();
    let nextBlockHalving = 0;
    let currentBlockReward = halvingData.initialBlockReward;
    do {
      nextBlockHalving += halvingData.every;
      currentBlockReward /= 2;
    } while (nextBlockHalving < currentBlockHeight);
    currentBlockReward *= 2;
    const blockLeftUntilNextHalving = nextBlockHalving - currentBlockHeight;
    const CoinsLeftToMineUntilNextHalving = blockLeftUntilNextHalving * currentBlockReward;
    const title = 'Privatebay Powder Monkey';
    const dateNow = new Date();
    const nextHalvingDate = new Date(dateNow.getTime() + (blockLeftUntilNextHalving * (halvingData.blockTime * 1000)));

    const distance = new Date(nextHalvingDate.getTime() - dateNow.getTime());

    await message.channel.send({
      embeds: [
        halvingMessage(
          title,
          currentBlockHeight,
          nextBlockHalving,
          CoinsLeftToMineUntilNextHalving,
          nextHalvingDate,
          distance,
        ),
      ],
    });

    const preActivity = await db.activity.create({
      type: 'halving_s',
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
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: 'halving',
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Discord: ${e}`);
    }
    logger.error(`Error Discord Halving Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);

    await message.channel.send({
      embeds: [
        discordErrorMessage(
          "Halving",
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
