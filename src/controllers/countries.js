// import { parseDomain } from "parse-domain";
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

require('dotenv').config();
const metaget = require('metaget');

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
const fetchCountries = async (req, res, next) => {
  res.locals.countries = await db.country.findAll({ });
  next();
};

export default fetchCountries;
