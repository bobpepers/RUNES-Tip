'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function upsert(values) {
  return _models2.default.IpUser.findOne({ where: values }).then(function (obj) {
    // update
    if (obj) {
      console.log('update IpUserModel');
      obj.changed('updatedAt', true);
      return obj.save();
    }
    return _models2.default.IpUser.create(values);
  });
}

var storeIP = async function storeIP(req, res, next) {
  var storedIP = void 0;
  var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(ip);

  storedIP = await _models2.default.ip.findOne({
    where: {
      address: ip
    }
  });
  if (!storedIP) {
    storedIP = await _models2.default.ip.create({ address: ip });
  }
  await upsert({
    userId: req.user.id,
    ipId: storedIP.id
  });

  res.locals.ip = ip;
  next();
};

exports.default = storeIP;