import db from '../../models';

export const fetchErrors = async (
  req,
  res,
  next,
) => {
  const userOptions = {};

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    limit: req.body.limit,
    offset: req.body.offset,
    where: userOptions,
  };
  res.locals.count = await db.error.count(options);
  res.locals.errors = await db.error.findAll(options);
  next();
};
