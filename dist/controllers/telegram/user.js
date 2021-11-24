"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLastSeen = exports.createUpdateUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _rclient = require("../../services/rclient");

var createUpdateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (ctx.update.message.from.is_bot) {
              _context2.next = 3;
              break;
            }

            _context2.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user, wallet, address, newAddress;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(ctx.update.message.from.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context.sent;
                        console.log(user);

                        if (user) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 7;
                        return _models["default"].user.create({
                          user_id: "telegram-".concat(ctx.update.message.from.id),
                          username: ctx.update.message.from.username,
                          firstname: ctx.update.message.from.first_name,
                          lastname: ctx.update.message.from.last_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 7:
                        user = _context.sent;

                      case 8:
                        if (!user) {
                          _context.next = 39;
                          break;
                        }

                        if (!(user.firstname !== ctx.update.message.from.first_name)) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 12;
                        return user.update({
                          firstname: ctx.update.message.from.first_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 12:
                        user = _context.sent;

                      case 13:
                        if (!(user.lastname !== ctx.update.message.from.last_name)) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 16;
                        return user.update({
                          lastname: ctx.update.message.from.last_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 16:
                        user = _context.sent;

                      case 17:
                        if (!(user.username !== ctx.update.message.from.username)) {
                          _context.next = 21;
                          break;
                        }

                        _context.next = 20;
                        return user.update({
                          username: ctx.update.message.from.username
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 20:
                        user = _context.sent;

                      case 21:
                        _context.next = 23;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        wallet = _context.sent;

                        if (wallet) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 27;
                        return _models["default"].wallet.create({
                          userId: user.id,
                          available: 0,
                          locked: 0
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 27:
                        wallet = _context.sent;

                      case 28:
                        _context.next = 30;
                        return _models["default"].address.findOne({
                          where: {
                            walletId: wallet.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 30:
                        address = _context.sent;

                        if (address) {
                          _context.next = 39;
                          break;
                        }

                        _context.next = 34;
                        return (0, _rclient.getInstance)().getNewAddress();

                      case 34:
                        newAddress = _context.sent;
                        _context.next = 37;
                        return _models["default"].address.create({
                          address: newAddress,
                          walletId: wallet.id,
                          type: 'deposit',
                          confirmed: true
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 37:
                        address = _context.sent;
                        ctx.reply((0, _telegram.welcomeMessage)(ctx));

                      case 39:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 40:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createUpdateUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUpdateUser = createUpdateUser;

var updateLastSeen = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                var user, group, active, updatedActive, _updatedActive, updatedUser;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(ctx.update.message.from.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context3.sent;
                        _context3.next = 5;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(ctx.update.message.chat.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        group = _context3.sent;
                        _context3.next = 8;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        active = _context3.sent;

                        if (!group) {
                          _context3.next = 19;
                          break;
                        }

                        if (!user) {
                          _context3.next = 19;
                          break;
                        }

                        if (!active) {
                          _context3.next = 15;
                          break;
                        }

                        _context3.next = 14;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        updatedActive = _context3.sent;

                      case 15:
                        if (active) {
                          _context3.next = 19;
                          break;
                        }

                        _context3.next = 18;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        _updatedActive = _context3.sent;

                      case 19:
                        console.log(user);

                        if (!user) {
                          _context3.next = 24;
                          break;
                        }

                        _context3.next = 23;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        updatedUser = _context3.sent;

                      case 24:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 25:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref4.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
            });

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateLastSeen(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateLastSeen = updateLastSeen;