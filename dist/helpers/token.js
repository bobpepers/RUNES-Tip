'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenForUser = tokenForUser;
exports.decodeToken = decodeToken;

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

function tokenForUser(user) {
  var timestamp = new Date().getTime();
  return _jwtSimple2.default.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

function decodeToken(token) {
  return _jwtSimple2.default.decode(token, process.env.JWT_SECRET);
}