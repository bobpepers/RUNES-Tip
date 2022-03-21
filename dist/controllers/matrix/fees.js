"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFee = exports.fetchFeeSchedule = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/matrix/userWalletExist");

var findFee = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, groupId, t) {
    var fee;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 2:
            fee = _context.sent;

            if (fee) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            fee = _context.sent;

          case 7:
            return _context.abrupt("return", fee);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function findFee(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.findFee = findFee;

var fetchFeeSchedule = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(matrixClient, message, filteredMessage, io) {
    var guildId,
        fee,
        activity,
        userActivity,
        user,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            guildId = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : null;
            fee = {};
            activity = [];
            _context4.next = 5;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context2.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context2.next = 9;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 9:
                        _context2.next = 11;
                        return findFee('tip', guildId, t);

                      case 11:
                        fee.tip = _context2.sent;
                        _context2.next = 14;
                        return findFee('flood', guildId, t);

                      case 14:
                        fee.flood = _context2.sent;
                        _context2.next = 17;
                        return findFee('sleet', guildId, t);

                      case 17:
                        fee.sleet = _context2.sent;
                        _context2.next = 20;
                        return findFee('withdraw', guildId, t);

                      case 20:
                        fee.withdraw = _context2.sent;
                        _context2.next = 23;
                        return _models["default"].activity.create({
                          type: 'fees_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 23:
                        preActivity = _context2.sent;
                        _context2.next = 26;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 26:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        _context2.next = 30;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.feeMessage)(message, fee));

                      case 30:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 31:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x8) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _models["default"].error.create({
                          type: 'fee',
                          error: "".concat(err)
                        });

                      case 3:
                        _context3.next = 8;
                        break;

                      case 5:
                        _context3.prev = 5;
                        _context3.t0 = _context3["catch"](0);

                        _logger["default"].error("Error Matrix: ".concat(_context3.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("fee error: ".concat(err));

                        _context3.prev = 10;
                        _context3.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Fee'));

                      case 13:
                        _context3.next = 18;
                        break;

                      case 15:
                        _context3.prev = 15;
                        _context3.t1 = _context3["catch"](10);
                        console.log(_context3.t1);

                      case 18:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 5], [10, 15]]);
              }));

              return function (_x9) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 5:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchFeeSchedule(_x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchFeeSchedule = fetchFeeSchedule;