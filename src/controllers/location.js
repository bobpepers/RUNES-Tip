// import { parseDomain } from "parse-domain";
import { iso1A3Code } from '@ideditor/country-coder'; // ES6 import named
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

require('dotenv').config();
const metaget = require('metaget');

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
export const getLocation = async (req, res, next) => {
  const myLocation = iso1A3Code([req.body.longitude, req.body.latitude]);
  const dbLocation = await db.country.findOne({
    where: {
      iso: myLocation,
    },
    include: [
      {
        model: db.currency,
        as: 'currency',
        required: true,
        // attributes: ['username'],
      },
    ],
  });
  if (dbLocation) {
    res.locals.location = dbLocation;
    if (req.user) {
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');
      console.log('req.user');

      console.log(req.user);
    }
  } else {
    res.locals.location = {
      id: 1,
      iso: 'USA',
      name: 'United States',
      status: true,
      currencyId: 1,
      currency: {
        currency_name: 'USD',
        iso: 'USD',
      },
    };
  }
  next();
};

export const placeholder = async (req, res, next) => {
  res.locals.paymentMethods = await db.paymentMethod.findAll({
    where: {
      status: true,
    },
  });
  next();
};
// export default fetchPublishers;
