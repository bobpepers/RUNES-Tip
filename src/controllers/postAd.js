// import { parseDomain } from "parse-domain";
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

require('dotenv').config();
const metaget = require('metaget');
const BigNumber = require('bignumber.js');

const { Sequelize, Transaction, Op } = require('sequelize');

const countDecimals = function (value) {
  if ((value % 1) !== 0) { return value.toString().split(".")[1].length; }
  return 0;
};

/**
 * Fetch PriceInfo
 */
export const addPostAd = async (req, res, next) => {
  if (req.body.price % 1 !== 0) {
    if (countDecimals(req.body.runesPrice) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }
  if (req.body.price % 1 !== 0) {
    if (countDecimals(req.body.minAmount) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }
  if (req.body.price % 1 !== 0) {
    if (countDecimals(req.body.maxAmount) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }
  if (req.body.minAmount < 5) {
    res.locals.error = 'MIN_AMOUNT_5_RUNES';
    return next();
  }

  if (Number(req.body.minAmount) > Number(req.body.maxAmount)) {
    res.locals.error = 'MIN_AMOUNT_MUST_BE_SMALLER_THEN_MAX';
    return next();
  }
  if (Number(req.body.maxAmount) < Number(req.body.minAmount)) {
    res.locals.error = 'MAX_AMOUNT_MUST_BE_LARGER_THEN_MIN';
    return next();
  }

  console.log(req.body.priceType);
  console.log(req.body.priceType);
  if (req.body.priceType !== 'static' && req.body.priceType !== 'margin') {
    res.locals.error = 'WRONG_PRICE_TYPE';
    return next();
  }

  if (countDecimals(req.body.margin) > 2) {
    res.locals.error = 'MARGIN_MAX_2_DECIMALS';
    return next();
  }

  console.log(req.body.margin);
  console.log(req.body.priceType);
  // check paymentDetails
  // paymentDetails
  //
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log('req.body');
  console.log(req.body);
  if (req.body.paymentDetails) {
    console.log(req.body.paymentDetails);
    if (req.body.paymentDetails.toString().length > 400) {
      res.locals.error = 'PAYMENT_DETAILS_LENGTH_TOO_LONG';
      return next();
    }
  }

  const runesPrice = new BigNumber(req.body.runesPrice).multipliedBy(1e8).toFixed(0);
  const minAmount = new BigNumber(req.body.minAmount).multipliedBy(1e8).toFixed(0);
  const maxAmount = new BigNumber(req.body.maxAmount).multipliedBy(1e8).toFixed(0);

  res.locals.postAd = await db.postAd.create({
    margin: (req.body.margin * 1e2),
    priceType: req.body.priceType,
    type: req.body.type,
    amount: 0,
    min: minAmount,
    max: maxAmount,
    price: runesPrice,
    currencyId: req.body.currency,
    paymentMethodId: req.body.paymentMethod,
    userId: req.user.id,
    location: req.body.location,
    countryId: req.body.country,
    paymentDetails: req.body.paymentDetails ? (req.body.paymentDetails).toString() : null,
  });
  next();
};

export const fetchPostAd = async (req, res, next) => {
  console.log('(req.body.type)');
  console.log(req.body.type);
  const userOptions = {
    lastSeen: {
      [Op.gte]: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)),
    },
  };
  const mainOptions = {
    type: req.body.type,
    active: true,
  };

  if (req.body.userStatus !== 'all') {
    if (req.body.userStatus === 'online') {
      userOptions.online = true;
    }
    if (req.body.userStatus === 'offline') {
      userOptions.online = false;
    }
  }

  if (req.body.storeStatus !== 'all') {
    if (req.body.storeStatus === 'open') {
      userOptions.open_store = true;
    }
    if (req.body.storeStatus === 'closed') {
      userOptions.open_store = false;
    }
  }

  if (req.body.username !== 'all') {
    userOptions.username = req.body.username;
  }

  const options = {
    where: mainOptions,
    include: [
      {
        model: db.user,
        as: 'user',
        required: true,
        where: userOptions,
        attributes: [
          'username',
          'open_store',
          'online',
          'lastSeen',
        ],
      },
      {
        model: db.paymentMethod,
        as: 'paymentMethod',
        required: false,
      },
      {
        model: db.currency,
        as: 'currency',
        required: false,
      },
      {
        model: db.country,
        as: 'country',
        required: false,
      },
    ],
  };

  if (req.body.currency !== 'all') {
    options.where.currencyId = req.body.currency;
  }

  if (req.body.paymentMethod !== 'all') {
    options.where.paymentMethodId = req.body.paymentMethod;
  }

  if (req.body.country !== 'all') {
    options.where.countryId = req.body.country;
  }

  console.log(options);
  console.log(options.include[0]);
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');
  console.log('voooor');

  if (req.body.type === 'buy') {
    res.locals.buy = await db.postAd.findAll(options);
    console.log(res.locals.buy);
  }
  if (req.body.type === 'sell') {
    res.locals.sell = await db.postAd.findAll(options);
    console.log(res.locals.sell);
  }

  next();
};

export const fetchMyPostAd = async (req, res, next) => {
  res.locals.ads = await db.postAd.findAll({
    where: {
      userId: req.user.id,
      active: true,
    },
    include: [
      {
        model: db.user,
        as: 'user',
        required: false,
        attributes: ['username'],
      },
      {
        model: db.paymentMethod,
        as: 'paymentMethod',
        required: false,
      },
      {
        model: db.currency,
        as: 'currency',
        required: false,
      },
      {
        model: db.country,
        as: 'country',
        required: false,
      },
    ],
  });
  next();
};

// To check if an array is empty using javascript
function arrayIsEmpty(array) {
  // If it's not an array, return FALSE.
  if (!Array.isArray(array)) {
    return false;
  }
  // If it is an array, check its length property
  if (array.length == 0) {
    // Return TRUE if the array is empty
    return true;
  }
  // Otherwise, return FALSE.
  return false;
}

export const deactivatePostAd = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(req.body);
    console.log(req.user.id);

    const advertisement = await db.postAd.findOne({
      where: {
        id: req.body.id,
        active: true,
      },
      include: [
        {
          model: db.trade,
          as: 'trade',
          required: false,
          where: {
            type: {
              [Op.or]: [
                'requested',
                'accepted',
                'disputed',
              ],
            },
          },
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!advertisement) {
      console.log('UNABLE_TO_FIND_ADVERTISEMENT');
      throw new Error('UNABLE_TO_FIND_ADVERTISEMENT');
    }

    console.log(advertisement);
    if (!arrayIsEmpty(advertisement.trade)) {
      console.log('empty');
      throw new Error('ADVERTISEMENT_HAS_ACTIVE_TRADES');
    }

    res.locals.postAd = await advertisement.update({
      active: false,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};
