import db from '../models';

require('dotenv').config();
const metaget = require('metaget');

/**
 * Fetch Currencies
 */
const fetchCurrencies = async (req, res, next) => {
  res.locals.currencies = await db.currency.findAll({ });
  next();
};

export default fetchCurrencies;
