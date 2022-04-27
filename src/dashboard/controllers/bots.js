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
    throw new Error("Settings doesn't Exists");
  }

  res.locals.name = "updateBotSettings";
  res.locals.result = await settings.update({
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
  res.locals.name = 'botSettings';
  res.locals.count = await db.bots.count();
  res.locals.result = await db.bots.findAll();
  next();
};
