"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMatrixLastSeen = exports.createUpdateMatrixUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _matrix = require("../../messages/matrix");

var settings = (0, _settings["default"])();

var createUpdateMatrixUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message, matrixClient, queue) {
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
                                      user_id: "matrix-".concat(message.sender.userId)
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
                                    user_id: "matrix-".concat(message.sender.userId),
                                    username: "".concat(message.sender.name),
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
                                    _context.next = 38;
                                    break;
                                  }

                                  if (!(user.username !== "".concat(message.sender.name))) {
                                    _context.next = 12;
                                    break;
                                  }

                                  _context.next = 11;
                                  return user.update({
                                    username: "".concat(message.sender.name)
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
                                    _context.next = 20;
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
                                  console.log("created wallet");

                                case 20:
                                  _context.next = 22;
                                  return _models["default"].address.findOne({
                                    where: {
                                      walletId: wallet.id
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 22:
                                  address = _context.sent;

                                  if (address) {
                                    _context.next = 38;
                                    break;
                                  }

                                  _context.next = 26;
                                  return (0, _rclient.getInstance)().getNewAddress();

                                case 26:
                                  newAddress = _context.sent;
                                  _context.next = 29;
                                  return _models["default"].address.findOne({
                                    where: {
                                      address: newAddress
                                    },
                                    transaction: t,
                                    lock: t.LOCK.UPDATE
                                  });

                                case 29:
                                  addressAlreadyExist = _context.sent;
                                  console.log('created address');

                                  if (addressAlreadyExist) {
                                    _context.next = 36;
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
                                  console.log("added address");

                                case 36:
                                  _context.next = 38;
                                  return matrixClient.sendEvent(message.event.room_id, "m.room.message", (0, _matrix.matrixWelcomeMessage)(user.username));

                                case 38:
                                  t.afterCommit(function () {
                                    console.log('done'); // ctx.reply(`done`);
                                  });

                                case 39:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                        return function (_x4) {
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

                                  _logger["default"].error("Error Matrix: ".concat(_context2.t0));

                                case 8:
                                  console.log(err.message);

                                case 9:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, null, [[0, 5]]);
                        }));

                        return function (_x5) {
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

  return function createUpdateMatrixUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUpdateMatrixUser = createUpdateMatrixUser;

var updateMatrixLastSeen = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(matrixClient, message) {
    var updatedUser, currentRoom, guildId;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log(message.sender);
            console.log('senderrrrr');
            _context7.prev = 2;
            _context7.next = 5;
            return matrixClient.getRoom(message.event.room_id);

          case 5:
            currentRoom = _context7.sent;
            _context7.next = 11;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](2);
            console.log(_context7.t0);

          case 11:
            if (!currentRoom) {
              _context7.next = 14;
              break;
            }

            _context7.next = 14;
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
                            user_id: "matrix-".concat(message.sender.userId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context5.sent;
                        _context5.next = 5;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "matrix-".concat(currentRoom.roomId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        group = _context5.sent;
                        _context5.next = 8;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 8:
                        active = _context5.sent;

                        if (!group) {
                          _context5.next = 19;
                          break;
                        }

                        if (!user) {
                          _context5.next = 19;
                          break;
                        }

                        if (!active) {
                          _context5.next = 15;
                          break;
                        }

                        _context5.next = 14;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        updatedActive = _context5.sent;

                      case 15:
                        if (active) {
                          _context5.next = 19;
                          break;
                        }

                        _context5.next = 18;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        _updatedActive = _context5.sent;

                      case 19:
                        if (!user) {
                          _context5.next = 23;
                          break;
                        }

                        _context5.next = 22;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        updatedUser = _context5.sent;

                      case 23:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 24:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x8) {
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

                        _logger["default"].error("Error Matrix: ".concat(_context6.t0));

                      case 8:
                        console.log(err.message);

                      case 9:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[0, 5]]);
              }));

              return function (_x9) {
                return _ref7.apply(this, arguments);
              };
            }());

          case 14:
            return _context7.abrupt("return", updatedUser);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 8]]);
  }));

  return function updateMatrixLastSeen(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateMatrixLastSeen = updateMatrixLastSeen;