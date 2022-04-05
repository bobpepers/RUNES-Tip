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

var _matrix = require("../../messages/matrix");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/matrix/validateAmount");

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

var _validateWithdrawalAddress = require("../../helpers/blockchain/validateWithdrawalAddress");

var _disallowWithdrawToSelf = require("../../helpers/withdraw/disallowWithdrawToSelf");

var _createOrUseExternalWithdrawAddress = require("../../helpers/withdraw/createOrUseExternalWithdrawAddress");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var withdrawMatrixCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, _yield$validateWithdr, _yield$validateWithdr2, isInvalidAddress, isNodeOffline, failWithdrawalActivity, isMyAddressActivity, addressExternal, wallet, fee, transaction, activityCreate;

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
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 11:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 18;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 18:
                        _context.next = 20;
                        return (0, _validateWithdrawalAddress.validateWithdrawalAddress)(filteredMessage[2], user, t);

                      case 20:
                        _yield$validateWithdr = _context.sent;
                        _yield$validateWithdr2 = (0, _slicedToArray2["default"])(_yield$validateWithdr, 3);
                        isInvalidAddress = _yield$validateWithdr2[0];
                        isNodeOffline = _yield$validateWithdr2[1];
                        failWithdrawalActivity = _yield$validateWithdr2[2];

                        if (!isNodeOffline) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 28;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.nodeOfflineMessage)());

                      case 28:
                        if (!isInvalidAddress) {
                          _context.next = 31;
                          break;
                        }

                        _context.next = 31;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.invalidAddressMessage)(message));

                      case 31:
                        if (!(isInvalidAddress || isNodeOffline)) {
                          _context.next = 35;
                          break;
                        }

                        if (isCurrentRoomDirectMessage) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 35;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Withdraw'));

                      case 35:
                        if (!failWithdrawalActivity) {
                          _context.next = 38;
                          break;
                        }

                        activity.unshift(failWithdrawalActivity);
                        return _context.abrupt("return");

                      case 38:
                        _context.next = 40;
                        return (0, _disallowWithdrawToSelf.disallowWithdrawToSelf)(filteredMessage[2], user, t);

                      case 40:
                        isMyAddressActivity = _context.sent;

                        if (!isMyAddressActivity) {
                          _context.next = 49;
                          break;
                        }

                        _context.next = 44;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.unableToWithdrawToSelfMessage)(message));

                      case 44:
                        if (isCurrentRoomDirectMessage) {
                          _context.next = 47;
                          break;
                        }

                        _context.next = 47;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Withdraw'));

                      case 47:
                        activity.unshift(isMyAddressActivity);
                        return _context.abrupt("return");

                      case 49:
                        _context.next = 51;
                        return (0, _createOrUseExternalWithdrawAddress.createOrUseExternalWithdrawAddress)(filteredMessage[2], user, t);

                      case 51:
                        addressExternal = _context.sent;
                        _context.next = 54;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 54:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 58;
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

                      case 58:
                        transaction = _context.sent;
                        _context.next = 61;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 61:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate); // const userId = user.user_id.replace('matrix-', '');

                        if (!isCurrentRoomDirectMessage) {
                          _context.next = 68;
                          break;
                        }

                        _context.next = 66;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 66:
                        _context.next = 72;
                        break;

                      case 68:
                        _context.next = 70;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 70:
                        _context.next = 72;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Withdraw'));

                      case 72:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 73:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
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

  return function withdrawMatrixCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawMatrixCreate = withdrawMatrixCreate;