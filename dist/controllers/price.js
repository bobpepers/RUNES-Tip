'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Fetch PriceInfo
 */


var fetchPriceInfo = async function fetchPriceInfo(req, res, next) {
  try {
    var priceRecord = await _models2.default.priceInfo.findOne({
      where: {
        id: 1
      }
    });
    res.locals.price = priceRecord.price;
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

exports.default = fetchPriceInfo;