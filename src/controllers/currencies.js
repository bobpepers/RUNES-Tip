import db from '../models';
import { config } from "dotenv";
config();
import metaget from "metaget";

/**
 * Fetch Currencies
 */
const fetchCurrencies = async (req, res, next) => {
  res.locals.currencies = await db.currency.findAll({ });
  next();
};

export default fetchCurrencies;
