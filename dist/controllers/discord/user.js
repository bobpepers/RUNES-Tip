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

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var createUpdateDiscordUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message, queue) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                          var user, wallet, address, newAddress, addressAlreadyExist;
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
                                    _context.next = 34;
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
                                    _context.next = 34;
                                    break;
                                  }

                                  _context.next = 25;
                                  return (0, _rclient.getInstance)().getNewAddress();

                                case 25:
                                  newAddress = _context.sent;
                                  _context.next = 28;
                                  return _models["default"].address.findOne({
                                    where: {
                                      address: newAddress
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 28:
                                  addressAlreadyExist = _context.sent;

                                  if (addressAlreadyExist) {
                                    _context.next = 33;
                                    break;
                                  }

                                  _context.next = 32;
                                  return _models["default"].address.create({
                                    address: newAddress,
                                    walletId: wallet.id,
                                    type: 'deposit',
                                    confirmed: true
                                  }, {
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 32:
                                  address = _context.sent;

                                case 33:
                                  message.author.send("Welcome ".concat(message.author.username, ", we created a wallet for you.\nType \"").concat(settings.bot.command.discord, " help\" for usage info"));

                                case 34:
                                  t.afterCommit(function () {
                                    console.log('done'); // ctx.reply(`done`);
                                  });

                                case 35:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                        return function (_x3) {
                          return _ref3.apply(this, arguments);
                        };
                      }())["catch"]( /*#__PURE__*/function () {
                        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.prev = 0;
                                  _context2.next = 3;
                                  return _models["default"].error.create({
                                    type: 'createUser',
                                    error: "".concat(err)
                                  });

                                case 3:
                                  _context2.next = 8;
                                  break;

                                case 5:
                                  _context2.prev = 5;
                                  _context2.t0 = _context2["catch"](0);

                                  _logger["default"].error("Error Discord: ".concat(_context2.t0));

                                case 8:
                                  console.log(err.message);

                                case 9:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, null, [[0, 5]]);
                        }));

                        return function (_x4) {
                          return _ref4.apply(this, arguments);
                        };
                      }());

                    case 2:
                      return _context3.abrupt("return", true);

                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createUpdateDiscordUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUpdateDiscordUser = createUpdateDiscordUser;

var updateDiscordLastSeen = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(client, message) {
    var updatedUser, guildId;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (message.guildId) {
              guildId = message.guildId;
            }

            _context7.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var user, group, active, updatedActive, _updatedActive;

                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context5.sent;

                        if (!guildId) {
                          _context5.next = 20;
                          break;
                        }

                        _context5.next = 6;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        group = _context5.sent;
                        _context5.next = 9;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 9:
                        active = _context5.sent;

                        if (!group) {
                          _context5.next = 20;
                          break;
                        }

                        if (!user) {
                          _context5.next = 20;
                          break;
                        }

                        if (!active) {
                          _context5.next = 16;
                          break;
                        }

                        _context5.next = 15;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 15:
                        updatedActive = _context5.sent;

                      case 16:
                        if (active) {
                          _context5.next = 20;
                          break;
                        }

                        _context5.next = 19;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 19:
                        _updatedActive = _context5.sent;

                      case 20:
                        if (!user) {
                          _context5.next = 24;
                          break;
                        }

                        _context5.next = 23;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        updatedUser = _context5.sent;

                      case 24:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 25:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x7) {
                return _ref6.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return _models["default"].error.create({
                          type: 'updateUser',
                          error: "".concat(err)
                        });

                      case 3:
                        _context6.next = 8;
                        break;

                      case 5:
                        _context6.prev = 5;
                        _context6.t0 = _context6["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context6.t0));

                      case 8:
                        console.log(err.message);

                      case 9:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[0, 5]]);
              }));

              return function (_x8) {
                return _ref7.apply(this, arguments);
              };
            }());

          case 3:
            return _context7.abrupt("return", updatedUser);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function updateDiscordLastSeen(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateDiscordLastSeen = updateDiscordLastSeen;