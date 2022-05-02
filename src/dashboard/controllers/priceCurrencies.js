import db from '../../models';
import { updatePrice } from "../../helpers/price/updatePrice";
import {
  updateConversionRatesFiat,
  updateConversionRatesCrypto,
} from "../../helpers/price/updateConversionRates";

export const updatePriceCurrency = async (
  req,
  res,
  next,
) => {
  if (!req.body.type) {
    throw new Error("type is required");
  }
  if (!req.body.name) {
    throw new Error("name is required");
  }
  if (!req.body.iso) {
    throw new Error("iso is required");
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
  res.locals.name = 'updatePriceCurrency';
  res.locals.result = await db.currency.findOne({
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
  await updateConversionRatesCrypto();
  await updateConversionRatesFiat();
  await updatePrice();
  res.locals.name = 'updatePriceCurrencyPrice';
  res.locals.result = { success: true };
  next();
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
  res.locals.name = 'removePriceCurrency';
  res.locals.result = currency;
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
  res.locals.name = 'priceCurrencies';
  res.locals.count = await db.currency.count(options);
  res.locals.result = await db.currency.findAll(options);
  next();
};

export const addPriceCurrency = async (
  req,
  res,
  next,
) => {
  console.log(req.body);
  if (!req.body.name) {
    throw new Error("Name is required");
  }
  if (!req.body.iso) {
    throw new Error("Iso is required");
  }
  if (!req.body.type) {
    throw new Error("Type is required");
  }

  const currency = await db.currency.findOne({
    where: {
      iso: req.body.iso,
    },
  });

  if (currency) {
    throw new Error("Already Exists");
  }

  res.locals.name = 'addPriceCurrency';
  res.locals.result = await db.currency.create({
    type: req.body.type,
    currency_name: req.body.name,
    iso: req.body.iso,
  });

  next();
};
