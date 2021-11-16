import { config } from "dotenv";
import metaget from "metaget";
import db from '../models';

config();

/**
 * Fetch Currencies
 */
const fetchCurrencies = async (req, res, next) => {
  res.locals.currencies = await db.currency.findAll({ });
  next();
};

export default fetchCurrencies;
