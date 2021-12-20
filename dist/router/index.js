"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _walletNotify = _interopRequireDefault(require("../helpers/runebase/walletNotify"));

var _walletNotify2 = _interopRequireDefault(require("../helpers/pirate/walletNotify"));

var _telegram = require("../messages/telegram");

var _discord = require("../messages/discord");

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _syncRunebase = require("../services/syncRunebase");

var _syncPirate = require("../services/syncPirate");

var _discord2 = require("./discord");

var _telegram2 = require("./telegram");

(0, _dotenv.config)();

var localhostOnly = function localhostOnly(req, res, next) {
  var hostmachine = req.headers.host.split(':')[0];

  if (hostmachine !== 'localhost' && hostmachine !== '127.0.0.1') {
    return res.sendStatus(401);
  }

  next();
};

var router = function router(app, discordClient, telegramClient, io, settings, queue) {
  app.post('/api/chaininfo/block', localhostOnly, function (req, res) {
    console.log('new block found');

    if (settings.coin.setting === 'Runebase') {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);
    } else if (settings.coin.setting === 'Pirate') {
      (0, _syncPirate.startPirateSync)(discordClient, telegramClient);
    } else {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);
    }
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
  } else {
    app.post('/api/rpc/walletnotify', localhostOnly, _walletNotify["default"], /*#__PURE__*/function () {
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
  }

  (0, _discord2.discordRouter)(discordClient, queue, io, settings);
  (0, _telegram2.telegramRouter)(telegramClient, queue, io, settings);
};

exports.router = router;