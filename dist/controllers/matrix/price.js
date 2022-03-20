"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixPrice = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _matrix = require("../../messages/matrix");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var matrixPrice = /*#__PURE__*/function () {
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
                var user, priceRecord, replyString, replyStringHtml, createActivity, findActivity;
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

                        if (!(!user && !user.wallet)) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.walletNotFoundMessage)(message, 'Tip'));

                      case 6:
                        if (!(user && user.wallet)) {
                          _context.next = 29;
                          break;
                        }

                        _context.prev = 7;
                        _context.next = 10;
                        return _models["default"].priceInfo.findAll({});

                      case 10:
                        priceRecord = _context.sent;
                        replyString = "";
                        replyString += priceRecord.map(function (a) {
                          return "".concat(a.currency, ": ").concat(a.price);
                        }).join('\n');
                        replyStringHtml = "";
                        replyStringHtml += priceRecord.map(function (a) {
                          return "".concat(a.currency, ": ").concat(a.price);
                        }).join('<br>');
                        _context.next = 17;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.priceMessage)(replyString, replyStringHtml));

                      case 17:
                        _context.next = 22;
                        break;

                      case 19:
                        _context.prev = 19;
                        _context.t0 = _context["catch"](7);
                        console.log(_context.t0);

                      case 22:
                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'price',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        createActivity = _context.sent;
                        _context.next = 27;
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

                      case 27:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);

                      case 29:
                        t.afterCommit(function () {
                          console.log('done price request'); // logger.info(`Success Discord Balance Requested by: ${message.author.id}-${message.author.username}#${message.author.discriminator}`);
                        });

                      case 30:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[7, 19]]);
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
                          type: 'price',
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
                        _logger["default"].error("Error Matrix Balance Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        _context2.prev = 9;
                        _context2.next = 12;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Price'));

                      case 12:
                        _context2.next = 17;
                        break;

                      case 14:
                        _context2.prev = 14;
                        _context2.t1 = _context2["catch"](9);
                        console.log(_context2.t1);

                      case 17:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [9, 14]]);
              }));

              return function (_x5) {
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

  return function matrixPrice(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixPrice = matrixPrice;