"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixSleet = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _validateAmount = require("../../helpers/client/matrix/validateAmount");

var _userWalletExist = require("../../helpers/client/matrix/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _matrix = require("../../messages/matrix");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var matrixSleet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage, myBody) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, group, groupFailActivity, textTime, cutLastTimeLetter, cutNumberTime, isnum, lastSeenOptions, activityA, dateObj, usersToRain, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, sleetRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, sleetee, sleeteeWallet, sleettipRecord, userIdReceivedSleet, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!isCurrentRoomDirectMessage) {
                          _context.next = 4;
                          break;
                        }

                        _context.next = 3;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notInDirectMessage)(message, 'Flood'));

                      case 3:
                        return _context.abrupt("return");

                      case 4:
                        _context.next = 6;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 6:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 13;
                          break;
                        }

                        return _context.abrupt("return");

                      case 13:
                        _context.next = 15;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 15:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 22;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 22:
                        _context.next = 24;
                        return _models["default"].group.findOne({
                          where: {
                            id: groupTask.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        group = _context.sent;

                        if (group) {
                          _context.next = 33;
                          break;
                        }

                        _context.next = 28;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 28:
                        groupFailActivity = _context.sent;
                        activity.unshift(groupFailActivity);
                        _context.next = 32;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.groupNotFoundMessage)());

                      case 32:
                        return _context.abrupt("return");

                      case 33:
                        lastSeenOptions = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, new Date(Date.now() - 15 * 60 * 1000)); // Optional Timer

                        // Optional Timer
                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[3];
                          cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                          cutNumberTime = textTime.substring(0, textTime.length - 1);
                          isnum = /^\d+$/.test(cutNumberTime);
                        }

                        if (!(filteredMessage[3] && !isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter !== 'd' || cutLastTimeLetter !== 'h' || cutLastTimeLetter !== 'm' || cutLastTimeLetter !== 's'))) {
                          _context.next = 45;
                          break;
                        }

                        console.log('not pass');
                        console.log(user.id);
                        _context.next = 40;
                        return _models["default"].activity.create({
                          type: 'sleet_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.next = 44;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidTimeMessage)(message, 'Sleet'));

                      case 44:
                        return _context.abrupt("return");

                      case 45:
                        if (!(filteredMessage[2] && isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter === 'd' || cutLastTimeLetter === 'h' || cutLastTimeLetter === 'm' || cutLastTimeLetter === 's'))) {
                          _context.next = 57;
                          break;
                        }

                        _context.next = 48;
                        return new Date().getTime();

                      case 48:
                        dateObj = _context.sent;

                        if (cutLastTimeLetter === 'd') {
                          dateObj -= Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 'h') {
                          dateObj -= Number(cutNumberTime) * 60 * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 'm') {
                          dateObj -= Number(cutNumberTime) * 60 * 1000;
                        }

                        if (cutLastTimeLetter === 's') {
                          dateObj -= Number(cutNumberTime) * 1000;
                        }

                        _context.next = 55;
                        return new Date(dateObj);

                      case 55:
                        dateObj = _context.sent;
                        lastSeenOptions = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, dateObj);

                      case 57:
                        _context.next = 59;
                        return _models["default"].user.findAll({
                          where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                            user_id: (0, _defineProperty2["default"])({}, _sequelize.Op.not, "matrix-".concat(message.sender.userId))
                          }, {
                            banned: false
                          }]),
                          include: [{
                            model: _models["default"].active,
                            as: 'active',
                            // required: false,
                            where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                              lastSeen: lastSeenOptions
                            }, {
                              groupId: group.id
                            }])
                          }, {
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 59:
                        usersToRain = _context.sent;

                        if (!(usersToRain.length < 2)) {
                          _context.next = 68;
                          break;
                        }

                        _context.next = 63;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 63:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.next = 67;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notEnoughUsers)(message, 'Sleet'));

                      case 67:
                        return _context.abrupt("return");

                      case 68:
                        if (!(usersToRain.length >= 2)) {
                          _context.next = 139;
                          break;
                        }

                        _context.next = 71;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 71:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / usersToRain.length).toFixed(0);
                        _context.next = 76;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 76:
                        faucetWatered = _context.sent;
                        _context.next = 79;
                        return _models["default"].sleet.create({
                          feeAmount: fee,
                          amount: amount,
                          userCount: usersToRain.length,
                          userId: user.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 79:
                        sleetRecord = _context.sent;
                        _context.next = 82;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'sleet_s',
                          spenderId: user.id,
                          sleetId: sleetRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 82:
                        preActivity = _context.sent;
                        _context.next = 85;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].sleet,
                            as: 'sleet'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 85:
                        finalActivity = _context.sent;
                        activity.push(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToRain);
                        _context.prev = 89;

                        _iterator.s();

                      case 91:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 110;
                          break;
                        }

                        sleetee = _step.value;
                        _context.next = 95;
                        return sleetee.wallet.update({
                          available: sleetee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 95:
                        sleeteeWallet = _context.sent;
                        _context.next = 98;
                        return _models["default"].sleettip.create({
                          amount: Number(amountPerUser),
                          userId: sleetee.id,
                          sleetId: sleetRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 98:
                        sleettipRecord = _context.sent;

                        if (sleetee.ignoreMe) {
                          listOfUsersRained.push("".concat(sleetee.username));
                        } else {
                          userIdReceivedSleet = sleetee.user_id.replace('matrix-', '');
                          listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedSleet, "\">").concat(sleetee.username, "</a>"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 103;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'sleettip_s',
                          spenderId: user.id,
                          earnerId: sleetee.id,
                          sleetId: sleetRecord.id,
                          sleettipId: sleettipRecord.id,
                          earner_balance: sleeteeWallet.available + sleeteeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 103:
                        tipActivity = _context.sent;
                        _context.next = 106;
                        return _models["default"].activity.findOne({
                          where: {
                            id: tipActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }, {
                            model: _models["default"].sleet,
                            as: 'sleet'
                          }, {
                            model: _models["default"].sleettip,
                            as: 'sleettip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 106:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 108:
                        _context.next = 91;
                        break;

                      case 110:
                        _context.next = 115;
                        break;

                      case 112:
                        _context.prev = 112;
                        _context.t0 = _context["catch"](89);

                        _iterator.e(_context.t0);

                      case 115:
                        _context.prev = 115;

                        _iterator.f();

                        return _context.finish(115);

                      case 118:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 121;

                        _iterator2.s();

                      case 123:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 129;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 127;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.userListMessage)(element));

                      case 127:
                        _context.next = 123;
                        break;

                      case 129:
                        _context.next = 134;
                        break;

                      case 131:
                        _context.prev = 131;
                        _context.t1 = _context["catch"](121);

                        _iterator2.e(_context.t1);

                      case 134:
                        _context.prev = 134;

                        _iterator2.f();

                        return _context.finish(134);

                      case 137:
                        _context.next = 139;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.afterSuccessMessage)(message, sleetRecord.id, amount, usersToRain, amountPerUser, 'Sleet', 'sleeted'));

                      case 139:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 140:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[89, 112, 115, 118], [121, 131, 134, 137]]);
              }));

              return function (_x12) {
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
                          type: 'sleet',
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

                        _logger["default"].error("sleet error: ".concat(err));

                        _context2.prev = 10;
                        _context2.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Sleet'));

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

              return function (_x13) {
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

  return function matrixSleet(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixSleet = matrixSleet;