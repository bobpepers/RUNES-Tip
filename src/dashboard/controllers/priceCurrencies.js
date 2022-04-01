// import { parseDomain } from "parse-domain";
import BigNumber from "bignumber.js";
import db from '../../models';
import { updatePrice } from "../../helpers/price/updatePrice";
import { updateConversionRatesFiat, updateConversionRatesCrypto } from "../../helpers/price/updateConversionRates";

export const updatePriceCurrency = async (
  req,
  res,
  next,
) => {
  if (!req.body.type) {
    res.locals.error = "type is required";
    next();
  }
  if (!req.body.name) {
    res.locals.error = "name is required";
    next();
  }
  if (!req.body.iso) {
    res.locals.error = "iso is required";
    next();
  }
  const currency = await db.currency.findOne({
    where: {
      id: req.body.id,
    },
  });
  const updatedCurrency = await currency.update({
    currency_name: req.body.name,
    iso: req.body.iso,
    type: req.body.type,
  });
  res.locals.currency = await db.currency.findOne({
    where: {
      id: updatedCurrency.id,
    },
  });
  next();
};

export const updatePriceCurrencyPrices = async (
  req,
  res,
  next,
) => {
  try {
    await updateConversionRatesCrypto();
    await updateConversionRatesFiat();
    await updatePrice();
    res.locals.currency = true;
    next();
  } catch (e) {
    res.locals.error = "ERROR UPDATING PRICES";
    next();
  }
};

export const removePriceCurrency = async (
  req,
  res,
  next,
) => {
  const currency = await db.currency.findOne({
    where: {
      id: req.body.id,
    },
  });
  res.locals.currency = currency;
  currency.destroy();
  next();
};

export const fetchPriceCurrencies = async (
  req,
  res,
  next,
) => {
  const options = {
    order: [
      ['id', 'DESC'],
    ],
  };
  res.locals.currencies = await db.currency.findAll(options);
  next();
};

export const addPriceCurrency = async (
  req,
  res,
  next,
) => {
  console.log(req.body);
  if (!req.body.name) {
    res.locals.error = 'Name is required';
    next();
  }
  if (!req.body.iso) {
    res.locals.error = 'Iso is required';
    next();
  }
  if (!req.body.type) {
    res.locals.error = 'Type is required';
    next();
  }

  const currency = await db.currency.findOne({
    where: {
      iso: req.body.iso,
    },
  });

  if (currency) {
    res.locals.error = "Already Exists";
    next();
  }

  if (!currency) {
    res.locals.currency = await db.currency.create({
      type: req.body.type,
      currency_name: req.body.name,
      iso: req.body.iso,
    });
    next();
  }

  next();
};
