import { Op, Sequelize } from 'sequelize';
import db from '../../models';

export const fetchFloods = async (
  req,
  res,
  next,
) => {
//   const userOptions = {};
//   if (req.body.id !== '') {
//     userOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
//   }
//   if (req.body.address !== '') {
//     userOptions.address = { [Op.like]: `%${req.body.address}%` };
//   }

  console.log('fetchRains');
  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    // where: userOptions,
    include: [
      {
        model: db.user,
        as: 'user',
        attributes: [
          'id',
          'username',
          'user_id',
        ],
      },
      {
        model: db.group,
        as: 'group',
        attributes: [
          'id',
          'groupName',
          'groupId',
        ],
      },
    //   {
    //     model: db.raintip,
    //     as: 'raintips',
    //     attributes: ['id'],
    //   },
    ],
  };

  res.locals.name = 'flood';
  res.locals.count = await db.flood.count(options);
  res.locals.result = await db.flood.findAll(options);
  next();
};

export const fetchFlood = async (
  req,
  res,
  next,
) => {
  const options = {
    where: {
      id: req.body.id,
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
      {
        model: db.user,
        as: 'user',
      },
      {
        model: db.floodtip,
        as: 'floodtips',
        include: [
          {
            model: db.user,
            as: 'user',
            include: [
              {
                model: db.wallet,
                as: 'wallet',
              },
            ],
          },
        ],
      },
    ],
  };

  res.locals.name = 'flood';
  res.locals.result = await db.flood.findOne(options);
  next();
};
