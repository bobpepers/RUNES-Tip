"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../models"));

function upsert(values) {
  return _models["default"].IpUser.findOne({
    where: values
  }).then(function (obj) {
    // update
    if (obj) {
      console.log('update IpUserModel');
      obj.changed('updatedAt', true);
      return obj.save();
    }

    return _models["default"].IpUser.create(values);
  });
}

var storeIP = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var storedIP, ip;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            console.log(ip);
            _context.next = 4;
            return _models["default"].ip.findOne({
              where: {
                address: ip
              }
            });

          case 4:
            storedIP = _context.sent;

            if (storedIP) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return _models["default"].ip.create({
              address: ip
            });

          case 8:
            storedIP = _context.sent;

          case 9:
            _context.next = 11;
            return upsert({
              userId: req.user.id,
              ipId: storedIP.id
            });

          case 11:
            res.locals.ip = ip;
            res.locals.ipId = storedIP.id;
            next();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function storeIP(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = storeIP;
exports["default"] = _default;