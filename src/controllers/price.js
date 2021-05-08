import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
const fetchPriceInfo = async (req, res, next) => {
  try {
    const priceRecord = await db.priceInfo.findAll({});
    res.locals.price = priceRecord;
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export default fetchPriceInfo;
