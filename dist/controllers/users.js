'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUserCount = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchUserCount = exports.fetchUserCount = async function fetchUserCount(req, res, next) {
  var count = await _models2.default.user.count({
    where: {
      authused: 1
    }
  });
  console.log('count');
  console.log(count);
  res.json(count);
};