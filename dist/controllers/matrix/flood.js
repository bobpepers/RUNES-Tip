"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixFlood = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _matrix = require("../../messages/matrix");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/matrix/validateAmount");

var _mapMembers = require("../../helpers/matrix/mapMembers");

var _userWalletExist = require("../../helpers/matrix/userWalletExist");

var _waterFaucet = require("../../helpers/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var matrixFlood = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(matrixClient, message, filteredMessage, io, groupTask, setting, faucetSetting, queue, userDirectMessageRoomId, isCurrentRoomDirectMessage) {
    var user, userActivity, currentRoom, members, activity;
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
                var onlineMembers, _yield$userWalletExis, _yield$userWalletExis2, withoutBots, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, factivity, updatedBalance, fee, amountPerUser, faucetWatered, floodRecord, cactivity, activityCreate, listOfUsersRained, _iterator, _step, floodee, floodeeWallet, floodtipRecord, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                        return matrixClient.getRoom(message.sender.roomId);

                      case 6:
                        currentRoom = _context.sent;
                        _context.next = 9;
                        return currentRoom.getMembers();

                      case 9:
                        members = _context.sent;
                        onlineMembers = members.filter(function (member) {
                          console.log(member);
                          console.log(member.presence);
                          return member;
                        });
                        _context.next = 13;
                        return (0, _userWalletExist.userWalletExist)(matrixClient, message, t, filteredMessage[1].toLowerCase());

                      case 13:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 20;
                          break;
                        }

                        return _context.abrupt("return");

                      case 20:
                        _context.next = 22;
                        return (0, _mapMembers.mapMembers)(matrixClient, message, t, onlineMembers, setting);

                      case 22:
                        withoutBots = _context.sent;
                        _context.next = 25;
                        return (0, _validateAmount.validateAmount)(matrixClient, message, t, filteredMessage[2], user, setting, filteredMessage[1].toLowerCase());

                      case 25:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 32;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 32:
                        if (!(withoutBots.length < 2)) {
                          _context.next = 40;
                          break;
                        }

                        _context.next = 35;
                        return _models["default"].activity.create({
                          type: 'flood_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        factivity = _context.sent;
                        activity.unshift(factivity);
                        _context.next = 39;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.notEnoughUsers)());

                      case 39:
                        return _context.abrupt("return");

                      case 40:
                        _context.next = 42;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        updatedBalance = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        amountPerUser = ((amount - Number(fee)) / withoutBots.length).toFixed(0);
                        _context.next = 47;
                        return (0, _waterFaucet.waterFaucet)(t, Number(fee), faucetSetting);

                      case 47:
                        faucetWatered = _context.sent;
                        _context.next = 50;
                        return _models["default"].flood.create({
                          feeAmount: fee,
                          amount: amount,
                          userCount: withoutBots.length,
                          userId: user.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 50:
                        floodRecord = _context.sent;
                        _context.next = 53;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'flood_s',
                          spenderId: user.id,
                          floodId: floodRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        cactivity = _context.sent;
                        _context.next = 56;
                        return _models["default"].activity.findOne({
                          where: {
                            id: cactivity.id
                          },
                          include: [{
                            model: _models["default"].flood,
                            as: 'flood'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(withoutBots);
                        _context.prev = 60;

                        _iterator.s();

                      case 62:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 81;
                          break;
                        }

                        floodee = _step.value;
                        _context.next = 66;
                        return floodee.wallet.update({
                          available: floodee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 66:
                        floodeeWallet = _context.sent;
                        _context.next = 69;
                        return _models["default"].floodtip.create({
                          amount: amountPerUser,
                          userId: floodee.id,
                          floodId: floodRecord.id,
                          groupId: groupTask.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 69:
                        floodtipRecord = _context.sent;

                        if (floodee.ignoreMe) {
                          listOfUsersRained.push("".concat(floodee.username));
                        } else {
                          userIdReceivedRain = floodee.user_id.replace('matrix-', '');
                          listOfUsersRained.push("<a href=\"https://matrix.to/#/".concat(userIdReceivedRain, "\">").concat(floodee.username, "</a>"));
                        }

                        tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                        _context.next = 74;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'floodtip_s',
                          spenderId: user.id,
                          earnerId: floodee.id,
                          floodId: floodRecord.id,
                          floodtipId: floodtipRecord.id,
                          earner_balance: floodeeWallet.available + floodeeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 74:
                        tipActivity = _context.sent;
                        _context.next = 77;
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
                            model: _models["default"].flood,
                            as: 'flood'
                          }, {
                            model: _models["default"].floodtip,
                            as: 'floodtip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 77:
                        tipActivity = _context.sent;
                        activity.unshift(tipActivity);

                      case 79:
                        _context.next = 62;
                        break;

                      case 81:
                        _context.next = 86;
                        break;

                      case 83:
                        _context.prev = 83;
                        _context.t0 = _context["catch"](60);

                        _iterator.e(_context.t0);

                      case 86:
                        _context.prev = 86;

                        _iterator.f();

                        return _context.finish(86);

                      case 89:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,6999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 92;

                        _iterator2.s();

                      case 94:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 100;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 98;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.userListMessage)(element));

                      case 98:
                        _context.next = 94;
                        break;

                      case 100:
                        _context.next = 105;
                        break;

                      case 102:
                        _context.prev = 102;
                        _context.t1 = _context["catch"](92);

                        _iterator2.e(_context.t1);

                      case 105:
                        _context.prev = 105;

                        _iterator2.f();

                        return _context.finish(105);

                      case 108:
                        _context.next = 110;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.afterSuccessMessage)(message, floodRecord.id, amount, withoutBots, amountPerUser, 'Flood', 'flooded'));

                      case 110:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 111:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[60, 83, 86, 89], [92, 102, 105, 108]]);
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
                          type: 'flood',
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

                        _logger["default"].error("flood error: ".concat(err));

                        _context2.prev = 10;
                        _context2.next = 13;
                        return matrixClient.sendEvent(message.sender.roomId, "m.room.message", (0, _matrix.errorMessage)('Flood'));

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

  return function matrixFlood(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

exports.matrixFlood = matrixFlood;