"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDiscordLastSeen = exports.createUpdateDiscordUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var createUpdateDiscordUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
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
                            user_id: "discord-".concat(message.author.id)
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
                          user_id: "discord-".concat(message.author.id),
                          username: "".concat(message.author.username, "#").concat(message.author.discriminator),
                          firstname: '',
                          lastname: ''
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        user = _context.sent;

                      case 7:
                        if (!user) {
                          _context.next = 30;
                          break;
                        }

                        if (!(user.username !== "".concat(message.author.username, "#").concat(message.author.discriminator))) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 11;
                        return user.update({
                          username: "".concat(message.author.username, "#").concat(message.author.discriminator)
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        user = _context.sent;

                      case 12:
                        _context.next = 14;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        wallet = _context.sent;

                        if (wallet) {
                          _context.next = 19;
                          break;
                        }

                        _context.next = 18;
                        return _models["default"].wallet.create({
                          userId: user.id,
                          available: 0,
                          locked: 0
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        wallet = _context.sent;

                      case 19:
                        _context.next = 21;
                        return _models["default"].address.findOne({
                          where: {
                            walletId: wallet.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 21:
                        address = _context.sent;

                        if (address) {
                          _context.next = 30;
                          break;
                        }

                        _context.next = 25;
                        return (0, _rclient.getInstance)().getNewAddress();

                      case 25:
                        newAddress = _context.sent;
                        _context.next = 28;
                        return _models["default"].address.create({
                          address: newAddress,
                          walletId: wallet.id,
                          type: 'deposit',
                          confirmed: true
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 28:
                        address = _context.sent;
                        message.author.send("Welcome ".concat(message.author.username, ", we created a wallet for you.\nType \"").concat(settings.bot.command.discord, " help\" for usage info")); // ctx.reply(``);

                      case 30:
                        t.afterCommit(function () {
                          console.log('done'); // ctx.reply(`done`);
                        });

                      case 31:
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
              console.log(err.message);
            });

          case 2:
            return _context2.abrupt("return", true);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createUpdateDiscordUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUpdateDiscordUser = createUpdateDiscordUser;

var updateDiscordLastSeen = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(client, message) {
    var updatedUser, guildId;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (message.guildId) {
              guildId = message.guildId;
            }

            if (!guildId) {
              _context4.next = 4;
              break;
            }

            _context4.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                var user, group, active, updatedActive, _updatedActive;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context3.sent;
                        _context3.next = 5;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(guildId)
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

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err.message);
            });

          case 4:
            return _context4.abrupt("return", updatedUser);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateDiscordLastSeen(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateDiscordLastSeen = updateDiscordLastSeen;