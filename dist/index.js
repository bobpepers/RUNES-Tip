"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

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
  timeout: 1000000000 // intervalCap: 1,
  // interval: 500,

}); // const telegrafGetChatMembers = require('telegraf-getchatmembers');

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

(0, _router.router)(app, discordClient, telegramClient, io, settings, queue);
(0, _router2.dashboardRouter)(app, io, discordClient, telegramClient);
server.listen(port);
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
  var allRunningReactDrops, _iterator, _step, _loop, schedulePatchDeposits, _schedulePatchDeposits, _schedulePatchDeposits2, _schedulePatchDeposits3;

  return _regenerator["default"].wrap(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return telegramClient.launch();

        case 2:
          _context4.next = 4;
          return discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

        case 4:
          _context4.next = 6;
          return (0, _initDatabaseRecords.initDatabaseRecords)(discordClient, telegramClient);

        case 6:
          _context4.next = 8;
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
          allRunningReactDrops = _context4.sent;
          // eslint-disable-next-line no-restricted-syntax
          _iterator = _createForOfIteratorHelper(allRunningReactDrops);
          _context4.prev = 10;
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
                    })), 5000);

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
            _context4.next = 17;
            break;
          }

          return _context4.delegateYield(_loop(), "t0", 15);

        case 15:
          _context4.next = 13;
          break;

        case 17:
          _context4.next = 22;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t1 = _context4["catch"](10);

          _iterator.e(_context4.t1);

        case 22:
          _context4.prev = 22;

          _iterator.f();

          return _context4.finish(22);

        case 25:
          if (!(settings.coin.setting === 'Runebase')) {
            _context4.next = 33;
            break;
          }

          _context4.next = 28;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);

        case 28:
          _context4.next = 30;
          return (0, _patcher.patchRunebaseDeposits)();

        case 30:
          schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });
          _context4.next = 54;
          break;

        case 33:
          if (!(settings.coin.setting === 'Pirate')) {
            _context4.next = 41;
            break;
          }

          _context4.next = 36;
          return (0, _syncPirate.startPirateSync)(discordClient, telegramClient);

        case 36:
          _context4.next = 38;
          return (0, _patcher2.patchPirateDeposits)();

        case 38:
          _schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher2.patchPirateDeposits)();
          });
          _context4.next = 54;
          break;

        case 41:
          if (!(settings.coin.setting === 'Komodo')) {
            _context4.next = 49;
            break;
          }

          _context4.next = 44;
          return (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient);

        case 44:
          _context4.next = 46;
          return (0, _patcher3.patchKomodoDeposits)();

        case 46:
          _schedulePatchDeposits2 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher3.patchKomodoDeposits)();
          });
          _context4.next = 54;
          break;

        case 49:
          _context4.next = 51;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient);

        case 51:
          _context4.next = 53;
          return (0, _patcher.patchRunebaseDeposits)();

        case 53:
          _schedulePatchDeposits3 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });

        case 54:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee3, null, [[10, 19, 22, 25]]);
}))();
(0, _updatePrice.updatePrice)();

var schedulePriceUpdate = _nodeSchedule["default"].scheduleJob('*/10 * * * *', function () {
  (0, _updatePrice.updatePrice)();
});

var scheduleWithdrawal = _nodeSchedule["default"].scheduleJob('*/2 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
  var autoWithdrawalSetting;
  return _regenerator["default"].wrap(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _models["default"].features.findOne({
            where: {
              name: 'autoWithdrawal'
            }
          });

        case 2:
          autoWithdrawalSetting = _context5.sent;

          if (autoWithdrawalSetting.enabled) {
            (0, _processWithdrawals.processWithdrawals)(telegramClient, discordClient);
          }

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee4);
})));

console.log('server listening on:', port);