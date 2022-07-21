"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDiscordLastSeen = exports.generateUserWalletAndAddress = exports.createUpdateDiscordUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _rclient = require("../../services/rclient");

var _discord = require("../../messages/discord");

var generateUserWalletAndAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userInfo, t) {
    var newAccount, user, wallet, address, newAddress, addressAlreadyExist;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newAccount = false;
            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(userInfo.id)
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return _models["default"].user.create({
              user_id: "discord-".concat(userInfo.id),
              username: "".concat(userInfo.username, "#").concat(userInfo.discriminator),
              firstname: '',
              lastname: ''
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 7:
            user = _context.sent;

          case 8:
            if (!user) {
              _context.next = 35;
              break;
            }

            if (!(user.username !== "".concat(userInfo.username, "#").concat(userInfo.discriminator))) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return user.update({
              username: "".concat(userInfo.username, "#").concat(userInfo.discriminator)
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 12:
            user = _context.sent;

          case 13:
            _context.next = 15;
            return _models["default"].wallet.findOne({
              where: {
                userId: user.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 15:
            wallet = _context.sent;

            if (wallet) {
              _context.next = 21;
              break;
            }

            _context.next = 19;
            return _models["default"].wallet.create({
              userId: user.id,
              available: 0,
              locked: 0
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 19:
            wallet = _context.sent;
            newAccount = true;

          case 21:
            _context.next = 23;
            return _models["default"].address.findOne({
              where: {
                walletId: wallet.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 23:
            address = _context.sent;

            if (address) {
              _context.next = 35;
              break;
            }

            _context.next = 27;
            return (0, _rclient.getInstance)().getNewAddress();

          case 27:
            newAddress = _context.sent;
            _context.next = 30;
            return _models["default"].address.findOne({
              where: {
                address: newAddress
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 30:
            addressAlreadyExist = _context.sent;

            if (addressAlreadyExist) {
              _context.next = 35;
              break;
            }

            _context.next = 34;
            return _models["default"].address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 34:
            address = _context.sent;

          case 35:
            return _context.abrupt("return", [user, newAccount]);

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateUserWalletAndAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.generateUserWalletAndAddress = generateUserWalletAndAddress;

var createUpdateDiscordUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(discordClient, userInfo, queue) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
              return _regenerator["default"].wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                          var _yield$generateUserWa, _yield$generateUserWa2, user, newAccount;

                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return generateUserWalletAndAddress(userInfo, t);

                                case 2:
                                  _yield$generateUserWa = _context3.sent;
                                  _yield$generateUserWa2 = (0, _slicedToArray2["default"])(_yield$generateUserWa, 2);
                                  user = _yield$generateUserWa2[0];
                                  newAccount = _yield$generateUserWa2[1];
                                  t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                                      while (1) {
                                        switch (_context2.prev = _context2.next) {
                                          case 0:
                                            if (newAccount) {// const userClient = await discordClient.users.fetch(userInfo.id).catch((e) => {
                                              //   console.log(e);
                                              // });
                                              // if (userClient) {
                                              //   await userClient.send({
                                              //     embeds: [
                                              //       discordWelcomeMessage(
                                              //         userInfo,
                                              //       ),
                                              //     ],
                                              //   }).catch((e) => {
                                              //     console.log(e);
                                              //   });
                                              // }
                                            }

                                          case 1:
                                          case "end":
                                            return _context2.stop();
                                        }
                                      }
                                    }, _callee2);
                                  })));

                                case 7:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        }));

                        return function (_x6) {
                          return _ref4.apply(this, arguments);
                        };
                      }())["catch"]( /*#__PURE__*/function () {
                        var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err) {
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  _context4.prev = 0;
                                  _context4.next = 3;
                                  return _models["default"].error.create({
                                    type: 'createUser',
                                    error: "".concat(err)
                                  });

                                case 3:
                                  _context4.next = 8;
                                  break;

                                case 5:
                                  _context4.prev = 5;
                                  _context4.t0 = _context4["catch"](0);

                                  _logger["default"].error("Error Discord: ".concat(_context4.t0));

                                case 8:
                                  console.log(err.message);

                                case 9:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4, null, [[0, 5]]);
                        }));

                        return function (_x7) {
                          return _ref6.apply(this, arguments);
                        };
                      }());

                    case 2:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5);
            })));

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function createUpdateDiscordUser(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createUpdateDiscordUser = createUpdateDiscordUser;

var updateDiscordLastSeen = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(message, userInfo) {
    var updatedUser, guildId;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (message.guild && message.guild.id) {
              guildId = message.guild.id;
            } else if (message.guildId) {
              guildId = message.guildId;
            }

            _context9.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(t) {
                var user, group, active, updatedActive, _updatedActive;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(userInfo.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context7.sent;

                        if (!guildId) {
                          _context7.next = 20;
                          break;
                        }

                        _context7.next = 6;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        group = _context7.sent;
                        _context7.next = 9;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 9:
                        active = _context7.sent;

                        if (!group) {
                          _context7.next = 20;
                          break;
                        }

                        if (!user) {
                          _context7.next = 20;
                          break;
                        }

                        if (!active) {
                          _context7.next = 16;
                          break;
                        }

                        _context7.next = 15;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 15:
                        updatedActive = _context7.sent;

                      case 16:
                        if (active) {
                          _context7.next = 20;
                          break;
                        }

                        _context7.next = 19;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 19:
                        _updatedActive = _context7.sent;

                      case 20:
                        if (!user) {
                          _context7.next = 24;
                          break;
                        }

                        _context7.next = 23;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        updatedUser = _context7.sent;

                      case 24:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 25:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x10) {
                return _ref8.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(err) {
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.prev = 0;
                        _context8.next = 3;
                        return _models["default"].error.create({
                          type: 'updateUser',
                          error: "".concat(err)
                        });

                      case 3:
                        _context8.next = 8;
                        break;

                      case 5:
                        _context8.prev = 5;
                        _context8.t0 = _context8["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context8.t0));

                      case 8:
                        console.log(err.message);

                      case 9:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, null, [[0, 5]]);
              }));

              return function (_x11) {
                return _ref9.apply(this, arguments);
              };
            }());

          case 3:
            return _context9.abrupt("return", updatedUser);

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function updateDiscordLastSeen(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateDiscordLastSeen = updateDiscordLastSeen;