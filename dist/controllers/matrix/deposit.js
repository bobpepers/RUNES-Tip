"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixWalletDepositAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _qrcode = _interopRequireDefault(require("qrcode"));

var _models = _interopRequireDefault(require("../../models"));

var _matrix = require("../../messages/matrix");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var matrixWalletDepositAddress = /*#__PURE__*/function () {
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
                var user, depositQr, depositQrFixed, userId, uploadResponse, matrixUrl, preActivity, finalActivity;
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

                        if (!(!user && !user.wallet && !user.wallet.addresses)) {
                          _context.next = 5;
                          break;
                        }

                        return _context.abrupt("return");

                      case 5:
                        if (!(user && user.wallet && user.wallet.addresses)) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 8;
                        return _qrcode["default"].toDataURL(user.wallet.addresses[0].address);

                      case 8:
                        depositQr = _context.sent;
                        depositQrFixed = depositQr.replace('data:image/png;base64,', '');
                        userId = user.user_id.replace('matrix-', '');
                        _context.next = 13;
                        return matrixClient.uploadContent(Buffer.from(depositQrFixed, 'base64'), {
                          rawResponse: false,
                          type: 'image/png'
                        });

                      case 13:
                        uploadResponse = _context.sent;
                        matrixUrl = uploadResponse.content_uri;

                        if (!(message.sender.roomId === userDirectMessageRoomId)) {
                          _context.next = 22;
                          break;
                        }

                        _context.next = 18;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", {
                          msgtype: "m.image",
                          url: matrixUrl,
                          info: "".concat(user.wallet.addresses[0].address),
                          body: "".concat(user.wallet.addresses[0].address)
                        });

                      case 18:
                        _context.next = 20;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.depositAddressMessage)(user));

                      case 20:
                        _context.next = 28;
                        break;

                      case 22:
                        _context.next = 24;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", {
                          msgtype: "m.image",
                          url: matrixUrl,
                          info: "".concat(user.wallet.addresses[0].address),
                          body: "".concat(user.wallet.addresses[0].address)
                        });

                      case 24:
                        _context.next = 26;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.depositAddressMessage)(user));

                      case 26:
                        _context.next = 28;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Deposit'));

                      case 28:
                        _context.next = 30;
                        return _models["default"].activity.create({
                          type: 'deposit',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 30:
                        preActivity = _context.sent;
                        _context.next = 33;
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

                      case 33:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 35:
                        t.afterCommit(function () {
                          console.log("Success Deposit Address Request");
                        });

                      case 36:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
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
                          type: 'deposit',
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
                        console.log(err);

                        _logger["default"].error("Error Deposit Address Request: ".concat(err));

                      case 10:
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

  return function matrixWalletDepositAddress(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixWalletDepositAddress = matrixWalletDepositAddress;