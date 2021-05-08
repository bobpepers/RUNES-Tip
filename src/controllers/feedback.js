import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch PriceInfo
 */
export const updateFeedback = async (req, res, next) => {
  console.log(req.body);
  console.log('wtf');
  const userToRate = await db.user.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (!userToRate) {
    res.locals.error = 'USER_TO_RATE_NOT_FOUND';
    return next();
  }
  if (userToRate.id === req.user.id) {
    res.locals.error = 'CANNOT_RATE_SELF';
    return next();
  }
  const findRating = await db.rating.findOne({
    where: {
      userRatingId: req.user.id,
      userRatedId: userToRate.id,
    },
  });

  console.log('findRating');
  console.log(findRating);

  if (!findRating) {
    console.log('AAAAAAAAAAAAAAA');
    const newRating = await db.rating.create({
      userRatingId: req.user.id,
      userRatedId: userToRate.id,
      feedback: req.body.feedback,
      rating: req.body.stars,
    });
    console.log("newRating");
    console.log(newRating);
    res.locals.rating = await db.rating.findOne({
      where: {
        id: newRating.id,
      },
      attributes: [
        'id',
        'rating',
        'feedback',
        'updatedAt',
      ],
      include: [
        {
          model: db.user,
          as: 'userRating',
        },
        {
          model: db.user,
          as: 'userRated',
        },
      ],
    });
    if (!res.locals.rating) {
      res.locals.error = 'RATING_NOT_FOUND';
      return next();
    }
    // res.locals.error = 'USER_TO_TRUST_NOT_FOUND';
    return next();
  }
  if (findRating) {
    const findRatingUpdated = await findRating.update({
      feedback: req.body.feedback,
      rating: req.body.stars,
    });
    res.locals.rating = await db.rating.findOne({
      where: {
        id: findRatingUpdated.id,
      },
      attributes: [
        'id',
        'rating',
        'feedback',
        'updatedAt',
      ],
      include: [
        {
          model: db.user,
          as: 'userRating',
        },
        {
          model: db.user,
          as: 'userRated',
        },
      ],
    });
    if (!res.locals.rating) {
      res.locals.error = 'RATING_NOT_FOUND';
      return next();
    }

    return next();
  }
  return next();
};

export const removeFeedback = async (req, res, next) => {
  console.log(req.body.username);
  console.log('wtf');
  const user = await db.user.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    res.locals.error = 'USER_NOT_FOUND';
    return next();
  }

  const rating = await db.rating.findOne({
    where: {
      userRatedId: user.id,
      userRatingId: req.user.id,
    },
    include: [
      {
        model: db.user,
        as: 'userRating',
      },
      {
        model: db.user,
        as: 'userRated',
      },
    ],
  });

  if (!rating) {
    res.locals.error = 'RATING_NOT_FOUND';
    return next();
  }

  await rating.destroy();

  res.locals.removed = req.user.username;
  return next();
};

export const fetchAverageRating = async (req, res, next) => {
  console.log(req.body);
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
