import { Op, Sequelize } from 'sequelize';
import db from '../../models';

export const fetchHurricanes = async (
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

  res.locals.name = 'hurricane';
  res.locals.count = await db.hurricane.count(options);
  res.locals.result = await db.hurricane.findAll(options);
  next();
};

export const fetchHurricane = async (
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
        model: db.hurricanetip,
        as: 'hurricanetips',
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

  res.locals.name = 'hurricane';
  res.locals.result = await db.hurricane.findOne(options);
  next();
};
