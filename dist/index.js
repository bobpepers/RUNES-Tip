"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _telegraf = require("telegraf");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _compression = _interopRequireDefault(require("compression"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _passport = _interopRequireDefault(require("passport"));

var _router = require("./router");

var _router2 = require("./dashboard/router");

var _updatePrice = require("./helpers/updatePrice");

var _initDatabaseRecords = require("./helpers/initDatabaseRecords");

var _patcher = require("./helpers/runebase/patcher");

var _patcher2 = require("./helpers/pirate/patcher");

var _patcher3 = require("./helpers/komodo/patcher");

var _discord2 = require("./messages/discord");

var _reactdrop = require("./controllers/discord/reactdrop");

var _trivia = require("./controllers/discord/trivia");

var _models = _interopRequireDefault(require("./models"));

var _settings = _interopRequireDefault(require("./config/settings"));

var _syncKomodo = require("./services/syncKomodo");

var _syncRunebase = require("./services/syncRunebase");

var _syncPirate = require("./services/syncPirate");

var _processWithdrawals = require("./services/processWithdrawals");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

_dotenv["default"].config();

var settings = (0, _settings["default"])();
var queue = new _pQueue["default"]({
  concurrency: 1,
  timeout: 1000000000
});

var socketIo = require("socket.io");

var redis = require('redis');

var cookieParser = require('cookie-parser');

var port = process.env.PORT || 8080;
var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = socketIo(server, {
  path: '/socket.io',
  cookie: false
});

var session = require('express-session');

app.use((0, _compression["default"])());
app.use((0, _morgan["default"])('combined'));
app.use((0, _cors["default"])());
app.set('trust proxy', 1);

var connectRedis = require('connect-redis');

var RedisStore = connectRedis(session);
var CONF = {
  db: 3
};
var pub = redis.createClient(CONF);
var sessionStore = new RedisStore({
  client: pub
});
var sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  key: "connect.sid",
  resave: false,
  proxy: true,
  saveUninitialized: false,
  ephemeral: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
});
app.use(cookieParser());
app.use(_bodyParser["default"].urlencoded({
  extended: false,
  limit: '5mb'
}));
app.use(_bodyParser["default"].json());
app.use(sessionMiddleware);
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());

var wrap = function wrap(middleware) {
  return function (socket, next) {
    return middleware(socket.request, {}, next);
  };
};

