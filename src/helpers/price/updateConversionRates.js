import axios from 'axios';
import _ from 'lodash';
import { config } from "dotenv";
import db from '../../models';
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();
// import { Sequelize, Transaction, Op } from "sequelize";
config();

export const updateConversionRatesFiat = async () => {
  try {
    const currencies = await db.currency.findAll({
      where: {
        type: 'fiat',
      },
    });

    const fetchExchangeRatesData = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_RATES_KEY}&show_alternative=1`);

    currencies.forEach(async (currency) => {
      if (fetchExchangeRatesData.data.rates[currency.iso]) {
        await currency.update({
          conversionRate: fetchExchangeRatesData.data.rates[currency.iso],
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateConversionRatesCrypto = async () => {
  try {
    const currencies = await db.currency.findAll({
      where: {
        type: 'cryptocurrency',
      },
    });

    currencies.forEach(async (currency) => {
      const fetchExchangeRatesData = await axios.get(`https://api.coinpaprika.com/v1/tickers/${currency.iso.toLowerCase()}-${currency.currency_name.toLowerCase()}`);
      if (fetchExchangeRatesData) {
        await currency.update({
          conversionRate: (1 / Number(fetchExchangeRatesData.data.quotes.USD.price)).toFixed(8).toString(),
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
