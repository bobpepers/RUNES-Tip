import db from '../../models';

export const updateBotSettings = async (
  req,
  res,
  next,
) => {
  const settings = await db.bots.findOne({
    where: {
      id: req.body.id,
    },
  });

  if (!settings) {
    res.locals.error = "Settings doesn't Exists";
    next();
  }
  res.locals.settings = await settings.update({
    enabled: req.body.enabled,
    maintenance: req.body.maintenance,
  });
  next();
};

export const fetchBotSettings = async (
  req,
  res,
  next,
) => {
  res.locals.settings = await db.bots.findAll();
  next();
};
