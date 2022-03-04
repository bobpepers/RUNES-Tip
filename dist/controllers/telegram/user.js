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
                var user, wallet, address, newAddress, addressAlreadyExist;
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

                        if (user) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].user.create({
                          user_id: "telegram-".concat(ctx.update.message.from.id),
                          username: ctx.update.message.from.username,
                          firstname: ctx.update.message.from.first_name,
                          lastname: ctx.update.message.from.last_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        user = _context.sent;

                      case 7:
                        if (!user) {
                          _context.next = 42;
                          break;
                        }

                        if (!(user.firstname !== ctx.update.message.from.first_name)) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 11;
                        return user.update({
                          firstname: ctx.update.message.from.first_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        user = _context.sent;

                      case 12:
                        if (!(user.lastname !== ctx.update.message.from.last_name)) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 15;
                        return user.update({
                          lastname: ctx.update.message.from.last_name
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 15:
                        user = _context.sent;

                      case 16:
                        if (!(user.username !== ctx.update.message.from.username)) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 19;
                        return user.update({
                          username: ctx.update.message.from.username
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 19:
                        user = _context.sent;

                      case 20:
                        _context.next = 22;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        wallet = _context.sent;

                        if (wallet) {
                          _context.next = 27;
                          break;
                        }

                        _context.next = 26;
                        return _models["default"].wallet.create({
                          userId: user.id,
                          available: 0,
                          locked: 0
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 26:
                        wallet = _context.sent;

                      case 27:
                        _context.next = 29;
                        return _models["default"].address.findOne({
                          where: {
                            walletId: wallet.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 29:
                        address = _context.sent;

                        if (address) {
                          _context.next = 42;
                          break;
                        }

                        _context.next = 33;
                        return (0, _rclient.getInstance)().getNewAddress();

                      case 33:
                        newAddress = _context.sent;
                        _context.next = 36;
                        return _models["default"].address.findOne({
                          where: {
                            address: newAddress
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 36:
                        addressAlreadyExist = _context.sent;

                        if (addressAlreadyExist) {
                          _context.next = 42;
                          break;
                        }

                        _context.next = 40;
                        return _models["default"].address.create({
                          address: newAddress,
                          walletId: wallet.id,
                          type: 'deposit',
                          confirmed: true
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 40:
                        address = _context.sent;
                        ctx.reply((0, _telegram.welcomeMessage)(ctx));

                      case 42:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 43:
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
                        if (!user) {
                          _context3.next = 23;
                          break;
                        }

                        _context3.next = 22;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        updatedUser = _context3.sent;

                      case 23:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 24:
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