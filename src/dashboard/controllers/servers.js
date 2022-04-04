import { Op } from 'sequelize';
import db from '../../models';

export const banServer = async (
  req,
  res,
  next,
) => {
  console.log('ban server');
  try {
    const group = await db.group.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.server = await group.update({
      banned: !group.banned,
      banMessage: req.body.banMessage,
    });
  } catch (err) {
    res.locals.error = err;
    console.log(err);
  }
  next();
};

export const fetchServers = async (req, res, next) => {
  const userOptions = {};
  if (req.body.platform !== 'all') {
    if (req.body.platform === 'telegram') {
      userOptions.groupId = { [Op.startsWith]: 'telegram-' };
    }
    if (req.body.platform === 'discord') {
      userOptions.groupId = { [Op.startsWith]: 'discord-' };
    }
  }
  if (req.body.id !== '') {
    userOptions.id = Number(req.body.id);
  }
  if (req.body.groupId !== '') {
    userOptions.groupId = req.body.groupId;
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    where: userOptions,
  };
  res.locals.servers = await db.group.findAll(options);
  next();
};
