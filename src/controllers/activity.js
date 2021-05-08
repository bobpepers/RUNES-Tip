import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

export const fetchActivity = async (req, res, next) => {
  try {
    res.locals.activity = await db.activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      attributes: [
        'createdAt',
        'type',
        'amount',
      ],
      include: [
        {
          model: db.publisher,
          as: 'publisher',
          required: false,
          attributes: ['id', 'subdomain'],
          include: [
            {
              model: db.domain,
              as: 'domain',
              required: false,
              attributes: ['domain'],
            },
          ],
        },
        {
          model: db.bannerOrder,
          as: 'bannerOrder',
          required: false,
          attributes: ['price', 'amount', 'filled'],
          include: [
            {
              model: db.banner,
              as: 'banner',
              required: false,
              include: [
                {
                  model: db.domain,
                  as: 'domain',
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'earner',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.ip,
          as: 'ip',
          required: false,
          attributes: ['address'],
        },
        {
          model: db.domain,
          as: 'domainActivity',
          required: false,
          attributes: ['domain'],
        },
        {
          model: db.transaction,
          as: 'txActivity',
          required: false,
          attributes: ['txid'],
        },
        {
          model: db.order,
          as: 'order',
          required: false,
          attributes: ['price', 'amount', 'filled'],
          include: [
            {
              model: db.webslot,
              as: 'webslot',
              required: false,
              attributes: ['protocol', 'subdomain', 'path', 'search'],
              include: [
                {
                  model: db.domain,
                  as: 'domain',
                  required: false,
                  attributes: ['domain', 'views'],
                },
              ],
            },
          ],
        },
      ],
    });
    // console.log(res.locals.activity);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchRecentUserActivity = async (req, res, next) => {
  try {
    const activities = await db.activity.findAll({
      order: [['id', 'DESC']],
      where: {
        [Op.or]: [
          {
            spenderId: req.user.id,
          },
          {
            earnerId: req.user.id,
          }],
      },
      attributes: [
        'createdAt',
        'type',
        'amount',
        'earner_balance',
        'spender_balance',
        // 'earnerId',
        'spenderId',
      ],
      include: [
        {
          model: db.ip,
          as: 'ip',
          required: false,
        },
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'earner',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.ip,
          as: 'ip',
          required: false,
          attributes: ['address'],
        },
        {
          model: db.transaction,
          as: 'txActivity',
          required: false,
          attributes: ['txid'],
        },
      ],
    });
    res.locals.activity = activities.map((activity) => {
      const tmpActivity = activity;
      if (tmpActivity.spenderId === req.user.id) {
        if (tmpActivity.type === "referralBonus") {
          return false;
        }
        if (tmpActivity.type === "surfStart" || tmpActivity.type === "surfComplete") {
          // delete tmpActivity.dataValues.earnerId;
          delete tmpActivity.dataValues.spenderId;
          delete tmpActivity.dataValues.ip;
          return tmpActivity;
        }
      }
      // delete tmpActivity.dataValues.spenderId;
      delete tmpActivity.dataValues.earnerId;
      return tmpActivity;
    });
    // console.log('res.locals.activity');
    // console.log(res.locals.activity);
    // console.log('res.locals.activity');
    // console.log(req.user.id);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};
