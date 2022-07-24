/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { Transaction } from "sequelize";
import {
  miningMessage,
  discordErrorMessage,
} from '../../messages/discord';
import db from '../../models';
import logger from "../../helpers/logger";
import { userWalletExist } from "../../helpers/client/discord/userWalletExist";
import { getInstance } from '../../services/rclient';

export const discordMining = async (
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
      'mining',
    );
    if (userActivity) {
      activity.unshift(userActivity);
    }
    if (!user) return;

    const currentBlockHeight = await getInstance().getBlockCount();
    const miningInfo = await getInstance().getMiningInfo();

    const networkMSOL = miningInfo.networksolps / 1e6;
    // const expectBlocksPerDay = ((100 / ((1e6 / miningInfo.difficulty) * 100)) / 1440);
    // const expectBlocksPerDay = (86400 / ((miningInfo.networksolps / 1e6) * 60));
    const expectBlocksPerDay = (1440 / (miningInfo.networksolps / 1e6));

    const title = 'Privatebay Powder Monkey';

    let nextBlockHalving = 0;
    let currentBlockReward = halvingData.initialBlockReward;
    do {
      nextBlockHalving += halvingData.every;
      currentBlockReward /= 2;
    } while (nextBlockHalving < currentBlockHeight);
    currentBlockReward *= 2;

    const niceHashRateCost = await axios.get(`https://api2.nicehash.com/main/api/v2/hashpower/order/price?market=USA&algorithm=EQUIHASH`); // returns price in BTC cost GSOL / day
    const rentalCostBTC = (niceHashRateCost.data.price / 1000).toFixed(8);
    const fetchKMDRentalPrice = await axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=btc-bitcoin&quote_currency_id=kmd-komodo&amount=${rentalCostBTC}`);
    const fetchPirateKomodoprice = await axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=arrr-pirate&quote_currency_id=kmd-komodo&amount=1`);
    const fetchPirateBTCprice = await axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=arrr-pirate&quote_currency_id=btc-bitcoin&amount=1`);
    const rentalCostKMD = (fetchKMDRentalPrice.data.price).toFixed(8);
    const pirateKomodoPrice = (fetchPirateKomodoprice.data.price).toFixed(8);
    const pirateBitcoinPrice = (fetchPirateBTCprice.data.price).toFixed(8);
    const difficultyInG = (miningInfo.difficulty / 1e9).toFixed(2);

    await message.channel.send({
      embeds: [
        miningMessage(
          title,
          currentBlockReward,
          niceHashRateCost.data.price,
          networkMSOL,
          expectBlocksPerDay,
          rentalCostBTC,
          rentalCostKMD,
          pirateKomodoPrice,
          pirateBitcoinPrice,
          difficultyInG,
        ),
      ],
    });

    const preActivity = await db.activity.create({
      type: 'mining_s',
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
    // logger.error(`Error Discord Halving Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator} - ${err}`);

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
