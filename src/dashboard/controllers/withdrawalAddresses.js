import { Op, Sequelize } from 'sequelize';
import db from '../../models';

export const fetchWithdrawalAddresses = async (
  req,
  res,
  next,
) => {
  const userOptions = {};
  if (req.body.id !== '') {
    userOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.address !== '') {
    userOptions.address = { [Op.like]: `%${req.body.address}%` };
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    where: userOptions,
    include: [
      {
        model: db.transaction,
        as: 'transactions',
        // limit: 1,
        order: [['createdAt', 'DESC']],
        attributes: ['createdAt'],
      },
      {
        model: db.user,
        as: 'users',
        through: { attributes: [] },
        // attributes: ['id'],
        // required: false,
      },
    ],
    // group: ['id'],
  };

  res.locals.count = await db.addressExternal.count(options);
  res.locals.withdrawalAddresses = await db.addressExternal.findAll(options);
  console.log('res.locals.withdrawalAddresses');
  console.log(res.locals.withdrawalAddresses);
  next();
};

export const fetchWithdrawalAddress = async (
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
        model: db.transaction,
        as: 'transactions',
        order: [['createdAt', 'DESC']],
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
      {
        model: db.user,
        as: 'users',
        through: { attributes: [] },
      },
    ],
  };

  res.locals.count = await db.addressExternal.count(options);
  res.locals.withdrawalAddress = await db.addressExternal.findOne(options);
  console.log('res.locals.withdrawalAddresses');
  console.log(res.locals.withdrawalAddress);
  next();
};
