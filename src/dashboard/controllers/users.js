import { Op } from 'sequelize';
import db from '../../models';

export const banUser = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
    });
    res.locals.user = await user.update({
      banned: !user.banned,
      banMessage: req.body.banMessage,
    });
  } catch (err) {
    res.locals.error = err;
    console.log(err);
  }
  next();
};

export const fetchUsers = async (req, res, next) => {
  const userOptions = {};
  if (req.body.id !== '') {
    userOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.userId !== '') {
    userOptions.user_id = { [Op.like]: `%${req.body.userId}%` };
  }
  if (req.body.username !== '') {
    userOptions.username = { [Op.like]: `%${req.body.username}%` };
  }
  if (req.body.platform !== 'all') {
    if (req.body.platform === 'telegram') {
      userOptions.user_id = { [Op.startsWith]: 'telegram-' };
    }
    if (req.body.platform === 'discord') {
      userOptions.user_id = { [Op.startsWith]: 'discord-' };
    }
  }
  if (req.body.banned !== 'all') {
    if (req.body.banned === 'true') {
      userOptions.banned = true;
    }
    if (req.body.banned === 'false') {
      userOptions.banned = false;
    }
  }

  const options = {
    order: [
      ['id', 'DESC'],
    ],
    where: userOptions,
    include: [
      {
        model: db.wallet,
        as: 'wallet',
      },
    ],
  };

  res.locals.users = await db.user.findAll(options);
  // console.log(res.locals.users);
  next();
};
