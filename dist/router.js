"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _walletNotify = _interopRequireDefault(require("./helpers/runebase/walletNotify"));

var _walletNotify2 = _interopRequireDefault(require("./helpers/pirate/walletNotify"));

var _admin = require("./controllers/admin");

var _balance = require("./controllers/telegram/balance");

var _deposit = require("./controllers/telegram/deposit");

var _withdraw = require("./controllers/telegram/withdraw");

var _tip = require("./controllers/telegram/tip");

var _rain = require("./controllers/telegram/rain");

var _balance2 = require("./controllers/discord/balance");

var _deposit2 = require("./controllers/discord/deposit");

var _withdraw2 = require("./controllers/discord/withdraw");

var _rain2 = require("./controllers/discord/rain");

var _sleet = require("./controllers/discord/sleet");

var _flood = require("./controllers/discord/flood");

var _tip2 = require("./controllers/discord/tip");

var _user = require("./controllers/telegram/user");

var _user2 = require("./controllers/discord/user");

var _group = require("./controllers/telegram/group");

var _channel = require("./controllers/discord/channel");

var _group2 = require("./controllers/discord/group");

var _info = require("./controllers/discord/info");

var _soak = require("./controllers/discord/soak");

var _thunder = require("./controllers/discord/thunder");

var _thunderstorm = require("./controllers/discord/thunderstorm");

var _hurricane = require("./controllers/discord/hurricane");

var _faucet = require("./controllers/discord/faucet");

var _help = require("./controllers/telegram/help");

var _ignore = require("./controllers/discord/ignore");

var _help2 = require("./controllers/discord/help");

var _reactdrop = require("./controllers/discord/reactdrop");

var _referral = require("./controllers/telegram/referral");

var _telegram = require("./messages/telegram");

var _discord = require("./messages/discord");

var _price = _interopRequireDefault(require("./controllers/telegram/price"));

var _exchanges = require("./controllers/telegram/exchanges");

var _settings = _interopRequireDefault(require("./config/settings"));

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _syncRunebase = require("./services/syncRunebase");

var _syncPirate = require("./services/syncPirate");

// import schedule from "node-schedule";
// import rateLimit from "telegraf-ratelimit";
(0, _dotenv.config)();
var queue = new _pQueue["default"]({
  concurrency: 1
});
var runesGroup = process.env.TELEGRAM_RUNES_GROUP; // Set limit to 1 message per 3 seconds

var limitConfig = {
  window: 10000,
  limit: 4,
  onLimitExceeded: function onLimitExceeded(ctx, next) {
    return ctx.reply('Rate limit exceeded - please wait 10 seconds');
  }
};

var localhostOnly = function localhostOnly(req, res, next) {
  var hostmachine = req.headers.host.split(':')[0];

  if (hostmachine !== 'localhost' && hostmachine !== '127.0.0.1') {
    return res.sendStatus(401);
  }

  next();
};

