'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stats = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch Stats
 */
var stats = exports.stats = async function stats(req, res, next) {
  try {
    var lastStats = await _models2.default.stats.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']]
    });
    console.log('lastStats');
    console.log(lastStats);
    res.json(lastStats);
    return lastStats;
  } catch (err) {
    console.log('err' + err);
    res.status(500).send(err);
  }
};