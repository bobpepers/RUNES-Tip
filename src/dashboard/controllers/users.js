// import { parseDomain } from "parse-domain";
import db from '../../models';

const { Op } = require('sequelize');

export const banUser = async (req, res, next) => {
  console.log('banUser');
  next();
};

export const fetchUsers = async (req, res, next) => {
  const userOptions = {};
  if (req.body.id !== '') {
    userOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.userId !== '') {
    userOptions.userId = { [Op.like]: `%${req.body.userId}%` };
  }
  if (req.body.username !== '') {
    userOptions.username = { [Op.like]: `%${req.body.username}%` };
  }
  if (req.body.platform !== 'all') {
    if (req.body.platform === 'telegram') {
      userOptions.userId = { [Op.startsWith]: 'telegram-' };
    }
    if (req.body.platform === 'discord') {
      userOptions.userId = { [Op.startsWith]: 'discord-' };
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
  console.log(res.locals.users);
  next();
};
