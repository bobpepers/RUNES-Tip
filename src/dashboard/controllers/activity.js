// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const fetchActivity = async (req, res, next) => {
  console.log(req.body);
  const activityOptions = {};
  let spenderOptions = {};
  let earnerOptions = {};

  if (req.body.id !== '') {
    activityOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.type !== '') {
    activityOptions.type = { [Op.like]: `%${req.body.type}%` };
  }
  if (req.body.spender !== '') {
    spenderOptions = {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${req.body.spender}%`,
          },
        },
        {
          id: {
            [Op.like]: `%${req.body.spender}%`,
          },
        },
      ],
    };
  }
  if (req.body.earner !== '') {
    earnerOptions = {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${req.body.earner}%`,
          },
        },
        {
          id: {
            [Op.like]: `%${req.body.earner}%`,
          },
        },
      ],
    };
  }
  console.log(earnerOptions);
  const options = {
    where: activityOptions,
    order: [
      ['id', 'DESC'],
    ],
    limit: 300,
    include: [
      {
        model: db.user,
        as: 'spender',
        where: spenderOptions,
        required: false,
      },
      {
        model: db.user,
        as: 'earner',
        where: earnerOptions,
        required: false,
      },
      {
        model: db.flood,
        as: 'flood',
        required: false,
      },
      {
        model: db.floodtip,
        as: 'floodtip',
        required: false,
      },
      {
        model: db.rain,
        as: 'rain',
        required: false,
      },
      {
        model: db.raintip,
        as: 'raintip',
        required: false,
      },
      {
        model: db.soak,
        as: 'soak',
        required: false,
      },
      {
        model: db.soaktip,
        as: 'soaktip',
        required: false,
      },
      {
        model: db.sleet,
        as: 'sleet',
        required: false,
      },
      {
        model: db.sleettip,
        as: 'sleettip',
        required: false,
      },
      {
        model: db.reactdrop,
        as: 'reactdrop',
        required: false,
      },
      {
        model: db.reactdroptip,
        as: 'reactdroptip',
        required: false,
      },
      {
        model: db.thunder,
        as: 'thunder',
        required: false,
      },
      {
        model: db.thundertip,
        as: 'thundertip',
        required: false,
      },
      {
        model: db.thunderstorm,
        as: 'thunderstorm',
        required: false,
      },
      {
        model: db.thunderstormtip,
        as: 'thunderstormtip',
        required: false,
      },
    ],
  };
  res.locals.activity = await db.activity.findAll(options);
  next();
};
