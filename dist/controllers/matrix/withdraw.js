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

var _validateAmount = require("../../helpers/client/matrix/validateAmount");

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var withdrawMatrixCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var user, activity, userActivity;
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
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, isValidAddressInfo, isValidAddress, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction, activityCreate;

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
                        // Add new currencies here (default fallback Runebase)
                        isValidAddressInfo = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 35;
                          break;
                        }

                        _context.prev = 20;
                        _context.next = 23;
                        return (0, _rclient.getInstance)().getAddressInfo(filteredMessage[2]);

                      case 23:
                        isValidAddressInfo = _context.sent;
                        _context.next = 35;
                        break;

                      case 26:
                        _context.prev = 26;
                        _context.t0 = _context["catch"](20);

                        if (!(_context.t0.response && _context.t0.response.status === 500)) {
                          _context.next = 32;
                          break;
                        }

                        _context.next = 31;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAddressMessage)(message));

                      case 31:
                        return _context.abrupt("return");

                      case 32:
                        _context.next = 34;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.nodeOfflineMessage)());

                      case 34:
                        return _context.abrupt("return");

                      case 35:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 42;
                          break;
                        }

                        _context.next = 39;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 39:
                        isValidAddress = _context.sent;
                        _context.next = 57;
                        break;

                      case 42:
                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 48;
                          break;
                        }

                        _context.next = 45;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(filteredMessage[2]);

                      case 45:
                        isValidAddress = _context.sent;
                        _context.next = 57;
                        break;

                      case 48:
                        if (!(settings.coin.setting === 'Komodo')) {
                          _context.next = 54;
                          break;
                        }

                        _context.next = 51;
                        return (0, _rclient.getInstance)().utils.isKomodoAddress(filteredMessage[2]);

                      case 51:
                        isValidAddress = _context.sent;
                        _context.next = 57;
                        break;

                      case 54:
                        _context.next = 56;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 56:
                        isValidAddress = _context.sent;

                      case 57:
                        if (isValidAddress) {
                          _context.next = 61;
                          break;
                        }

                        _context.next = 60;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidAddressMessage)(message));

                      case 60:
                        return _context.abrupt("return");

                      case 61:
                        _context.next = 63;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 63:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 68;
                          break;
                        }

                        _context.next = 67;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 67:
                        addressExternal = _context.sent;

                      case 68:
                        _context.next = 70;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 70:
                        UserExternalAddressMnMAssociation = _context.sent;

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 75;
                          break;
                        }

                        _context.next = 74;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 74:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 75:
                        _context.next = 77;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 77:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 81;
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

                      case 81:
                        transaction = _context.sent;
                        _context.next = 84;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 84:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate); // const userId = user.user_id.replace('matrix-', '');

                        if (!(message.sender.roomId === userDirectMessageRoomId)) {
                          _context.next = 91;
                          break;
                        }

                        _context.next = 89;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 89:
                        _context.next = 95;
                        break;

                      case 91:
                        _context.next = 93;
                        return matrixClient.sendEvent(userDirectMessageRoomId, "m.room.message", (0, _matrix.reviewMessage)(message, transaction));

                      case 93:
                        _context.next = 95;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.warnDirectMessage)(message.sender.name, 'Withdraw'));

                      case 95:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 96:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[20, 26]]);
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