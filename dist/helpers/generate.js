'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVerificationToken = exports.generateHash = undefined;

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');

var generateHash = exports.generateHash = function generateHash(a) {
  return crypto.createHmac('sha256', 'SuperSexySecret').update(a).digest('hex');
};

// eslint-disable-next-line import/prefer-default-export
var generateVerificationToken = exports.generateVerificationToken = function generateVerificationToken(expireHours) {
  var generateToken = new Promise(function (resolve, reject) {
    _bcryptNodejs2.default.genSalt(10, function (err, salt) {
      if (err) reject(err);
      _bcryptNodejs2.default.hash('SuperSexySecret', salt, null, function (err, hash) {
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