"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

var matrixBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, userDirectMessageRoomId, isCurrentRoomDirectMessage, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, priceInfo, userId, createActivity, findActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, 'balance');

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (!userActivity) {
                          _context.next = 10;
                          break;
                        }

                        activity.unshift(userActivity);
                        _context.next = 10;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.walletNotFoundMessage)(message, 'Balance'));

                      case 10:
                        if (user) {
                          _context.next = 12;
                          break;
                        }

                        return _context.abrupt("return");

                      case 12:
                        _context.next = 14;
                        return _models["default"].currency.findOne({
                          where: {
                            iso: 'USD'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        priceInfo = _context.sent;
                        userId = user.user_id.replace('matrix-', '');

                        if (!isCurrentRoomDirectMessage) {
                          _context.next = 21;
                          break;
                        }

                        _context.next = 19;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.balanceMessage)(userId, user, priceInfo));

                      case 19:
                        _context.next = 25;
                        break;

                      case 21:
                        _context.next = 23;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.balanceMessage)(userId, user, priceInfo));

                      case 23:
                        _context.next = 25;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Help'));

                      case 25:
                        _context.next = 27;
                        return _models["default"].activity.create({
                          type: 'balance_s',
                          earnerId: user.id,
                          earner_balance: user.wallet.available + user.wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 27:
                        createActivity = _context.sent;
                        _context.next = 30;
                        return _models["default"].activity.findOne({
                          where: {
                            id: createActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);
                        t.afterCommit(function () {
                          console.log('done balance request');
                        });

                      case 33:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'balance',
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
                        _logger["default"].error("Error Matrix Balance Requested by: ".concat(err));

                      case 9:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function matrixBalance(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixBalance = matrixBalance;