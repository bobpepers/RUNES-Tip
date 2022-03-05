import db from '../../models';

const { Op } = require('sequelize');

export const fetchErrors = async (req, res, next) => {
  const userOptions = {};

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    where: userOptions,
  };
  res.locals.errors = await db.error.findAll(options);
  next();
};