io.use(wrap(sessionMiddleware));
io.use(wrap(_passport["default"].initialize()));
io.use(wrap(_passport["default"].session()));
var sockets = {};
io.on("connection", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket) {
    var userId;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = socket.request.session.passport ? socket.request.session.passport.user : '';

            if (socket.request.user && (socket.request.user.role === 4 || socket.request.user.role === 8)) {
              console.log('joined admin socket');
              socket.join('admin');
              sockets[userId] = socket;
            }

            console.log(Object.keys(sockets).length);
            socket.on("disconnect", function () {
              delete sockets[userId];
              console.log("Client disconnected");
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var discordClient = new _discord.Client({
  intents: [_discord.Intents.FLAGS.GUILDS, _discord.Intents.FLAGS.GUILD_MEMBERS, _discord.Intents.FLAGS.GUILD_PRESENCES, _discord.Intents.FLAGS.GUILD_MESSAGES, _discord.Intents.FLAGS.DIRECT_MESSAGES, _discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, _discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, _discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, _discord.Intents.FLAGS.GUILD_VOICE_STATES],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'] // makeCache: Options.cacheWithLimits({
  //  GuildEmoji: 5000, // This is default
  // }),

});
var telegramClient = new _telegraf.Telegraf(process.env.TELEGRAM_BOT_TOKEN); // telegramClient.use(telegrafGetChatMembers);

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
  var allRunningReactDrops, _iterator, _step, _loop, allRunningTrivia, _iterator2, _step2, _loop2, schedulePatchDeposits, _schedulePatchDeposits, _schedulePatchDeposits2, _schedulePatchDeposits3;

  return _regenerator["default"].wrap(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return telegramClient.launch();

        case 2:
          _context6.next = 4;
          return discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

        case 4:
          _context6.next = 6;
          return (0, _initDatabaseRecords.initDatabaseRecords)(discordClient, telegramClient);

        case 6:
          _context6.next = 8;
          return _models["default"].reactdrop.findAll({
            where: {
              ended: false
            },
            include: [{
              model: _models["default"].group,
              as: 'group'
            }, {
              model: _models["default"].channel,
              as: 'channel'
            }, {
              model: _models["default"].user,
              as: 'user'
            }]
          });

        case 8:
          allRunningReactDrops = _context6.sent;
          // eslint-disable-next-line no-restricted-syntax
          _iterator = _createForOfIteratorHelper(allRunningReactDrops);
          _context6.prev = 10;
          _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
            var runningReactDrop, actualChannelId, actualGroupId, actualUserId, reactMessage, countDownDate, now, distance, updateMessage;
            return _regenerator["default"].wrap(function _loop$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    runningReactDrop = _step.value;
                    actualChannelId = runningReactDrop.channel.channelId.replace('discord-', '');
                    actualGroupId = runningReactDrop.group.groupId.replace('discord-', '');
                    actualUserId = runningReactDrop.user.user_id.replace('discord-', ''); // eslint-disable-next-line no-await-in-loop

                    _context3.next = 6;
                    return discordClient.guilds.cache.get(actualGroupId).channels.cache.get(actualChannelId).messages.fetch(runningReactDrop.discordMessageId);

                  case 6:
                    reactMessage = _context3.sent;
                    _context3.next = 9;
                    return runningReactDrop.ends.getTime();

                  case 9:
                    countDownDate = _context3.sent;
                    now = new Date().getTime();
                    distance = countDownDate - now;
                    console.log('recover listenReactDrop'); // eslint-disable-next-line no-await-in-loop

                    _context3.next = 15;
                    return (0, _reactdrop.listenReactDrop)(reactMessage, distance, runningReactDrop, io, queue);

                  case 15:
                    // eslint-disable-next-line no-loop-func
                    updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                      return _regenerator["default"].wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              now = new Date().getTime();
                              distance = countDownDate - now;
                              _context2.next = 4;
                              return reactMessage.edit({
                                embeds: [(0, _discord2.reactDropMessage)(distance, actualUserId, runningReactDrop.emoji, runningReactDrop.amount)]
                              });

                            case 4:
                              if (distance < 0) {
                                clearInterval(updateMessage);
                              }

                            case 5:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    })), 10000);

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _loop);
          });

          _iterator.s();

        case 13:
          if ((_step = _iterator.n()).done) {
            _context6.next = 17;
            break;
          }

          return _context6.delegateYield(_loop(), "t0", 15);

        case 15:
          _context6.next = 13;
          break;

        case 17:
          _context6.next = 22;
          break;

        case 19:
          _context6.prev = 19;
          _context6.t1 = _context6["catch"](10);

          _iterator.e(_context6.t1);

        case 22:
          _context6.prev = 22;

          _iterator.f();

          return _context6.finish(22);

        case 25:
          _context6.next = 27;
          return _models["default"].trivia.findAll({
            where: {
              ended: false
            },
            include: [{
              model: _models["default"].group,
              as: 'group'
            }, {
              model: _models["default"].channel,
              as: 'channel'
            }, {
              model: _models["default"].user,
              as: 'user'
            }, {
              model: _models["default"].triviaquestion,
              as: 'triviaquestion',
              include: [{
                model: _models["default"].triviaanswer,
                as: 'triviaanswers'
              }]
            }]
          });

        case 27:
          allRunningTrivia = _context6.sent;
          // eslint-disable-next-line no-restricted-syntax
          _iterator2 = _createForOfIteratorHelper(allRunningTrivia);
          _context6.prev = 29;
          _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
            var runningTrivia, actualChannelId, actualGroupId, actualUserId, triviaMessage, countDownDate, now, distance, row, alphabet, answers, answerString, positionAlphabet, _iterator3, _step3, answer, updateMessage;

            return _regenerator["default"].wrap(function _loop2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    runningTrivia = _step2.value;
                    actualChannelId = runningTrivia.channel.channelId.replace('discord-', '');
                    actualGroupId = runningTrivia.group.groupId.replace('discord-', '');
                    actualUserId = runningTrivia.user.user_id.replace('discord-', ''); // eslint-disable-next-line no-await-in-loop

                    _context5.next = 6;
                    return discordClient.guilds.cache.get(actualGroupId).channels.cache.get(actualChannelId).messages.fetch(runningTrivia.discordMessageId);

                  case 6:
                    triviaMessage = _context5.sent;
                    _context5.next = 9;
                    return runningTrivia.ends.getTime();

                  case 9:
                    countDownDate = _context5.sent;
                    now = new Date().getTime();
                    distance = countDownDate - now;
                    row = new _discord.MessageActionRow();
                    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                    answers = _lodash["default"].shuffle(runningTrivia.triviaquestion.triviaanswers);
                    answerString = '';
                    positionAlphabet = 0; // console.log(answers);
                    // eslint-disable-next-line no-restricted-syntax

                    _iterator3 = _createForOfIteratorHelper(answers);

                    try {
                      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                        answer = _step3.value;
                        row.addComponents(new _discord.MessageButton().setCustomId(answer.answer).setLabel(alphabet[positionAlphabet]).setStyle('PRIMARY'));
                        answerString += "".concat(alphabet[positionAlphabet], ". ").concat(answer.answer, "\n");
                        positionAlphabet += 1;
                      } // eslint-disable-next-line no-await-in-loop

                    } catch (err) {
                      _iterator3.e(err);
                    } finally {
                      _iterator3.f();
                    }

                    _context5.next = 21;
                    return triviaMessage.edit({
                      embeds: [(0, _discord2.triviaMessageDiscord)(distance, actualUserId, runningTrivia.triviaquestion.question, answerString, runningTrivia.amount, runningTrivia.userCount)],
                      components: [row]
                    });

                  case 21:
                    // eslint-disable-next-line no-loop-func
                    updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                      return _regenerator["default"].wrap(function _callee3$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              now = new Date().getTime();
                              distance = countDownDate - now;
                              _context4.next = 4;
                              return triviaMessage.edit({
                                embeds: [(0, _discord2.triviaMessageDiscord)(distance, actualUserId, runningTrivia.triviaquestion.question, answerString, runningTrivia.amount, runningTrivia.userCount)]
                              });

                            case 4:
                              if (distance < 0) {
                                clearInterval(updateMessage);
                              }

                            case 5:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee3);
                    })), 10000);
                    console.log('recover trivia'); // eslint-disable-next-line no-await-in-loop

                    (0, _trivia.listenTrivia)(triviaMessage, distance, runningTrivia, io, queue, updateMessage, answerString);

                  case 24:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _loop2);
          });

          _iterator2.s();

        case 32:
          if ((_step2 = _iterator2.n()).done) {
            _context6.next = 36;
            break;
          }

          return _context6.delegateYield(_loop2(), "t2", 34);

        case 34:
          _context6.next = 32;
          break;

        case 36:
          _context6.next = 41;
          break;

        case 38:
          _context6.prev = 38;
          _context6.t3 = _context6["catch"](29);

          _iterator2.e(_context6.t3);

        case 41:
          _context6.prev = 41;

          _iterator2.f();

          return _context6.finish(41);

        case 44:
          if (!(settings.coin.setting === 'Runebase')) {
            _context6.next = 52;
            break;
          }

          _context6.next = 47;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);

        case 47:
          _context6.next = 49;
          return (0, _patcher.patchRunebaseDeposits)();

        case 49:
          schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });
          _context6.next = 73;
          break;

        case 52:
          if (!(settings.coin.setting === 'Pirate')) {
            _context6.next = 60;
            break;
          }

          _context6.next = 55;
          return (0, _syncPirate.startPirateSync)(discordClient, telegramClient);

        case 55:
          _context6.next = 57;
          return (0, _patcher2.patchPirateDeposits)();

        case 57:
          _schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher2.patchPirateDeposits)();
          });
          _context6.next = 73;
          break;

        case 60:
          if (!(settings.coin.setting === 'Komodo')) {
            _context6.next = 68;
            break;
          }

          _context6.next = 63;
          return (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient);

        case 63:
          _context6.next = 65;
          return (0, _patcher3.patchKomodoDeposits)();

        case 65:
          _schedulePatchDeposits2 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher3.patchKomodoDeposits)();
          });
          _context6.next = 73;
          break;

        case 68:
          _context6.next = 70;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);

        case 70:
          _context6.next = 72;
          return (0, _patcher.patchRunebaseDeposits)();

        case 72:
          _schedulePatchDeposits3 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });

        case 73:
          (0, _router.router)(app, discordClient, telegramClient, io, settings, queue);
          (0, _router2.dashboardRouter)(app, io, discordClient, telegramClient);
          server.listen(port);

        case 76:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee4, null, [[10, 19, 22, 25], [29, 38, 41, 44]]);
}))();
(0, _updatePrice.updatePrice)();

var schedulePriceUpdate = _nodeSchedule["default"].scheduleJob('*/10 * * * *', function () {
  (0, _updatePrice.updatePrice)();
});

var scheduleWithdrawal = _nodeSchedule["default"].scheduleJob('*/2 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
  var autoWithdrawalSetting;
  return _regenerator["default"].wrap(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _models["default"].features.findOne({
            where: {
              name: 'autoWithdrawal'
            }
          });

        case 2:
          autoWithdrawalSetting = _context7.sent;

          if (autoWithdrawalSetting.enabled) {
            (0, _processWithdrawals.processWithdrawals)(telegramClient, discordClient);
          }

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee5);
})));

console.log('server listening on:', port);