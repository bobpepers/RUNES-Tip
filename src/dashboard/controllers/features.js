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
    res.locals.error = "invalid number";
    return next();
  }
  if (maxSampleSize > 8000) {
    res.locals.error = "Max Sample Size is 8000";
    return next();
  }
  if (fee % 1 !== 0) {
    res.locals.error = "invalid number";
    return next();
  }
  if (fee < 0) {
    res.locals.error = "minimum fee is 0.00%";
    return next();
  }
  if (fee > 5000) {
    res.locals.error = "maximum fee is 50%";
    return next();
  }

  // validate Amount
  if (amount % 1 !== 0) {
    res.locals.error = "invalid number";
    return next();
  }
  if (amount < 1e4) {
    res.locals.error = `minimum amount is ${1e4 / 1e8}`;
    return next();
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
  res.locals.feature = await db.features.findOne({
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
  res.locals.feature = feature;
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
  res.locals.features = await db.features.findAll(options);
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
    res.locals.error = 'Feature is required';
    return next();
  }
  if (!req.body.server) {
    res.locals.error = 'Server is required';
    return next();
  }
  if (!req.body.min) {
    res.locals.error = 'Minimum is required';
    return next();
  }
  if (!req.body.fee) {
    res.locals.error = 'Fee is required';
    return next();
  }
  if (!req.body.enabled) {
    res.locals.error = 'Enable is required';
    return next();
  }
  const amount = new BigNumber(req.body.min).times(1e8).toNumber();
  const fee = new BigNumber(req.body.fee).times(1e2).toNumber();
  // Validate Fee
  if (fee % 1 !== 0) {
    res.locals.error = "invalid number";
    return next();
  }
  if (fee < 1) {
    res.locals.error = "minimum fee is 0.01%";
    return next();
  }
  if (req.body.feature === 'faucet') {
    if (fee > 2500) {
      res.locals.error = "maximum fee for faucet is 25%";
      return next();
    }
  } else if (req.body.feature !== 'faucet') {
    if (fee > 200) {
      res.locals.error = "maximum fee is 2%";
      return next();
    }
  }

  // Validate Amount
  if (amount % 1 !== 0) {
    res.locals.error = "invalid number";
    return next();
  }
  if (amount < 1e4) {
    res.locals.error = `minimum amount is ${1e4 / 1e8}`;
    return next();
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
    res.locals.error = "Already Exists";
    return next();
  }

  if (!feature) {
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
    res.locals.feature = await db.features.findOne({
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
    // console.log(res.locals.feature);
    return next();
  }
  return next();
};
