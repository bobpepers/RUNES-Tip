// import { parseDomain } from "parse-domain";
import BigNumber from "bignumber.js";
import db from '../../models';

const { Op } = require('sequelize');

export const updateFeature = async (req, res, next) => {
  const amount = new BigNumber(req.body.min).times(1e8).toNumber();
  if (amount % 1 !== 0) {
    res.locals.error = "invalid number";
    next();
  }
  if (amount < 1e4) {
    res.locals.error = `minimum amount is ${1e4 / 1e8}`;
    next();
  }
  const feature = await db.features.findOne({
    where: {
      id: req.body.id,
    },
  });
  const updatedFeature = await feature.update({
    min: amount,
    enabled: req.body.enabled,
  });
  res.locals.feature = await db.features.findOne({
    where: {
      id: updatedFeature.id,
    },
    include: [
      {
        model: db.channel,
        as: 'channel',
        required: false,
      },
      {
        model: db.group,
        as: 'group',
        required: false,
      },
    ],
  });
  next();
};

export const removeFeature = async (req, res, next) => {
  const feature = await db.features.findOne({
    where: {
      id: req.body.id,
    },
  });
  res.locals.feature = feature;
  feature.destroy();
  next();
};

export const fetchFeatures = async (req, res, next) => {
  console.log(req.body);

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.channel,
        as: 'channel',
        required: false,
      },
      {
        model: db.group,
        as: 'group',
        required: false,
      },
    ],
  };
  res.locals.features = await db.features.findAll(options);
  next();
};

export const addFeature = async (req, res, next) => {
  console.log(req.body);
  const featureOptions = {
    type: 'local',
  };
  if (!req.body.feature) {
    res.locals.error = 'Feature is required';
    next();
  }
  if (!req.body.server) {
    res.locals.error = 'Server is required';
    next();
  }
  if (!req.body.min) {
    res.locals.error = 'Minimum is required';
    next();
  }
  if (!req.body.enabled) {
    res.locals.error = 'Enable is required';
    next();
  }
  const amount = new BigNumber(req.body.min).times(1e8).toNumber();
  if (amount % 1 !== 0) {
    res.locals.error = "invalid number";
    next();
  }
  if (amount < 1e4) {
    res.locals.error = `minimum amount is ${1e4 / 1e8}`;
    next();
  }

  if (req.body.feature) {
    featureOptions.name = req.body.feature;
  }
  if (req.body.server) {
    featureOptions.groupId = Number(req.body.server);
  }
  if (req.body.channel) {
    featureOptions.channelId = req.body.channel;
  }

  const options = {
    where: featureOptions,
    order: [
      ['id', 'DESC'],
    ],
  };

  const feature = await db.features.findOne(options);

  if (feature) {
    res.locals.error = "Already Exists";
    next();
  }

  if (!feature) {
    const newFeature = await db.features.create({
      type: 'local',
      name: req.body.feature,
      groupId: req.body.server,
      channelId: req.body.channel ? req.body.channel : null,
      min: amount,
      enabled: req.body.enabled === 'enable',
    });
    res.locals.feature = await db.features.findOne({
      where: {
        id: newFeature.id,
      },
      include: [
        {
          model: db.group,
          as: 'group',
          required: false,
        },
        {
          model: db.channel,
          as: 'channel',
          required: false,
        },
      ],
    });
    console.log(res.locals.feature);
    next();
  }

  next();
};
