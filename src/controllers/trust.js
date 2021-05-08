import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
const trustUser = async (req, res, next) => {
  console.log('wtf');
  const userToTrust = await db.user.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!userToTrust) {
    res.locals.error = 'USER_TO_TRUST_NOT_FOUND';
    return next();
  }

  const trust = await db.trusted.findOne({
    where: {
      userId: req.user.id,
      trustedId: userToTrust.id,
    },
  });
  // let newRecord;
  if (!trust) {
    const newRecord = await db.trusted.create({
      userId: req.user.id,
      trustedId: userToTrust.id,
    });
    console.log('created');
    res.locals.trusted = await db.trusted.findOne({
      where: {
        id: newRecord.id,
      },
      attributes: ['id'],
      include: [
        {
          model: db.user,
          as: 'userTrust',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'userTrusted',
          required: false,
          attributes: ['username'],
        },
      ],
    });
    return next();
  }
  trust.destroy();
  res.locals.removed = req.body.username;
  return next();
};

export default trustUser;
