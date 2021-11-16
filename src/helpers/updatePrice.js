import axios from 'axios';
import db from '../models';
import settings from '../config/settings';
//import { Sequelize, Transaction, Op } from "sequelize";

const updatePrice = async () => {
  try {
    const createFirstRecord = await db.priceInfo.findOrCreate({
      where: {
        id: 1,
      },
      defaults: {
        id: 1,
        price: "0",
        currency: "USD",
      },
    });

    if (!createFirstRecord) {
      console.log('already exists');
    } else {
      console.log('Created...');
    }

    // Get data from coinpaprika
    const data = await axios.get(`https://api.coinpaprika.com/v1/tickers/${settings.coin.ticker.toLowerCase()}-${settings.coin.name.toLowerCase()}`);

    if (data.data) {
      const priceInfo = await db.priceInfo.findOne({
        where: {
          id: 1,
        },
      });

      if (!priceInfo) {
        throw new Error('PRICE_INFO_NOT_FOUND');
      }

      const newPrice = Number(data.data.quotes.USD.price) + ((Number(data.data.quotes.USD.price) / 100));

      const price = await priceInfo.update({
        price: newPrice.toFixed(8).toString(),
      });

      const currencies = await db.currency.findAll({ });

      currencies.forEach(async (currency) => {
        if (currency.iso !== null || currency.iso !== "USD") {
          const createFirstRecord = await db.priceInfo.findOrCreate({
            where: {
              currency: currency.iso,
            },
            defaults: {
              price: "0",
              currency: currency.iso,
            },
          });

          if (!createFirstRecord) {
            console.log('already exists');
          } else {
            console.log('Created...');
          }
        }
      });

      const currentPrice = await db.priceInfo.findOne({
        where: {
          id: 1,
        },
      });

      const promises = [];

      const openExchangeOptions = {
        method: 'GET',
        url: `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_RATES_KEY}&show_alternative=1`,
      };

      axios.request(openExchangeOptions).then(async (response) => {
        Object.keys(response.data.rates).forEach(async (currency) => {
          const currenciesExist = await db.currency.findOne({
            where: {
              iso: currency,
            },
          });
          if (currenciesExist) {
            const priceRecord = await db.priceInfo.update({
              price: (Number(currentPrice.price) * Number(response.data.rates[currency])).toFixed(8).toString(),
            }, {
              where: {
                currency,
              },
            });
          }
        });
      }).catch((error) => {
        console.error(error);
      });

      setTimeout(() => {
        Promise.all(promises).then(async () => {
          const priceRecords = await db.priceInfo.findAll({});
        });
      }, 5000);
    }
    console.log('updated price');
    return;
  } catch (error) {
    console.error(error);
  }
};

export default updatePrice;
