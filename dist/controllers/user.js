'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbsync = exports.fetchUser = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;
/**
 * Fetch Wallet
 */


var fetchUser = exports.fetchUser = async function fetchUser(req, res, next) {
  console.log(req.user.id);
  console.log('begin fetch user');
  res.locals.user = await _models2.default.user.findOne({
    where: {
      id: req.user.id
    },
    attributes: {
      exclude: ['password', 'id', 'email', 'firstname', 'lastname', 'authtoken', 'authused', 'authexpires', 'resetpasstoken', 'resetpassused', 'resetpassexpires', 'createdAt', 'updatedAt']
    },
    include: [{
      model: _models2.default.Referrals,
      required: false,
      as: 'referredBy',
      attributes: ['earned'],
      include: [{
        model: _models2.default.user,
        required: false,
        as: 'userReferrer',
        attributes: ['username']
      }]
    }, {
      model: _models2.default.wallet,
      as: 'wallet',
      attributes: {
        exclude: ['userId', 'createdAt', 'id']
      },
      include: [{
        model: _models2.default.address,
        as: 'addresses',
        include: [{
          model: _models2.default.transaction,
          as: 'transactions'
        }]
      }]
    }, {
      model: _models2.default.webslot,
      as: 'webslots',
      required: false,
      where: {
        active: true
      },
      attributes: {
        exclude: ['userId']
      },
      include: [{
        model: _models2.default.domain,
        as: 'domain',
        attributes: {
          exclude: ['userId', 'createdAt', 'id']
        }
      }, {
        model: _models2.default.order,
        as: 'order',
        where: {
          phase: 'active'
        },
        required: false,
        include: [{
          model: _models2.default.SurfTicket,
          as: 'surfTicket',
          attributes: {
            exclude: ['code']
          }
        }]
      }]
    }, {
      model: _models2.default.domain,
      as: 'domains',
      through: { attributes: [] },
      attributes: {
        exclude: ['id']
      }
    }]
  });
  console.log(res.locals.user);
  console.log('end user controller');
  next();
};

/**
 * Fetch Wallet
 */
var dbsync = exports.dbsync = async function dbsync(req, res, next) {
  _models2.default.sequelize.sync().then(function () {
    res.status(201).json({ message: 'Tables Created' });
  });
};