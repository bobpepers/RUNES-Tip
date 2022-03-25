"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLastSeen = exports.fetchUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var fetchUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].dashboardUser.findOne({
              where: {
                id: req.user.id
              },
              attributes: {
                exclude: ['password', 'id', 'authtoken', 'authused', 'authexpires', 'resetpasstoken', 'resetpassused', 'resetpassexpires', 'updatedAt']
              }
            });

          case 2:
            res.locals.user = _context.sent;
            next();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchUser = fetchUser;

var updateLastSeen = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var user, updatedUser;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].dashboardUser.findOne({
                          where: {
                            id: req.user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context2.sent;
                        console.log(user);

                        if (user) {
                          _context2.next = 6;
                          break;
                        }

                        throw new Error('USER_NOT_FOUND');

                      case 6:
                        _context2.next = 8;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        updatedUser = _context2.sent;
                        t.afterCommit(function () {
                          next();
                        });

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err.message);
              res.locals.error = err.message;
              next();
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateLastSeen(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateLastSeen = updateLastSeen;