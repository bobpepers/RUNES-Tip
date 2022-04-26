import { Op, Sequelize } from 'sequelize';
import db from '../../models';

export const fetchRains = async (
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

  res.locals.count = await db.rain.count(options);
  res.locals.rains = await db.rain.findAll(options);
  console.log('res.locals.rains');
  console.log(res.locals.rains);
  next();
};

export const fetchRain = async (
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
        model: db.raintip,
        as: 'raintips',
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

  res.locals.rain = await db.rain.findOne(options);
  console.log('res.locals.rain');
  console.log(res.locals.rain);
  next();
};
