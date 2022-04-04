"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIpBanned = exports.insertIp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

/**
 *
 * Is IP Banned?
 */
var isIpBanned = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var ip, banned;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            _context.next = 3;
            return _models["default"].ip.find({
              where: {
                address: ip,
                banned: true
              }
            });

          case 3:
            banned = _context.sent;
            console.log('isUserBaipnned');
            console.log(req.user);

            if (banned) {
              req.logOut();
              req.session.destroy();
              res.status(401).send({
                error: 'IP_BANNED'
              });
            } else {
              next();
            }

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isIpBanned(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * insert Ip
 */


exports.isIpBanned = isIpBanned;

var insertIp = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var ip;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].ip.findOrCreate({
                          where: {
                            address: ip
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        res.locals.ip = _context2.sent;
                        t.afterCommit(function () {
                          next();
                        });

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function insertIp(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.insertIp = insertIp;