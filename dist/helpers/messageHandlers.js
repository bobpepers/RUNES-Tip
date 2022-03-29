"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDepositOrWithdrawalCompleteMessageHandler = exports.incomingDepositMessageHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegram = require("../messages/telegram");

var _discord = require("../messages/discord");

var _matrix = require("../messages/matrix");

var _directMessageRoom = require("./client/matrix/directMessageRoom");

var isDepositOrWithdrawalCompleteMessageHandler = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(isDepositComplete, isWithdrawalComplete, discordClient, telegramClient, matrixClient, userToMessage, trans, amount) {
    var userClientId, myClient, _yield$findUserDirect, _yield$findUserDirect2, directUserMessageRoom, isCurrentRoomDirectMessage, userState, _myClient, _yield$findUserDirect3, _yield$findUserDirect4, _directUserMessageRoom, _isCurrentRoomDirectMessage, _userState;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!isDepositComplete) {
              _context.next = 31;
              break;
            }

            if (!userToMessage.user_id.startsWith('discord')) {
              _context.next = 9;
              break;
            }

            userClientId = userToMessage.user_id.replace('discord-', '');
            _context.next = 6;
            return discordClient.users.fetch(userClientId, false);

          case 6:
            myClient = _context.sent;
            _context.next = 9;
            return myClient.send({
              embeds: [(0, _discord.discordDepositConfirmedMessage)(amount, trans)]
            });

          case 9:
            if (!userToMessage.user_id.startsWith('telegram')) {
              _context.next = 19;
              break;
            }

            userClientId = userToMessage.user_id.replace('telegram-', '');
            _context.t0 = telegramClient.telegram;
            _context.t1 = userClientId;
            _context.next = 15;
            return (0, _telegram.telegramDepositConfirmedMessage)(amount, trans);

          case 15:
            _context.t2 = _context.sent;
            _context.t3 = {
              parse_mode: 'HTML'
            };
            _context.next = 19;
            return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

          case 19:
            if (!userToMessage.user_id.startsWith('matrix')) {
              _context.next = 31;
              break;
            }

            userClientId = userToMessage.user_id.replace('matrix-', '');
            _context.next = 23;
            return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, userClientId // message.sender.roomId,
            );

          case 23:
            _yield$findUserDirect = _context.sent;
            _yield$findUserDirect2 = (0, _slicedToArray2["default"])(_yield$findUserDirect, 3);
            directUserMessageRoom = _yield$findUserDirect2[0];
            isCurrentRoomDirectMessage = _yield$findUserDirect2[1];
            userState = _yield$findUserDirect2[2];

            if (!directUserMessageRoom) {
              _context.next = 31;
              break;
            }

            _context.next = 31;
            return matrixClient.sendEvent(directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixDepositConfirmedMessage)(amount, trans));

          case 31:
            if (!isWithdrawalComplete) {
              _context.next = 61;
              break;
            }

            if (!userToMessage.user_id.startsWith('discord')) {
              _context.next = 39;
              break;
            }

            userClientId = userToMessage.user_id.replace('discord-', '');
            _context.next = 36;
            return discordClient.users.fetch(userClientId, false);

          case 36:
            _myClient = _context.sent;
            _context.next = 39;
            return _myClient.send({
              embeds: [(0, _discord.discordWithdrawalConfirmedMessage)(userClientId, trans)]
            });

          case 39:
            if (!userToMessage.user_id.startsWith('telegram')) {
              _context.next = 49;
              break;
            }

            userClientId = userToMessage.user_id.replace('telegram-', '');
            _context.t4 = telegramClient.telegram;
            _context.t5 = userClientId;
            _context.next = 45;
            return (0, _telegram.telegramWithdrawalConfirmedMessage)(userToMessage, trans);

          case 45:
            _context.t6 = _context.sent;
            _context.t7 = {
              parse_mode: 'HTML'
            };
            _context.next = 49;
            return _context.t4.sendMessage.call(_context.t4, _context.t5, _context.t6, _context.t7);

          case 49:
            if (!userToMessage.user_id.startsWith('matrix')) {
              _context.next = 61;
              break;
            }

            userClientId = userToMessage.user_id.replace('matrix-', '');
            _context.next = 53;
            return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, userClientId);

          case 53:
            _yield$findUserDirect3 = _context.sent;
            _yield$findUserDirect4 = (0, _slicedToArray2["default"])(_yield$findUserDirect3, 3);
            _directUserMessageRoom = _yield$findUserDirect4[0];
            _isCurrentRoomDirectMessage = _yield$findUserDirect4[1];
            _userState = _yield$findUserDirect4[2];

            if (!_directUserMessageRoom) {
              _context.next = 61;
              break;
            }

            _context.next = 61;
            return matrixClient.sendEvent(_directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixWithdrawalConfirmedMessage)(userClientId, trans));

          case 61:
            _context.next = 66;
            break;

          case 63:
            _context.prev = 63;
            _context.t8 = _context["catch"](0);
            console.log(_context.t8);

          case 66:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 63]]);
  }));

  return function isDepositOrWithdrawalCompleteMessageHandler(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
    return _ref.apply(this, arguments);
  };
}();

exports.isDepositOrWithdrawalCompleteMessageHandler = isDepositOrWithdrawalCompleteMessageHandler;

var incomingDepositMessageHandler = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, telegramClient, matrixClient, detail) {
    var myClient, _yield$findUserDirect5, _yield$findUserDirect6, directUserMessageRoom, isCurrentRoomDirectMessage, userState;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(detail.platform === 'telegram')) {
              _context2.next = 10;
              break;
            }

            _context2.t0 = telegramClient.telegram;
            _context2.t1 = detail.userId;
            _context2.next = 6;
            return (0, _telegram.telegramIncomingDepositMessage)(detail);

          case 6:
            _context2.t2 = _context2.sent;
            _context2.t3 = {
              parse_mode: 'HTML'
            };
            _context2.next = 10;
            return _context2.t0.sendMessage.call(_context2.t0, _context2.t1, _context2.t2, _context2.t3);

          case 10:
            if (!(detail.platform === 'discord')) {
              _context2.next = 16;
              break;
            }

            _context2.next = 13;
            return discordClient.users.fetch(detail.userId, false);

          case 13:
            myClient = _context2.sent;
            _context2.next = 16;
            return myClient.send({
              embeds: [(0, _discord.discordIncomingDepositMessage)(detail)]
            });

          case 16:
            if (!(detail.platform === 'matrix')) {
              _context2.next = 27;
              break;
            }

            _context2.next = 19;
            return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, detail.userId);

          case 19:
            _yield$findUserDirect5 = _context2.sent;
            _yield$findUserDirect6 = (0, _slicedToArray2["default"])(_yield$findUserDirect5, 3);
            directUserMessageRoom = _yield$findUserDirect6[0];
            isCurrentRoomDirectMessage = _yield$findUserDirect6[1];
            userState = _yield$findUserDirect6[2];

            if (!directUserMessageRoom) {
              _context2.next = 27;
              break;
            }

            _context2.next = 27;
            return matrixClient.sendEvent(directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixIncomingDepositMessage)(detail));

          case 27:
            _context2.next = 32;
            break;

          case 29:
            _context2.prev = 29;
            _context2.t4 = _context2["catch"](0);
            console.log(_context2.t4);

          case 32:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 29]]);
  }));

  return function incomingDepositMessageHandler(_x9, _x10, _x11, _x12) {
    return _ref2.apply(this, arguments);
  };
}();

exports.incomingDepositMessageHandler = incomingDepositMessageHandler;