'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyWebslot = exports.fetchWebslots = exports.deactivateWebslot = exports.createWebslot = undefined;

var _parseDomain = require('parse-domain');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

function validateUrl(value) {
  return (/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
  );
}
// Test this later
// const ipRegex = require('ip-regex');
// Is an IP address?
// ipRegex({exact: true}).test('unicorn 192.168.0.1');
// => false

var createWebslot = exports.createWebslot = async function createWebslot(req, res, next) {
  var description = req.body.description || '';
  if (validateUrl(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    next();
  }
  if (description > 400) {
    res.locals.error = 'DESCRIPTION_LENGTH_TOO_LONG';
    next();
  }
  var userWebslots = await _models2.default.webslot.findAll({
    where: {
      userId: req.user.id,
      active: 1
    }
  });

  var tempUser = await _models2.default.user.findOne({
    where: {
      id: req.user.id
    }
  });

  if (userWebslots.length >= tempUser.webslot_amount) {
    console.log('MAX_WEBSLOTS');
    res.locals.error = "MAX_WEBSLOTS";
    next();
  }
  var url = new URL(req.body.url);
  var parseResult = (0, _parseDomain.parseDomain)(url.host);

  var domain = parseResult.domain + '.' + parseResult.topLevelDomains.join(".");
  var subdomain = parseResult.subDomains.join(".");

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var result = await _models2.default.domain.findOrCreate({
      where: {
        domain: domain
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log(result);
    console.log('add admoin');
    console.log(result[0].id);
    console.log(result[0]);
    if (result[1]) {
      var activity = await _models2.default.activity.create({
        earnerId: req.user.id,
        type: 'newDomain',
        domainId: result[0].id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.activity = await _models2.default.activity.findOne({
        where: {
          id: activity.id
        },
        attributes: ['createdAt', 'type'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.domain,
          as: 'domainActivity',
          required: false,
          attributes: ['domain']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    var result2 = await _models2.default.DomainUser.findOrCreate({
      where: {
        userId: req.user.id,
        domainId: result[0].id
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    var findWebslot = await _models2.default.webslot.findOne({
      where: {
        userId: req.user.id,
        domainId: result[0].id,
        protocol: url.protocol,
        subdomain: subdomain,
        path: url.pathname,
        search: url.search
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (findWebslot) {
      res.locals.webslot = await findWebslot.update({
        active: 1,
        description: description
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }
    if (!findWebslot) {
      res.locals.webslot = await _models2.default.webslot.create({
        userId: req.user.id,
        domainId: result[0].id,
        protocol: url.protocol,
        subdomain: subdomain,
        path: url.pathname,
        search: url.search,
        description: description
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }
    res.locals.domain = result[0];
    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    console.log(err);
    console.log('catch error add webslto');
    res.locals.error = err.message;
    next();
  });
};

var deactivateWebslot = exports.deactivateWebslot = async function deactivateWebslot(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var webslot = await _models2.default.webslot.findOne({
      where: {
        id: req.body.webslotId,
        userId: req.user.id
      },
      include: [{
        model: _models2.default.order,
        as: 'order',
        where: {
          phase: 'active'
        },
        required: false
      }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    if (!webslot) {
      throw new Error('WEBSLOT_NOT_FOUND');
    }
    if (webslot.order.length > 0) {
      throw new Error('HAS_ACTIVE_ORDERS');
    }
    res.locals.webslot = await webslot.update({
      active: false
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    t.afterCommit(function () {
      console.log(res.locals.webslot);
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

var fetchWebslots = exports.fetchWebslots = function fetchWebslots(req, res, next) {
  _models2.default.webslot.findAll({
    attributes: {
      exclude: ['domainId', 'userId']
    },
    where: {
      active: true,
      userId: req.user.id
      // [Op.or]: [
      //  {
      //    userId: req.user.id,
      //  },
      // ],
    },
    include: ['domain']
  }).then(function (result) {
    console.log(result);
    res.json(result);
  }).catch(function (error) {
    console.log(error);
    res.status(403).json({ message: error });
  });
};

var buyWebslot = exports.buyWebslot = async function buyWebslot(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    console.log('buy webslot');
    var user = await _models2.default.user.findOne({
      where: {
        id: req.user.id
      },
      include: [{
        model: _models2.default.wallet,
        as: 'wallet'
      }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    console.log(user);
    if (user.wallet.available < 5000 * 1e8) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      webslot_amount: user.webslot_amount + 1,
      jackpot_tickets: user.jackpot_tickets + 250
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.wallet = await user.wallet.update({
      available: user.wallet.available - 5000 * 1e8
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpot = await _models2.default.jackpot.findOne({
      order: [['createdAt', 'DESC']]
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.jackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + 50
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.create({
      spenderId: req.user.id,
      type: 'buyWebslot',
      amount: 500000000000,
      spender_balance: res.locals.wallet.available + res.locals.wallet.locked
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: activity.id
      },
      attributes: ['createdAt', 'type'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};