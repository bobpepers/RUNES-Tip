'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var schedule = require('node-schedule');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var archiveActivity = async function archiveActivity() {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    try {
      var activities = await _models2.default.activity.findAll({
        order: [['id', 'ASC']],
        where: {
          createdAt: _defineProperty({}, Op.lte, new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      // for (const activity of activities) {
      //  console.log(activity);
      // }
      console.log('archive Activity');
      await Promise.all(activities.map(async function (activity) {
        await _models2.default.activityArchive.create({
          type: activity.type,
          amount: activity.amount,
          spender_balance: activity.spender_balance,
          earner_balance: activity.earner_balance,
          ipId: activity.ipId,
          spenderId: activity.spenderId,
          eanerId: activity.eanerId,
          orderId: activity.orderId,
          domainId: activity.domainId,
          txId: activity.txId,
          transactionId: activity.transactionId,
          userId: activity.userId,
          createdAt: activity.createdAt
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE
        });
        await activity.destroy({
          transaction: t,
          lock: t.LOCK.UPDATE
        });
      }));

      return;
    } catch (error) {
      console.error(error);
    }
    t.afterCommit(function () {
      _logger2.default.info('after commit archive activity');
    });
  }).catch(function (err) {
    console.log(err);
    _logger2.default.info('Jackpot Error');
    _logger2.default.debug(err);
  });
};

exports.default = archiveActivity;