import db from '../../models';

export const healthCheck = async (
  req,
  res,
  next,
) => {
  const dbHealth = await db.sequelize.authenticate();
  res.locals.name = 'healthcheck';
  res.locals.result = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };
  next();
};
