"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIgnoreMe = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var setIgnoreMe = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, io) {
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
                var user, activityA, preActivity, finalActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "matrix-".concat(message.sender.userId)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'ignoreme_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activityA = _context.sent;
                        activity.unshift(activityA); // await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Ignore me')] });

                        return _context.abrupt("return");

                      case 9:
                        if (!user.ignoreMe) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 12;
                        return user.update({
                          ignoreMe: false
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 12:
                        _context.next = 14;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.unIngoreMeMessage)(message));

                      case 14:
                        _context.next = 21;
                        break;

                      case 16:
                        if (user.ignoreMe) {
                          _context.next = 21;
                          break;
                        }

                        _context.next = 19;
                        return user.update({
                          ignoreMe: true
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 19:
                        _context.next = 21;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.ignoreMeMessage)(message));

                      case 21:
                        _context.next = 23;
                        return _models["default"].activity.create({
                          type: 'ignoreme_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 23:
                        preActivity = _context.sent;
                        _context.next = 26;
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
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 29:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
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
                          type: 'ignoreme',
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
                        console.log(err);

                        _logger["default"].error("ignoreme error: ".concat(err));

                        _context2.prev = 10;
                        _context2.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Ignore me'));

                      case 13:
                        _context2.next = 18;
                        break;

                      case 15:
                        _context2.prev = 15;
                        _context2.t1 = _context2["catch"](10);
                        console.log(_context2.t1);

                      case 18:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 15]]);
              }));

              return function (_x5) {
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

  return function setIgnoreMe(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.setIgnoreMe = setIgnoreMe;