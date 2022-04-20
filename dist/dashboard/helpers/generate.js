"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVerificationToken = exports.generateHash = void 0;

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _dotenv = require("dotenv");

var _crypto = _interopRequireDefault(require("crypto"));

(0, _dotenv.config)();

var generateHash = function generateHash(a) {
  return _crypto["default"].createHmac('sha256', process.env.SESSION_SECRET).update(a).digest('hex');
}; // eslint-disable-next-line import/prefer-default-export


exports.generateHash = generateHash;

var generateVerificationToken = function generateVerificationToken(expireHours) {
  var generateToken = new Promise(function (resolve, reject) {
    _bcryptNodejs["default"].genSalt(10, function (err, salt) {
      if (err) reject(err);

      _bcryptNodejs["default"].hash(process.env.SESSION_SECRET, salt, null, function (err, hash) {
        if (err) reject(err);
        var expires = new Date();
        expires.setHours(expires.getHours() + expireHours);
        resolve({
          token: generateHash(hash),
          expires: expires
        });
      });
    });
  });
  return generateToken;
};

exports.generateVerificationToken = generateVerificationToken;