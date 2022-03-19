"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _walletNotify = _interopRequireDefault(require("../helpers/runebase/walletNotify"));

var _walletNotify2 = _interopRequireDefault(require("../helpers/pirate/walletNotify"));

var _walletNotify3 = _interopRequireDefault(require("../helpers/komodo/walletNotify"));

var _telegram = require("../messages/telegram");

var _discord = require("../messages/discord");

var _matrix = require("../messages/matrix");

var _syncRunebase = require("../services/syncRunebase");

var _syncPirate = require("../services/syncPirate");

var _syncKomodo = require("../services/syncKomodo");

var _directMessageRoom = require("../helpers/matrix/directMessageRoom");

var localhostOnly = function localhostOnly(req, res, next) {
  var hostmachine = req.headers.host.split(':')[0];

  if (hostmachine !== 'localhost' && hostmachine !== '127.0.0.1') {
    return res.sendStatus(401);
  }

  next();
};

var notifyRouter = function notifyRouter(app, discordClient, telegramClient, matrixClient, settings, queue) {
  app.post('/api/chaininfo/block', localhostOnly, function (req, res) {
    if (settings.coin.setting === 'Runebase') {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);
    } else if (settings.coin.setting === 'Pirate') {
      (0, _syncPirate.startPirateSync)(discordClient, telegramClient, queue);
    } else if (settings.coin.setting === 'Komodo') {
      (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient, queue);
    } else {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);
    }

    res.sendStatus(200);
  });

  if (settings.coin.setting === 'Pirate') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify2["default"], /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
        var myClient;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!res.locals.error) {
                  _context.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context.next = 12;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount)) {
                  _context.next = 12;
                  break;
                }

                if (res.locals.platform === 'telegram') {
                  telegramClient.telegram.sendMessage(res.locals.userId, (0, _telegram.telegramIncomingDepositMessage)(res));
                }

                if (!(res.locals.platform === 'discord')) {
                  _context.next = 12;
                  break;
                }

                _context.next = 9;
                return discordClient.users.fetch(res.locals.userId, false);

              case 9:
                myClient = _context.sent;
                _context.next = 12;
                return myClient.send({
                  embeds: [(0, _discord.discordIncomingDepositMessage)(res)]
                });

              case 12:
                res.sendStatus(200);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  } else if (settings.coin.setting === 'Komodo') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify3["default"], /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        var myClient;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!res.locals.error) {
                  _context2.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context2.next = 12;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount)) {
                  _context2.next = 12;
                  break;
                }

                if (res.locals.platform === 'telegram') {
                  telegramClient.telegram.sendMessage(res.locals.userId, (0, _telegram.telegramIncomingDepositMessage)(res));
                }

                if (!(res.locals.platform === 'discord')) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 9;
                return discordClient.users.fetch(res.locals.userId, false);

              case 9:
                myClient = _context2.sent;
                _context2.next = 12;
                return myClient.send({
                  embeds: [(0, _discord.discordIncomingDepositMessage)(res)]
                });

              case 12:
                res.sendStatus(200);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
  } else if (settings.coin.setting === 'Runebase') {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify["default"], /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
        var myClient, _yield$findUserDirect, _yield$findUserDirect2, directUserMessageRoom, isCurrentRoomDirectMessage, userState;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!res.locals.error) {
                  _context3.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context3.next = 23;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount)) {
                  _context3.next = 23;
                  break;
                }

                if (res.locals.platform === 'telegram') {
                  telegramClient.telegram.sendMessage(res.locals.userId, (0, _telegram.telegramIncomingDepositMessage)(res));
                }

                if (!(res.locals.platform === 'discord')) {
                  _context3.next = 12;
                  break;
                }

                _context3.next = 9;
                return discordClient.users.fetch(res.locals.userId, false);

              case 9:
                myClient = _context3.sent;
                _context3.next = 12;
                return myClient.send({
                  embeds: [(0, _discord.discordIncomingDepositMessage)(res)]
                });

              case 12:
                if (!(res.locals.platform === 'matrix')) {
                  _context3.next = 23;
                  break;
                }

                _context3.next = 15;
                return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, res.locals.userId);

              case 15:
                _yield$findUserDirect = _context3.sent;
                _yield$findUserDirect2 = (0, _slicedToArray2["default"])(_yield$findUserDirect, 3);
                directUserMessageRoom = _yield$findUserDirect2[0];
                isCurrentRoomDirectMessage = _yield$findUserDirect2[1];
                userState = _yield$findUserDirect2[2];

                if (!directUserMessageRoom) {
                  _context3.next = 23;
                  break;
                }

                _context3.next = 23;
                return matrixClient.sendEvent(directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixIncomingDepositMessage)(res));

              case 23:
                res.sendStatus(200);

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }());
  } else {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify["default"], /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
        var myClient, _yield$findUserDirect3, _yield$findUserDirect4, directUserMessageRoom, isCurrentRoomDirectMessage, userState;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!res.locals.error) {
                  _context4.next = 4;
                  break;
                }

                console.log(res.locals.error);
                _context4.next = 23;
                break;

              case 4:
                if (!(!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount)) {
                  _context4.next = 23;
                  break;
                }

                if (res.locals.platform === 'telegram') {
                  telegramClient.telegram.sendMessage(res.locals.userId, (0, _telegram.telegramIncomingDepositMessage)(res));
                }

                if (!(res.locals.platform === 'discord')) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 9;
                return discordClient.users.fetch(res.locals.userId, false);

              case 9:
                myClient = _context4.sent;
                _context4.next = 12;
                return myClient.send({
                  embeds: [(0, _discord.discordIncomingDepositMessage)(res)]
                });

              case 12:
                if (!(res.locals.platform === 'matrix')) {
                  _context4.next = 23;
                  break;
                }

                _context4.next = 15;
                return (0, _directMessageRoom.findUserDirectMessageRoom)(matrixClient, res.locals.userId);

              case 15:
                _yield$findUserDirect3 = _context4.sent;
                _yield$findUserDirect4 = (0, _slicedToArray2["default"])(_yield$findUserDirect3, 3);
                directUserMessageRoom = _yield$findUserDirect4[0];
                isCurrentRoomDirectMessage = _yield$findUserDirect4[1];
                userState = _yield$findUserDirect4[2];

                if (!directUserMessageRoom) {
                  _context4.next = 23;
                  break;
                }

                _context4.next = 23;
                return matrixClient.sendEvent(directUserMessageRoom.roomId, "m.room.message", (0, _matrix.matrixIncomingDepositMessage)(res));

              case 23:
                res.sendStatus(200);

              case 24:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
      };
    }());
  }
};

exports.notifyRouter = notifyRouter;