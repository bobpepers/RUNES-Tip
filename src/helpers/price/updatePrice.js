import axios from 'axios';
import { config } from "dotenv";
import db from '../../models';
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

config();

export const updatePrice = async () => {
  try {
    const data = await axios.get(`https://api.coinpaprika.com/v1/tickers/${settings.coin.ticker.toLowerCase()}-${settings.coin.name.toLowerCase()}`);
    if (data.data) {
      const currencies = await db.currency.findAll({});
      currencies.forEach(async (currency) => {
        await currency.update({
          price: (Number(data.data.quotes.USD.price) * Number(currency.conversionRate)).toFixed(8).toString(),
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
};
