// import { parseDomain } from "parse-domain";
import BigNumber from "bignumber.js";
import db from '../../models';

export const updateFeature = async (
  req,
  res,
  next,
) => {
  const amount = new BigNumber(req.body.min).times(1e8).toNumber();
  const fee = new BigNumber(req.body.fee).times(1e2).toNumber();
  const maxSampleSize = Number(req.body.maxSampleSize);
  console.log(fee);
  console.log('fee');
  // Validate Fee
  if (maxSampleSize % 1 !== 0) {
    throw new Error("invalid number");
  }
  if (maxSampleSize > 8000) {
    throw new Error("Max Sample Size is 8000");
  }
  if (fee % 1 !== 0) {
    throw new Error("invalid number");
  }
  if (fee < 0) {
    throw new Error("minimum fee is 0.00%");
  }
  if (fee > 5000) {
    throw new Error("maximum fee is 50%");
  }

  // validate Amount
  if (amount % 1 !== 0) {
    throw new Error("invalid number");
  }
  if (amount < 1e4) {
    throw new Error(`minimum amount is ${1e4 / 1e8}`);
  }
  const feature = await db.features.findOne({
    where: {
      id: req.body.id,
    },
  });
  const updatedFeature = await feature.update({
    min: amount,
    fee,
    maxSampleSize,
    dashboardUserId: req.user.id,
    enabled: req.body.enabled,
  });
  res.locals.name = 'updateFeature';
  res.locals.result = await db.features.findOne({
    where: {
      id: updatedFeature.id,
    },
    include: [
      {
        model: db.dashboardUser,
        as: 'dashboardUser',
        required: false,
      },
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

export const removeFeature = async (
  req,
  res,
  next,
) => {
  const feature = await db.features.findOne({
    where: {
      id: req.body.id,
    },
  });
  res.locals.name = 'removeFeature';
  res.locals.result = feature;
  feature.destroy();
  next();
};

export const fetchFeatures = async (
  req,
  res,
  next,
) => {
  const options = {
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.dashboardUser,
        as: 'dashboardUser',
        required: false,
      },
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

  res.locals.name = 'features';
  res.locals.count = await db.features.count(options);
  res.locals.result = await db.features.findAll(options);
  next();
};

export const addFeature = async (
  req,
  res,
  next,
) => {
  // console.log(req.body);
  const featureOptions = {
    type: 'local',
  };
  if (!req.body.feature) {
    throw new Error("Feature is required");
  }
  if (!req.body.server) {
    throw new Error("Server is required");
  }
  if (!req.body.min) {
    throw new Error("Minimum is required");
  }
  if (!req.body.fee) {
    throw new Error("Fee is required");
  }
  if (!req.body.enabled) {
    throw new Error("Enable is required");
  }
  const amount = new BigNumber(req.body.min).times(1e8).toNumber();
  const fee = new BigNumber(req.body.fee).times(1e2).toNumber();
  // Validate Fee
  if (fee % 1 !== 0) {
    throw new Error("invalid number");
  }
  if (fee < 1) {
    throw new Error("minimum fee is 0.01%");
  }
  if (req.body.feature === 'faucet') {
    if (fee > 2500) {
      throw new Error("maximum fee for faucet is 25%");
    }
  } else if (req.body.feature !== 'faucet') {
    if (fee > 200) {
      throw new Error("maximum fee is 2%");
    }
  }

  // Validate Amount
  if (amount % 1 !== 0) {
    throw new Error("invalid number");
  }
  if (amount < 1e4) {
    throw new Error(`minimum amount is ${1e4 / 1e8}`);
  }

  if (req.body.feature) {
    featureOptions.name = req.body.feature;
  }
  if (req.body.server) {
    featureOptions.groupId = Number(req.body.server);
  }
  if (req.body.channel && req.body.channel !== 'all') {
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
    throw new Error("Already Exists");
  }

  const newFeature = await db.features.create({
    type: 'local',
    name: req.body.feature,
    groupId: req.body.server,
    channelId: req.body.channel && req.body.channel !== 'all' ? req.body.channel : null,
    min: amount,
    fee,
    dashboardUserId: req.user.id,
    enabled: req.body.enabled === 'enable',
  });

  res.locals.name = 'addFeature';
  res.locals.result = await db.features.findOne({
    where: {
      id: newFeature.id,
    },
    include: [
      {
        model: db.dashboardUser,
        as: 'dashboardUser',
        required: false,
      },
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
  return next();
};
