'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertIp = exports.isIpBanned = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

/**
 *
 * Is IP Banned?
 */


var isIpBanned = exports.isIpBanned = async function isIpBanned(req, res, next) {
  var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var banned = await _models2.default.ip.find({
    where: {
      address: ip,
      banned: true
    }
  });
  console.log('isUserBaipnned');
  console.log(req.user);
  if (banned) {
    req.logOut();
    req.session.destroy();
    res.status(401).send({
      error: 'IP_BANNED'
    });
  } else {
    next();
  }
};

/**
 * insert Ip
 */
var insertIp = exports.insertIp = async function insertIp(req, res, next) {
  var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    res.locals.ip = await _models2.default.ip.findOrCreate({
      where: {
        address: ip
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    t.afterCommit(function () {
      next();
    });
  });
};