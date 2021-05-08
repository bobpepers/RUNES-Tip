'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPersonalActivity = exports.fetchActivity = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var fetchActivity = exports.fetchActivity = async function fetchActivity(req, res, next) {
  try {
    res.locals.activity = await _models2.default.activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.ip,
        as: 'ip',
        required: false,
        attributes: ['address']
      }, {
        model: _models2.default.domain,
        as: 'domainActivity',
        required: false,
        attributes: ['domain']
      }, {
        model: _models2.default.transaction,
        as: 'txActivity',
        required: false,
        attributes: ['txid']
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
      }]
    });
    // console.log(res.locals.activity);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

var fetchPersonalActivity = exports.fetchPersonalActivity = async function fetchPersonalActivity(req, res, next) {
  try {
    console.log('Personal Activity');
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};