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

var _validateAmount = require("../../helpers/matrix/validateAmount");

var _userWalletExist = require("../../helpers/matrix/userWalletExist");

var _waterFaucet = require("../../helpers/discord/waterFaucet");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _matrix = require("../../messages/matrix");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var matrixSleet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var activity, userActivity, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!isCurrentRoomDirectMessage) {
              _context3.next = 10;
              break;
            }

            _context3.prev = 1;
            _context3.next = 4;
            return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notInDirectMessage)(message, 'Flood'));

          case 4:
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);

          case 9:
            return _context3.abrupt("return");

          case 10:
            activity = [];
            _context3.next = 13;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, group, groupFailActivity, textTime, cutLastTimeLetter, cutNumberTime, isnum, lastSeenOptions, activityA, dateObj, usersToRain, failActivity, updatedBalance, fee, amountPerUser, faucetWatered, sleetRecord, preActivity, finalActivity, listOfUsersRained, _iterator, _step, sleetee, sleeteeWallet, sleettipRecord, userIdReceivedSleet, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

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
                        return _models["default"].group.findOne({
                          where: {
                            id: groupTask.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 20:
                        group = _context.sent;

                        if (group) {
                          _context.next = 35;
                          break;
                        }

                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        groupFailActivity = _context.sent;
                        activity.unshift(groupFailActivity);
                        _context.prev = 26;
                        _context.next = 29;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.groupNotFoundMessage)());

                      case 29:
                        _context.next = 34;
                        break;

                      case 31:
                        _context.prev = 31;
                        _context.t0 = _context["catch"](26);
                        console.log(_context.t0);

                      case 34:
                        return _context.abrupt("return");

                      case 35:
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
                          _context.next = 53;
                          break;
                        }

                        console.log('not pass');
                        console.log(user.id);
                        _context.next = 42;
                        return _models["default"].activity.create({
                          type: 'sleet_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.prev = 44;
                        _context.next = 47;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.invalidTimeMessage)(message, 'Sleet'));

                      case 47:
                        _context.next = 52;
                        break;

                      case 49:
                        _context.prev = 49;
                        _context.t1 = _context["catch"](44);
                        console.log(_context.t1);

                      case 52:
                        return _context.abrupt("return");

                      case 53:
                        if (!(filteredMessage[2] && isnum // && Number(cutNumberTime) < 0
                        && (cutLastTimeLetter === 'd' || cutLastTimeLetter === 'h' || cutLastTimeLetter === 'm' || cutLastTimeLetter === 's'))) {
                          _context.next = 65;
                          break;
                        }

                        _context.next = 56;
                        return new Date().getTime();

                      case 56:
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

                        _context.next = 63;
                        return new Date(dateObj);

                      case 63:
                        dateObj = _context.sent;
                        lastSeenOptions = (0, _defineProperty2["default"])({}, _sequelize.Op.gte, dateObj);

                      case 65:
                        _context.next = 67;
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

                      case 67:
                        usersToRain = _context.sent;

                        if (!(usersToRain.length < 2)) {
                          _context.next = 82;
                          break;
                        }

                        _context.next = 71;
                        return _models["default"].activity.create({
                          type: 'sleet_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 71:
                        failActivity = _context.sent;
                        activity.unshift(failActivity);
                        _context.prev = 73;
                        _context.next = 76;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notEnoughUsers)(message, 'Sleet'));

                      case 76:
                        _context.next = 81;
                        break;

                      case 78:
                        _context.prev = 78;
                        _context.t2 = _context["catch"](73);
                        console.log(_context.t2);

                      case 81:
                        return _context.abrupt("return");

                      case 82:
                        if (!(usersToRain.length >= 2)) {
                          _context.next = 165;
                          break;
                        }

                        _context.next = 85;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 85:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / usersToRain.length).toFixed(0);
                        _context.next = 90;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 90:
                        faucetWatered = _context.sent;
                        _context.next = 93;
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

                      case 93:
                        sleetRecord = _context.sent;
                        _context.next = 96;
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

                      case 96:
                        preActivity = _context.sent;
                        _context.next = 99;
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

                      case 99:
                        finalActivity = _context.sent;
                        activity.push(finalActivity);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToRain);
                        _context.prev = 103;

                        _iterator.s();

                      case 105:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 124;
                          break;
                        }

                        sleetee = _step.value;
                        _context.next = 109;
                        return sleetee.wallet.update({
                          available: sleetee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 109:
                        sleeteeWallet = _context.sent;
                        _context.next = 112;
                        return _models["default"].sleettip.create({
                          amount: Number(amountPerUser),
                          userId: sleetee.id,
                          sleetId: sleetRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 112:
                        sleettipRecord = _context.sent;

                        if (sleetee.ignoreMe) {
                          listOfUsersRained.push("".concat(sleetee.username));
                        } else {
                          userIdReceivedSleet = sleetee.user_id.replace('matrix-', '');
                          listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedSleet, "\">").concat(sleetee.username, "</a>"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 117;
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

                      case 117:
                        tipActivity = _context.sent;
                        _context.next = 120;
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

                      case 120:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 122:
                        _context.next = 105;
                        break;

                      case 124:
                        _context.next = 129;
                        break;

                      case 126:
                        _context.prev = 126;
                        _context.t3 = _context["catch"](103);

                        _iterator.e(_context.t3);

                      case 129:
                        _context.prev = 129;

                        _iterator.f();

                        return _context.finish(129);

                      case 132:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 135;

                        _iterator2.s();

                      case 137:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 149;
                          break;
                        }

                        element = _step2.value;
                        _context.prev = 139;
                        _context.next = 142;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.userListMessage)(element));

                      case 142:
                        _context.next = 147;
                        break;

                      case 144:
                        _context.prev = 144;
                        _context.t4 = _context["catch"](139);
                        console.log(_context.t4);

                      case 147:
                        _context.next = 137;
                        break;

                      case 149:
                        _context.next = 154;
                        break;

                      case 151:
                        _context.prev = 151;
                        _context.t5 = _context["catch"](135);

                        _iterator2.e(_context.t5);

                      case 154:
                        _context.prev = 154;

                        _iterator2.f();

                        return _context.finish(154);

                      case 157:
                        _context.prev = 157;
                        _context.next = 160;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.afterSuccessMessage)(message, sleetRecord.id, amount, usersToRain, amountPerUser, 'Sleet', 'sleeted'));

                      case 160:
                        _context.next = 165;
                        break;

                      case 162:
                        _context.prev = 162;
                        _context.t6 = _context["catch"](157);
                        console.log(_context.t6);

                      case 165:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 166:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[26, 31], [44, 49], [73, 78], [103, 126, 129, 132], [135, 151, 154, 157], [139, 144], [157, 162]]);
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

              return function (_x12) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 13:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 6]]);
  }));

  return function matrixSleet(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixSleet = matrixSleet;