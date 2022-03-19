"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var matrixBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, userDirectMessageRoomId, io) {
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
                var user, priceInfo, userId, createActivity, findActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "matrix-".concat(message.sender.userId)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses'
                            }]
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;
                        _context.next = 5;
                        return _models["default"].priceInfo.findOne({
                          where: {
                            currency: 'USD'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 5:
                        priceInfo = _context.sent;

                        if (!(!user && !user.wallet)) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 9;
                        return message.author.send("Wallet not found");

                      case 9:
                        if (!(user && user.wallet)) {
                          _context.next = 45;
                          break;
                        }

                        userId = user.user_id.replace('matrix-', '');

                        if (!(message.sender.roomId === userDirectMessageRoomId)) {
                          _context.next = 22;
                          break;
                        }

                        _context.prev = 12;
                        _context.next = 15;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.balanceMessage)(userId, user, priceInfo));

                      case 15:
                        _context.next = 20;
                        break;

                      case 17:
                        _context.prev = 17;
                        _context.t0 = _context["catch"](12);
                        console.log(_context.t0);

                      case 20:
                        _context.next = 38;
                        break;

                      case 22:
                        _context.prev = 22;
                        _context.next = 25;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Help'));

                      case 25:
                        _context.next = 30;
                        break;

                      case 27:
                        _context.prev = 27;
                        _context.t1 = _context["catch"](22);
                        console.log(_context.t1);

                      case 30:
                        _context.prev = 30;
                        _context.next = 33;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.balanceMessage)(userId, user, priceInfo));

                      case 33:
                        _context.next = 38;
                        break;

                      case 35:
                        _context.prev = 35;
                        _context.t2 = _context["catch"](30);
                        console.log(_context.t2);

                      case 38:
                        _context.next = 40;
                        return _models["default"].activity.create({
                          type: 'balance',
                          earnerId: user.id,
                          earner_balance: user.wallet.available + user.wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        createActivity = _context.sent;
                        _context.next = 43;
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

                      case 43:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);

                      case 45:
                        t.afterCommit(function () {
                          // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
                          console.log('done balance request');
                        });

                      case 46:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[12, 17], [22, 27], [30, 35]]);
              }));

              return function (_x5) {
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

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function matrixBalance(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixBalance = matrixBalance;