import db from '../models';

import { Sequelize, Transaction, Op } from "sequelize";

/**
 * Fetch PriceInfo
 */
const blockUser = async (req, res, next) => {
  console.log('wtf');
  const userToBlock = await db.user.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!userToBlock) {
    res.locals.error = 'USER_TO_TRUST_NOT_FOUND';
    return next();
  }

  const block = await db.blocked.findOne({
    where: {
      userId: req.user.id,
      blockedId: userToBlock.id,
    },
  });
  // let newRecord;
  if (!block) {
    const newRecord = await db.blocked.create({
      userId: req.user.id,
      blockedId: userToBlock.id,
    });
    console.log('created');
    res.locals.blocked = await db.blocked.findOne({
      where: {
        id: newRecord.id,
      },
      attributes: ['id'],
      include: [
        {
          model: db.user,
          as: 'userBlock',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'userBlocked',
          required: false,
          attributes: ['username'],
        },
      ],
    });
    return next();
  }
  block.destroy();
  res.locals.removed = req.body.username;
  return next();
};

export default blockUser;