var router = function router(app, discordClient, telegramClient, io) {
  app.post('/api/chaininfo/block', localhostOnly, function (req, res) {
    console.log('new block found');

    if (_settings["default"].coin.name === 'Runebase') {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);
    } else if (_settings["default"].coin.name === 'Pirate') {
      (0, _syncPirate.startPirateSync)(discordClient, telegramClient);
    } else {
      (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);
    }
  });

  if (_settings["default"].coin.name === 'Pirate') {
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

  discordClient.on('ready', function () {
    console.log("Logged in as ".concat(discordClient.user.tag, "!"));
  });
  discordClient.on("messageCreate", /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message) {
      var groupTask, channelTask, lastSeenDiscordTask, walletExists, preFilteredMessageDiscord, filteredMessageDiscord, userToTipId, task, _task, _task2, _task3, _task4, _task5, _task6, _task7, _task8, _task9, _task10, _task11, _task12, _task13, _task14, _task15, _task16;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (message.author.bot) {
                _context3.next = 21;
                break;
              }

              _context3.next = 3;
              return (0, _user2.createUpdateDiscordUser)(message);

            case 3:
              walletExists = _context3.sent;
              _context3.next = 6;
              return queue.add(function () {
                return walletExists;
              });

            case 6:
              _context3.next = 8;
              return (0, _group2.updateDiscordGroup)(discordClient, message);

            case 8:
              groupTask = _context3.sent;
              _context3.next = 11;
              return queue.add(function () {
                return groupTask;
              });

            case 11:
              _context3.next = 13;
              return (0, _channel.updateDiscordChannel)(discordClient, message, groupTask);

            case 13:
              channelTask = _context3.sent;
              _context3.next = 16;
              return queue.add(function () {
                return channelTask;
              });

            case 16:
              _context3.next = 18;
              return (0, _user2.updateDiscordLastSeen)(discordClient, message);

            case 18:
              lastSeenDiscordTask = _context3.sent;
              _context3.next = 21;
              return queue.add(function () {
                return lastSeenDiscordTask;
              });

            case 21:
              if (!(!message.content.startsWith(_settings["default"].bot.command.discord) || message.author.bot)) {
                _context3.next = 23;
                break;
              }

              return _context3.abrupt("return");

            case 23:
              if (!message.content.startsWith(_settings["default"].bot.command.discord)) {
                _context3.next = 36;
                break;
              }

              if (!(groupTask && groupTask.banned)) {
                _context3.next = 28;
                break;
              }

              _context3.next = 27;
              return message.channel.send({
                embeds: [(0, _discord.discordServerBannedMessage)(groupTask)]
              });

            case 27:
              return _context3.abrupt("return");

            case 28:
              if (!(channelTask && channelTask.banned)) {
                _context3.next = 32;
                break;
              }

              _context3.next = 31;
              return message.channel.send({
                embeds: [(0, _discord.discordChannelBannedMessage)(channelTask)]
              });

            case 31:
              return _context3.abrupt("return");

            case 32:
              if (!(lastSeenDiscordTask && lastSeenDiscordTask.banned)) {
                _context3.next = 36;
                break;
              }

              _context3.next = 35;
              return message.channel.send({
                embeds: [(0, _discord.discordUserBannedMessage)(lastSeenDiscordTask)]
              });

            case 35:
              return _context3.abrupt("return");

            case 36:
              preFilteredMessageDiscord = message.content.split(' ');
              filteredMessageDiscord = preFilteredMessageDiscord.filter(function (el) {
                return el !== '';
              });

              if (!(filteredMessageDiscord.length > 1 && filteredMessageDiscord[1].startsWith('<@!'))) {
                _context3.next = 45;
                break;
              }

              userToTipId = filteredMessageDiscord[1].substring(0, filteredMessageDiscord[1].length - 1).substring(3);
              _context3.next = 42;
              return (0, _tip2.tipRunesToDiscordUser)(message, filteredMessageDiscord, userToTipId, io);

            case 42:
              task = _context3.sent;
              _context3.next = 45;
              return queue.add(function () {
                return task;
              });

            case 45:
              if (!(filteredMessageDiscord[1] === undefined)) {
                _context3.next = 51;
                break;
              }

              _context3.next = 48;
              return (0, _help2.discordHelp)(message, io);

            case 48:
              _task = _context3.sent;
              _context3.next = 51;
              return queue.add(function () {
                return _task;
              });

            case 51:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'help')) {
                _context3.next = 57;
                break;
              }

              _context3.next = 54;
              return (0, _help2.discordHelp)(message, io);

            case 54:
              _task2 = _context3.sent;
              _context3.next = 57;
              return queue.add(function () {
                return _task2;
              });

            case 57:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'info')) {
                _context3.next = 63;
                break;
              }

              _context3.next = 60;
              return (0, _info.discordCoinInfo)(message, io);

            case 60:
              _task3 = _context3.sent;
              _context3.next = 63;
              return queue.add(function () {
                return _task3;
              });

            case 63:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'ignoreme')) {
                _context3.next = 69;
                break;
              }

              _context3.next = 66;
              return (0, _ignore.setIgnoreMe)(message, io);

            case 66:
              _task4 = _context3.sent;
              _context3.next = 69;
              return queue.add(function () {
                return _task4;
              });

            case 69:
              console.log(filteredMessageDiscord);

              if (!(filteredMessageDiscord[1].toLowerCase() === 'balance')) {
                _context3.next = 76;
                break;
              }

              _context3.next = 73;
              return (0, _balance2.fetchDiscordWalletBalance)(message, io);

            case 73:
              _task5 = _context3.sent;
              _context3.next = 76;
              return queue.add(function () {
                return _task5;
              });

            case 76:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'faucet')) {
                _context3.next = 82;
                break;
              }

              _context3.next = 79;
              return (0, _faucet.discordFaucetClaim)(message, io);

            case 79:
              _task6 = _context3.sent;
              _context3.next = 82;
              return queue.add(function () {
                return _task6;
              });

            case 82:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'deposit')) {
                _context3.next = 88;
                break;
              }

              _context3.next = 85;
              return (0, _deposit2.fetchDiscordWalletDepositAddress)(message, io);

            case 85:
              _task7 = _context3.sent;
              _context3.next = 88;
              return queue.add(function () {
                return _task7;
              });

            case 88:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'withdraw')) {
                _context3.next = 94;
                break;
              }

              _context3.next = 91;
              return (0, _withdraw2.withdrawDiscordCreate)(message, filteredMessageDiscord, io);

            case 91:
              _task8 = _context3.sent;
              _context3.next = 94;
              return queue.add(function () {
                return _task8;
              });

            case 94:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'rain')) {
                _context3.next = 100;
                break;
              }

              _context3.next = 97;
              return (0, _rain2.discordRain)(discordClient, message, filteredMessageDiscord, io);

            case 97:
              _task9 = _context3.sent;
              _context3.next = 100;
              return queue.add(function () {
                return _task9;
              });

            case 100:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'flood')) {
                _context3.next = 106;
                break;
              }

              _context3.next = 103;
              return (0, _flood.discordFlood)(discordClient, message, filteredMessageDiscord, io);

            case 103:
              _task10 = _context3.sent;
              _context3.next = 106;
              return queue.add(function () {
                return _task10;
              });

            case 106:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunder')) {
                _context3.next = 112;
                break;
              }

              _context3.next = 109;
              return (0, _thunder.discordThunder)(discordClient, message, filteredMessageDiscord, io);

            case 109:
              _task11 = _context3.sent;
              _context3.next = 112;
              return queue.add(function () {
                return _task11;
              });

            case 112:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'thunderstorm')) {
                _context3.next = 118;
                break;
              }

              _context3.next = 115;
              return (0, _thunderstorm.discordThunderStorm)(discordClient, message, filteredMessageDiscord, io);

            case 115:
              _task12 = _context3.sent;
              _context3.next = 118;
              return queue.add(function () {
                return _task12;
              });

            case 118:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'hurricane')) {
                _context3.next = 124;
                break;
              }

              _context3.next = 121;
              return (0, _hurricane.discordHurricane)(discordClient, message, filteredMessageDiscord, io);

            case 121:
              _task13 = _context3.sent;
              _context3.next = 124;
              return queue.add(function () {
                return _task13;
              });

            case 124:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'soak')) {
                _context3.next = 130;
                break;
              }

              _context3.next = 127;
              return (0, _soak.discordSoak)(discordClient, message, filteredMessageDiscord, io);

            case 127:
              _task14 = _context3.sent;
              _context3.next = 130;
              return queue.add(function () {
                return _task14;
              });

            case 130:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'sleet')) {
                _context3.next = 136;
                break;
              }

              _context3.next = 133;
              return (0, _sleet.discordSleet)(discordClient, message, filteredMessageDiscord, io);

            case 133:
              _task15 = _context3.sent;
              _context3.next = 136;
              return queue.add(function () {
                return _task15;
              });

            case 136:
              if (!(filteredMessageDiscord[1].toLowerCase() === 'reactdrop')) {
                _context3.next = 142;
                break;
              }

              _context3.next = 139;
              return (0, _reactdrop.discordReactDrop)(discordClient, message, filteredMessageDiscord, io);

            case 139:
              _task16 = _context3.sent;
              _context3.next = 142;
              return queue.add(function () {
                return _task16;
              });

            case 142:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());
  telegramClient.hears('adminwithdrawals', function (ctx) {
    if (ctx.update.message.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      // console.log(ctx.from)
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var task;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _admin.withdrawTelegramAdminFetch)(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID));

              case 2:
                task = _context4.sent;
                _context4.next = 5;
                return queue.add(function () {
                  return task;
                });

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    }
  });
  telegramClient.action(/acceptWithdrawal-+/, function (ctx) {
    var withdrawalId = ctx.match.input.substring(17);

    if (ctx.update.callback_query.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var task;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _admin.withdrawTelegramAdminAccept)(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID), withdrawalId, runesGroup, discordClient);

              case 2:
                task = _context5.sent;
                _context5.next = 5;
                return queue.add(function () {
                  return task;
                });

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    }
  });
  telegramClient.action(/declineWithdrawal-+/, function (ctx) {
    var withdrawalId = ctx.match.input.substring(18);

    if (ctx.update.callback_query.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var task;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return (0, _admin.withdrawTelegramAdminDecline)(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID), withdrawalId, runesGroup, discordClient);

              case 2:
                task = _context6.sent;
                _context6.next = 5;
                return queue.add(function () {
                  return task;
                });

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    }
  });
  telegramClient.command('help', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var task;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _help.fetchHelp)(ctx, io);

            case 2:
              task = _context7.sent;
              _context7.next = 5;
              return queue.add(function () {
                return task;
              });

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  });
  telegramClient.command('price', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context8.sent;
              _context8.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context8.next = 7;
              return (0, _price["default"])(ctx, io);

            case 7:
              task = _context8.sent;
              _context8.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }))();
  });
  telegramClient.action('Price', function (ctx) {
    console.log(ctx);
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var task;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _price["default"])(ctx, io);

            case 2:
              task = _context9.sent;
              _context9.next = 5;
              return queue.add(function () {
                return task;
              });

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }))();
  });
  telegramClient.command('exchanges', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context10.sent;
              _context10.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context10.next = 7;
              return (0, _exchanges.fetchExchangeList)(ctx);

            case 7:
              task = _context10.sent;
              _context10.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }))();
  });
  telegramClient.action('Exchanges', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context11.sent;
              _context11.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context11.next = 7;
              return (0, _exchanges.fetchExchangeList)(ctx);

            case 7:
              task = _context11.sent;
              _context11.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }))();
  });
  telegramClient.command('balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context12.sent;
              _context12.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context12.next = 9;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 9:
              task = _context12.sent;
              _context12.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }))();
  });
  telegramClient.action('Balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context13.sent;
              _context13.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context13.next = 9;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 9:
              task = _context13.sent;
              _context13.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }))();
  });
  telegramClient.command('tip', function (ctx) {
    var filteredMessageTelegram = ctx.update.message.text.split(' ');

    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
    }

    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
    }

    if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        var groupTask, tipAmount, tipTo, task;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context14.sent;
                _context14.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                tipAmount = filteredMessageTelegram[2];
                tipTo = filteredMessageTelegram[1];
                _context14.next = 9;
                return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io);

              case 9:
                task = _context14.sent;
                _context14.next = 12;
                return queue.add(function () {
                  return task;
                });

              case 12:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }))();
    }
  });
  telegramClient.command('rain', function (ctx) {
    var filteredMessageTelegram = ctx.update.message.text.split(' ');

    if (!filteredMessageTelegram[1]) {
      ctx.reply('invalid amount of arguments');
    }

    if (filteredMessageTelegram[1]) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        var groupTask, rainAmount, task;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context15.sent;
                _context15.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                rainAmount = filteredMessageTelegram[1];
                _context15.next = 8;
                return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io);

              case 8:
                task = _context15.sent;
                _context15.next = 11;
                return queue.add(function () {
                  return task;
                });

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      }))();
    }
  });
  telegramClient.command('deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context16.sent;
              _context16.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context16.next = 9;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 9:
              task = _context16.sent;
              _context16.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }))();
  });
  telegramClient.action('Deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context17.sent;
              _context17.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context17.next = 9;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 9:
              task = _context17.sent;
              _context17.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }))();
  });
  telegramClient.command('withdraw', function (ctx) {
    var filteredMessageTelegram = ctx.update.message.text.split(' ');

    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
    }

    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
    }

    if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        var groupTask, withdrawalAddress, withdrawalAmount, task;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context18.sent;
                _context18.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                withdrawalAddress = filteredMessageTelegram[1];
                withdrawalAmount = filteredMessageTelegram[2];
                _context18.next = 9;
                return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io);

              case 9:
                task = _context18.sent;
                _context18.next = 12;
                return queue.add(function () {
                  return task;
                });

              case 12:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }))();
    }
  });
  telegramClient.command('referral', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context19.sent;
              _context19.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context19.next = 9;
              return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

            case 9:
              task = _context19.sent;
              _context19.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }))();
  });
  telegramClient.action('Referral', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
      var groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context20.sent;
              _context20.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context20.next = 9;
              return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

            case 9:
              task = _context20.sent;
              _context20.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }))();
  });
  telegramClient.command('top', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context21.sent;
              _context21.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context21.next = 7;
              return (0, _referral.fetchReferralTopTen)(ctx);

            case 7:
              task = _context21.sent;
              _context21.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }))();
  });
  telegramClient.action('ReferralTop', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context22.sent;
              _context22.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context22.next = 7;
              return (0, _referral.fetchReferralTopTen)(ctx);

            case 7:
              task = _context22.sent;
              _context22.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    }))();
  });
  telegramClient.command(_settings["default"].bot.command.telegram, function (ctx) {
    var filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);

    if (!filteredMessageTelegram[1]) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
        var groupTask, task;
        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context23.sent;
                _context23.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                _context23.next = 7;
                return (0, _help.fetchHelp)(ctx, io);

              case 7:
                task = _context23.sent;
                _context23.next = 10;
                return queue.add(function () {
                  return task;
                });

              case 10:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23);
      }))();
    }

    if (filteredMessageTelegram[1] === 'price') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
        var groupTask, task;
        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context24.sent;
                _context24.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                _context24.next = 7;
                return (0, _price["default"])(ctx, io);

              case 7:
                task = _context24.sent;
                _context24.next = 10;
                return queue.add(function () {
                  return task;
                });

              case 10:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24);
      }))();
    }

    if (filteredMessageTelegram[1] === 'exchanges') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
        var groupTask, task;
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context25.sent;
                _context25.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                _context25.next = 7;
                return (0, _exchanges.fetchExchangeList)(ctx);

              case 7:
                task = _context25.sent;
                _context25.next = 10;
                return queue.add(function () {
                  return task;
                });

              case 10:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25);
      }))();
    }

    if (filteredMessageTelegram[1] === 'help') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
        var groupTask, task;
        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context26.sent;
                _context26.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                _context26.next = 7;
                return (0, _help.fetchHelp)(ctx, io);

              case 7:
                task = _context26.sent;
                _context26.next = 10;
                return queue.add(function () {
                  return task;
                });

              case 10:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26);
      }))();
    }

    if (filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
        var groupTask, telegramUserId, telegramUserName, task;
        return _regenerator["default"].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context27.sent;
                _context27.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                telegramUserId = ctx.update.message.from.id;
                telegramUserName = ctx.update.message.from.username;
                _context27.next = 9;
                return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

              case 9:
                task = _context27.sent;
                _context27.next = 12;
                return queue.add(function () {
                  return task;
                });

              case 12:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }))();
    }

    if (filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28() {
        var groupTask, task;
        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context28.sent;
                _context28.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                _context28.next = 7;
                return (0, _referral.fetchReferralTopTen)(ctx);

              case 7:
                task = _context28.sent;
                _context28.next = 10;
                return queue.add(function () {
                  return task;
                });

              case 10:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }))();
    }

    if (filteredMessageTelegram[1] === 'balance') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
        var groupTask, telegramUserId, telegramUserName, task;
        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context29.sent;
                _context29.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                telegramUserId = ctx.update.message.from.id;
                telegramUserName = ctx.update.message.from.username;
                _context29.next = 9;
                return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

              case 9:
                task = _context29.sent;
                _context29.next = 12;
                return queue.add(function () {
                  return task;
                });

              case 12:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29);
      }))();
    }

    if (filteredMessageTelegram[1] === 'deposit') {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30() {
        var groupTask, telegramUserId, telegramUserName, task;
        return _regenerator["default"].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return (0, _group.updateGroup)(ctx);

              case 2:
                groupTask = _context30.sent;
                _context30.next = 5;
                return queue.add(function () {
                  return groupTask;
                });

              case 5:
                telegramUserId = ctx.update.message.from.id;
                telegramUserName = ctx.update.message.from.username;
                _context30.next = 9;
                return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

              case 9:
                task = _context30.sent;
                _context30.next = 12;
                return queue.add(function () {
                  return task;
                });

              case 12:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30);
      }))();
    }

    if (filteredMessageTelegram[1] === 'withdraw') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }

      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }

      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31() {
          var groupTask, withdrawalAddress, withdrawalAmount, task;
          return _regenerator["default"].wrap(function _callee31$(_context31) {
            while (1) {
              switch (_context31.prev = _context31.next) {
                case 0:
                  _context31.next = 2;
                  return (0, _group.updateGroup)(ctx);

                case 2:
                  groupTask = _context31.sent;
                  _context31.next = 5;
                  return queue.add(function () {
                    return groupTask;
                  });

                case 5:
                  withdrawalAddress = filteredMessageTelegram[2];
                  withdrawalAmount = filteredMessageTelegram[3];
                  _context31.next = 9;
                  return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io);

                case 9:
                  task = _context31.sent;
                  _context31.next = 12;
                  return queue.add(function () {
                    return task;
                  });

                case 12:
                case "end":
                  return _context31.stop();
              }
            }
          }, _callee31);
        }))();
      }
    }

    if (filteredMessageTelegram[1] === 'tip') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }

      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }

      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32() {
          var groupTask, tipAmount, tipTo, task;
          return _regenerator["default"].wrap(function _callee32$(_context32) {
            while (1) {
              switch (_context32.prev = _context32.next) {
                case 0:
                  _context32.next = 2;
                  return (0, _group.updateGroup)(ctx);

                case 2:
                  groupTask = _context32.sent;
                  _context32.next = 5;
                  return queue.add(function () {
                    return groupTask;
                  });

                case 5:
                  tipAmount = filteredMessageTelegram[3];
                  tipTo = filteredMessageTelegram[2];
                  _context32.next = 9;
                  return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io);

                case 9:
                  task = _context32.sent;
                  _context32.next = 12;
                  return queue.add(function () {
                    return task;
                  });

                case 12:
                case "end":
                  return _context32.stop();
              }
            }
          }, _callee32);
        }))();
      }
    }

    if (filteredMessageTelegram[1] === 'rain') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('invalid amount of arguments');
      }

      if (filteredMessageTelegram[2]) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33() {
          var groupTask, rainAmount, task;
          return _regenerator["default"].wrap(function _callee33$(_context33) {
            while (1) {
              switch (_context33.prev = _context33.next) {
                case 0:
                  _context33.next = 2;
                  return (0, _group.updateGroup)(ctx);

                case 2:
                  groupTask = _context33.sent;
                  _context33.next = 5;
                  return queue.add(function () {
                    return groupTask;
                  });

                case 5:
                  rainAmount = filteredMessageTelegram[2];
                  _context33.next = 8;
                  return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io);

                case 8:
                  task = _context33.sent;
                  _context33.next = 11;
                  return queue.add(function () {
                    return task;
                  });

                case 11:
                case "end":
                  return _context33.stop();
              }
            }
          }, _callee33);
        }))();
      }
    }

    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34() {
      var groupTask, task;
      return _regenerator["default"].wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context34.sent;
              _context34.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context34.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context34.sent;
              _context34.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
            case "end":
              return _context34.stop();
          }
        }
      }, _callee34);
    }))();
  });
  telegramClient.on('new_chat_members', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35() {
      var groupTask, task, taskReferred;
      return _regenerator["default"].wrap(function _callee35$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              _context35.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context35.sent;
              _context35.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context35.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context35.sent;
              _context35.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              if (!(_settings["default"].coin.name === 'Runebase')) {
                _context35.next = 17;
                break;
              }

              if (!(ctx.update.message.chat.id === Number(runesGroup))) {
                _context35.next = 17;
                break;
              }

              _context35.next = 14;
              return (0, _referral.createReferral)(ctx, telegramClient, runesGroup);

            case 14:
              taskReferred = _context35.sent;
              _context35.next = 17;
              return queue.add(function () {
                return taskReferred;
              });

            case 17:
            case "end":
              return _context35.stop();
          }
        }
      }, _callee35);
    }))();
  });
  telegramClient.on('text', function (ctx) {
    console.log('found text');
    console.log(ctx.update);
    console.log(ctx.update.message);

    _logger["default"].info("Chat - ".concat(ctx.update.message.chat.id, ": ").concat(ctx.update.message.chat.title, " : ").concat(ctx.update.message.from.username, ": ").concat(ctx.update.message.text));

    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36() {
      var groupTask, task, lastSeenTask;
      return _regenerator["default"].wrap(function _callee36$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context36.sent;
              _context36.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context36.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context36.sent;
              _context36.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              _context36.next = 12;
              return (0, _user.updateLastSeen)(ctx);

            case 12:
              lastSeenTask = _context36.sent;
              _context36.next = 15;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 15:
            case "end":
              return _context36.stop();
          }
        }
      }, _callee36);
    }))();
  });
  telegramClient.on('message', function (ctx) {
    console.log('found message');
    console.log(ctx.update);
    console.log(ctx.update.message);

    _logger["default"].info("Chat - ".concat(ctx.update.message.chat.id, ": ").concat(ctx.update.message.chat.title, " : ").concat(ctx.update.message.from.username, ": ").concat(ctx.update.message.text));

    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee37() {
      var groupTask, task, lastSeenTask;
      return _regenerator["default"].wrap(function _callee37$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context37.sent;
              _context37.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context37.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context37.sent;
              _context37.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              _context37.next = 12;
              return (0, _user.updateLastSeen)(ctx);

            case 12:
              lastSeenTask = _context37.sent;
              _context37.next = 15;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 15:
            case "end":
              return _context37.stop();
          }
        }
      }, _callee37);
    }))();
  });
};

exports.router = router;