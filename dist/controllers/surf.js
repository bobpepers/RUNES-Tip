'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.surfStart = exports.surfComplete = undefined;

var _lodash = require('lodash');

var _generate = require('../helpers/generate');

var _generateRandomString = require('../helpers/generateRandomString');

var _generateRandomString2 = _interopRequireDefault(_generateRandomString);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// import db from '../services/database';


var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Complete Surf
 */


var surfComplete = exports.surfComplete = async function surfComplete(req, res, next) {
  var now = Math.floor(Date.now() / 1000);

  if (!req.body.verificationCode) {
    res.locals.error = "VERIFICATION_CODE_MISSING";
    next();
  }

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var checkstats = await _models2.default.stats.findOne({
      where: {
        id: 1
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!checkstats) {
      await _models2.default.stats.create({
        id: 1
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }
    if (checkstats) {
      console.log('exists');
    }
    var ticket = await _models2.default.SurfTicket.findOne({
      where: {
        userId: req.user.id,
        code: req.body.verificationCode
      },
      include: [{
        model: _models2.default.order,
        as: 'order',
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          include: [{
            model: _models2.default.domain,
            as: 'domain'
          }, {
            model: _models2.default.user,
            as: 'user',
            attributes: ['id', 'jackpot_tickets', 'surf_count'],
            include: [{
              model: _models2.default.wallet,
              as: 'wallet'
            }]
          }]
        }]
      }, {
        model: _models2.default.user,
        as: 'user',
        attributes: ['id', 'jackpot_tickets', 'surf_count'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!ticket) {
      throw new Error('SURF_TICKET_NOT_FOUND');
    }

    if (ticket.createdAt > new Date(Date.now() - 1 * 60 * 1000)) {
      throw new Error('SURF_TOO_FAST');
    }

    var order = await ticket.order.update({
      filled: ticket.order.filled + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (order.filled >= order.amount) {
      await order.update({
        phase: 'fulfilled'
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    var fee = order.price / 100 * 2;

    var userWallet1 = await ticket.user.wallet.update({
      available: ticket.user.wallet.available + ticket.order.price - fee,
      earned: ticket.user.wallet.earned + ticket.order.price - fee
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // const surfCounter = await ticket.user.update({
    //  surf_count: ticket.user.surf_count + 1,
    // }, {
    //  transaction: t,
    //  lock: t.LOCK.UPDATE,
    // });

    var userWallet2 = await ticket.order.webslot.user.wallet.update({
      locked: ticket.order.webslot.user.wallet.locked - ticket.order.price,
      spend: ticket.order.webslot.user.wallet.spend + ticket.order.price
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var webslot = await ticket.order.webslot.update({
      views: ticket.order.webslot.views + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var domain = await ticket.order.webslot.domain.update({
      views: ticket.order.webslot.domain.views + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var previousStats = await _models2.default.stats.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!previousStats) {
      throw new Error('STATS_NOT_FOUND');
    }

    var lastStats = await previousStats[0].update({
      surf: previousStats[0].surf + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var createActivity = await _models2.default.activity.create({
      type: 'surfComplete',
      amount: ticket.order.price - fee,
      earnerId: ticket.user.id,
      earner_balance: userWallet1.locked + userWallet1.available,
      spenderId: ticket.order.webslot.user.id,
      spender_balance: userWallet2.locked + userWallet2.available,
      orderId: ticket.order.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.findOne({
      where: {
        id: createActivity.id
      },
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.order,
        as: 'order',
        required: false,
        attributes: ['price', 'amount', 'filled'],
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          required: false,
          attributes: ['protocol', 'subdomain', 'path', 'search'],
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            required: false,
            attributes: ['domain', 'views']
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var user1 = await ticket.user.update({
      jackpot_tickets: ticket.user.jackpot_tickets + 1,
      surf_count: ticket.user.surf_count + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var user2 = await ticket.order.webslot.user.update({
      jackpot_tickets: ticket.order.webslot.user.jackpot_tickets + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpot = await _models2.default.jackpot.findOne({
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var updatedJackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + fee / 2
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    console.log(ticket);
    var isReferredUser1 = await _models2.default.Referrals.findOne({
      where: {
        referrerID: ticket.userId
      },
      include: [{
        model: _models2.default.user,
        as: 'userReferred',
        attributes: ['id', 'username'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var isReferredUser2 = await _models2.default.Referrals.findOne({
      where: {
        referrerID: ticket.order.webslot.userId
      },
      include: [{
        model: _models2.default.user,
        as: 'userReferred',
        attributes: ['id', 'username'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var referralCut = fee / 100 * 15;
    console.log('before if referred');
    if (isReferredUser1) {
      console.log(isReferredUser1.userReferred.wallet);
      await isReferredUser1.update({
        earned: isReferredUser1.earned + referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredWallet1 = await isReferredUser1.userReferred.wallet.update({
        available: isReferredUser1.userReferred.wallet.available + referralCut,
        earned: isReferredUser1.userReferred.wallet.earned + referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      var createReferredActivity1 = await _models2.default.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet1.userId,
        earner_balance: res.locals.referredWallet1.locked + res.locals.referredWallet1.available,
        spenderId: ticket.userId,
        orderId: ticket.order.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredActivity1 = await _models2.default.activity.findOne({
        where: {
          id: createReferredActivity1.id
        },
        attributes: ['createdAt', 'type', 'amount'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.user,
          as: 'spender',
          required: false,
          attributes: ['username']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    if (isReferredUser2) {
      await isReferredUser2.update({
        earned: isReferredUser2.earned + referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredWallet2 = await isReferredUser2.userReferred.wallet.update({
        available: isReferredUser2.userReferred.wallet.available + referralCut,
        earned: isReferredUser2.userReferred.wallet.earned + referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      var createReferredActivity2 = await _models2.default.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet2.userId,
        earner_balance: res.locals.referredWallet2.locked + res.locals.referredWallet2.available,
        spenderId: ticket.order.webslot.userId,
        orderId: ticket.order.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredActivity2 = await _models2.default.activity.findOne({
        where: {
          id: createReferredActivity2.id
        },
        attributes: ['createdAt', 'type', 'amount'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.user,
          as: 'spender',
          required: false,
          attributes: ['username']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    await ticket.destroy({
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.surfcount = user1.surf_count;
    res.locals.jackpot = updatedJackpot;
    res.locals.order = order;
    res.locals.userWallet2 = userWallet2;
    res.locals.userId2 = ticket.order.webslot.user.id;
    res.locals.user2_jackpot_tickets = user2.jackpot_tickets;
    res.locals.userWallet1 = userWallet1;
    res.locals.userId1 = req.user.id;
    res.locals.user1_jackpot_tickets = user1.jackpot_tickets;
    res.locals.domain = domain;
    res.locals.webslot = webslot;
    res.locals.lastStats = lastStats;
    res.locals.activity = activity;
    t.afterCommit(function () {
      next();
      console.log('commited');
    });
  }).catch(function (err) {
    console.log('surfcomplete error');
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

/**
 * Start a Surf
 */
var surfStart = exports.surfStart = async function surfStart(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    console.log('const surf start');
    var existingTicket = await _models2.default.SurfTicket.findOne({
      where: {
        userId: req.user.id
      },
      include: [{
        model: _models2.default.order,
        as: 'order',
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          include: [{
            model: _models2.default.domain,
            as: 'domain'
          }, {
            model: _models2.default.user,
            as: 'user'
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('1');

    // console.log(existingTicket);
    if (existingTicket) {
      // console.log('existingTicket');
      // console.log(existingTicket);
      res.locals.surfTicket = {
        protocol: existingTicket.order.webslot.protocol,
        subdomain: existingTicket.order.webslot.subdomain,
        domain: existingTicket.order.webslot.domain.domain,
        path: existingTicket.order.webslot.path,
        search: existingTicket.order.webslot.search,
        verificationCode: existingTicket.code,
        user: existingTicket.order.webslot.user.username,
        price: existingTicket.order.price,
        description: existingTicket.order.webslot.description
      };
    }

    if (!existingTicket) {
      // const verificationCode = generator(base, 8);
      var verificationCode = (0, _generateRandomString2.default)(8);

      // const verificationCode = await generateVerificationToken(1);
      // console.log('OUTPUT: ', verificationCode);
      console.log('3');

      var orders = await _models2.default.order.findAll({
        limit: 4,
        order: [['price', 'DESC']],
        group: ['webslotId'],
        where: _defineProperty({
          phase: 'active'
        }, Op.and, _models2.default.Sequelize.where(_models2.default.Sequelize.literal('amount-filled-(SELECT COUNT(*) FROM SurfTicket WHERE SurfTicket.orderId = order.id)'), '>', 0)),
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          distinct: true,
          where: _defineProperty({}, Op.not, [{ userId: req.user.id }]),
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            where: {
              banned: 0
            }
          }, {
            model: _models2.default.user,
            as: 'user'
          }]
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      console.log('4');
      // console.log(orders);
      // console.log(orders.length);
      console.log('-----------------------Orders-------------------------');

      if (orders.length < 1) {
        throw new Error('NO_ORDERS_AVAILABLE');
      }

      var order = orders[Math.floor(Math.random() * orders.length)];

      // console.log('single ORDER ------------------');
      // console.log(order);
      console.log('5');
      await _models2.default.SurfTicket.create({
        userId: req.user.id,
        orderId: order.id,
        code: verificationCode
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      res.locals.surfcount = req.user.surf_count;
      console.log('res.locals.surfcount');
      console.log(res.locals.surfcount);

      var createActivity = await _models2.default.activity.create({
        earnerId: req.user.id,
        spenderId: order.webslot.userId,
        type: 'surfStart',
        orderId: order.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      res.locals.activity = await _models2.default.activity.findOne({
        where: {
          id: createActivity.id
        },
        attributes: ['createdAt', 'type', 'amount'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.user,
          as: 'spender',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.order,
          as: 'order',
          required: false,
          attributes: ['price', 'amount', 'filled'],
          include: [{
            model: _models2.default.webslot,
            as: 'webslot',
            required: false,
            attributes: ['protocol', 'subdomain', 'path', 'search'],
            include: [{
              model: _models2.default.domain,
              as: 'domain',
              required: false,
              attributes: ['domain', 'views']
            }]
          }]
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      res.locals.surfTicket = {
        protocol: order.webslot.protocol,
        subdomain: order.webslot.subdomain,
        domain: order.webslot.domain.domain,
        path: order.webslot.path,
        search: order.webslot.search,
        verificationCode: verificationCode,
        user: order.webslot.user.username,
        price: order.price,
        description: order.webslot.description
      };
    }
    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    console.log('surfStart error');
    console.log(err.message);
    console.log(err.sql);
    res.locals.error = err.message;
    next();
  });
};