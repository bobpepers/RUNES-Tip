import db from '../models';

const fetchCurrencies = async (req, res, next) => {
  res.locals.currencies = await db.currency.findAll({ });
  next();
};

export default fetchCurrencies;
