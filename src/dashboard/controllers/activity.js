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
          userId: {
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
          userId: {
            [Op.like]: `%${req.body.earner}%`,
          },
        },
      ],
    };
  }

  const options = {
    where: activityOptions,
    order: [
      ['id', 'DESC'],
    ],
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
    ],
  };
  res.locals.activity = await db.activity.findAll(options);
  next();
};
