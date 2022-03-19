"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawMatrixCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _matrix = require("../../messages/matrix");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/matrix/validateAmount");

var _userWalletExist = require("../../helpers/matrix/userWalletExist");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var withdrawMatrixCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var user, activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, isValidAddressInfo, isValidAddress, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        activity = _yield$userWalletExis2[1];

                        if (user) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return");

                      case 8:
                        _context.next = 10;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 10:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 17;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context.abrupt("return");

                      case 17:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddressInfo = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 48;
                          break;
                        }

                        _context.prev = 19;
                        _context.next = 22;
                        return (0, _rclient.getInstance)().getAddressInfo(filteredMessage[2]);

                      case 22:
                        isValidAddressInfo = _context.sent;
                        _context.next = 48;
                        break;

                      case 25:
                        _context.prev = 25;
                        _context.t0 = _context["catch"](19);
                        //
                        console.log(message);
                        console.log(_context.t0);

                        if (!(_context.t0.response && _context.t0.response.status === 500)) {
                          _context.next = 39;
                          break;
                        }

                        _context.prev = 30;
                        _context.next = 33;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAddressMessage)(message));

                      case 33:
                        _context.next = 38;
                        break;

                      case 35:
                        _context.prev = 35;
                        _context.t1 = _context["catch"](30);
                        console.log(_context.t1);

                      case 38:
                        return _context.abrupt("return");

                      case 39:
                        _context.prev = 39;
                        _context.next = 42;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.nodeOfflineMessage)());

                      case 42:
                        _context.next = 47;
                        break;

                      case 44:
                        _context.prev = 44;
                        _context.t2 = _context["catch"](39);
                        console.log(_context.t2);

                      case 47:
                        return _context.abrupt("return");

                      case 48:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 55;
                          break;
                        }

                        _context.next = 52;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 52:
                        isValidAddress = _context.sent;
                        _context.next = 70;
                        break;

                      case 55:
                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 61;
                          break;
                        }

                        _context.next = 58;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(filteredMessage[2]);

                      case 58:
                        isValidAddress = _context.sent;
                        _context.next = 70;
                        break;

                      case 61:
                        if (!(settings.coin.setting === 'Komodo')) {
                          _context.next = 67;
                          break;
                        }

                        _context.next = 64;
                        return (0, _rclient.getInstance)().utils.isKomodoAddress(filteredMessage[2]);

                      case 64:
                        isValidAddress = _context.sent;
                        _context.next = 70;
                        break;

                      case 67:
                        _context.next = 69;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 69:
                        isValidAddress = _context.sent;

                      case 70:
                        //
                        console.log(userDirectMessageRoomId);
                        console.log(message.sender);

                        if (isValidAddress) {
                          _context.next = 82;
                          break;
                        }

                        _context.prev = 73;
                        _context.next = 76;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAddressMessage)(message));

                      case 76:
                        _context.next = 81;
                        break;

                      case 78:
                        _context.prev = 78;
                        _context.t3 = _context["catch"](73);
                        console.log(_context.t3);

                      case 81:
                        return _context.abrupt("return");

                      case 82:
                        _context.next = 84;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 84:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 89;
                          break;
                        }

                        _context.next = 88;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 88:
                        addressExternal = _context.sent;

                      case 89:
                        _context.next = 91;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 91:
                        UserExternalAddressMnMAssociation = _context.sent;

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 96;
                          break;
                        }

                        _context.next = 95;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 95:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 96:
                        _context.next = 98;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 98:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 102;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          addressExternalId: addressExternal.id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount,
                          feeAmount: Number(fee),
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 102:
                        transaction = _context.sent;
                        _context.next = 105;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 105:
                        activity = _context.sent;

                        if (!(message.sender.roomId === userDirectMessageRoomId)) {
                          _context.next = 111;
                          break;
                        }

                        _context.next = 109;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 109:
                        _context.next = 127;
                        break;

                      case 111:
                        _context.prev = 111;
                        _context.next = 114;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Withdraw'));

                      case 114:
                        _context.next = 119;
                        break;

                      case 116:
                        _context.prev = 116;
                        _context.t4 = _context["catch"](111);
                        console.log(_context.t4);

                      case 119:
                        _context.prev = 119;
                        _context.next = 122;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 122:
                        _context.next = 127;
                        break;

                      case 124:
                        _context.prev = 124;
                        _context.t5 = _context["catch"](119);
                        console.log(_context.t5);

                      case 127:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 128:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[19, 25], [30, 35], [39, 44], [73, 78], [111, 116], [119, 124]]);
              }));

              return function (_x11) {
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
                          type: 'withdraw',
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

                        _logger["default"].error("withdraw error: ".concat(err));

                        _context2.prev = 10;
                        _context2.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)("Withdraw"));

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

              return function (_x12) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function withdrawMatrixCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawMatrixCreate = withdrawMatrixCreate;