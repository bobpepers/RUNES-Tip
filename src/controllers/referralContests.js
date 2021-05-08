import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

function sortObject(obj) {
  const arr = [];
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        key: prop,
        value: obj[prop],
      });
    }
  }
  arr.sort((a, b) => a.value - b.value);
  // arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
  return arr; // returns array
}

/**
 * Fetch PriceInfo
 */
export const fetchReferralWeekStats = async (req, res, next) => {
  try {
    const constestReferral = await db.referralContest.findOne({
      order: [['id', 'DESC']],

    });
    const referrals = await db.Referrals.findAll({
      where: {
        [Op.and]: [
          {
            createdAt: { [Op.gte]: new Date(constestReferral.startsAt) },
          },
          {
            createdAt: { [Op.lte]: new Date(constestReferral.endsAt) },
          },
        ],
      },
      include: [
        {
          model: db.user,
          // required: false,
          as: 'userReferred',
          attributes: [
            'id',
            'username',
            'firstTrade',
            'authused',
            'identityVerified',
          ],
          where: {
            [Op.and]: [
              {
                firstTrade: { [Op.ne]: null },
              },
              {
                authused: true,
              },
              {
                phoneNumberVerified: true,
              },
              {
                identityVerified: 'accepted',
              },
            ],
          },
        },
        {
          model: db.user,
          // required: false,
          as: 'userReferrer',
          attributes: [
            'id',
            'username',
            'firstTrade',
            'authused',
            'identityVerified',
          ],
          where: {
            [Op.and]: [
              {
                firstTrade: {
                  [Op.ne]: null,
                },
              },
              {
                authused: true,
              },
              {
                phoneNumberVerified: true,
              },
              {
                identityVerified: 'accepted',
              },
            ],
          },
          include: [
            {
              model: db.wallet,
              // required: false,
              as: 'wallet',
              attributes: [
                'available',
                'locked',
              ],
              where: {
                available: {
                  [Op.gte]: 20000000000,
                },
              },
            },
          ],
        },
      ],
    });

    const result = [];

    for (let i = 0; i < referrals.length; ++i) { // loop over array
      if (!result[referrals[i].userReferred.username]) { // if no key for that number yet
        result[referrals[i].userReferred.username] = 0; // then make one
      }

      ++result[referrals[i].userReferred.username]; // increment the property for that number
      console.log(result);
    }

    //
    // const entries = Object.entries(result);
    // const sorted = entries.sort((a, b) => a[1] - b[1]);
    const sorted = sortObject(result);
    const revSorted = sorted.reverse();
    res.locals.stats = revSorted;
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchReferralRewards = async (req, res, next) => {
  try {
    console.log('123');
    const rewards = await db.contestRewards.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    });

    res.locals.rewards = rewards;
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchReferralContests = async (req, res, next) => {
  try {
    const contests = await db.referralContest.findAll({
      // limit: 1,
      order: [['id', 'DESC']],
      include: [
        {
          model: db.user,
          as: 'winner_first',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_second',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_third',
          required: false,
          attributes: ['username'],
        },
      ],
    });
    res.locals.contests = contests;
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};
