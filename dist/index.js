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

var _olm = _interopRequireDefault(require("@matrix-org/olm"));

var _matrixJsSdk = _interopRequireDefault(require("matrix-js-sdk"));

var _router = require("./router");

var _router2 = require("./dashboard/router");

var _updatePrice = require("./helpers/updatePrice");

var _initDatabaseRecords = require("./helpers/initDatabaseRecords");

var _patcher = require("./helpers/blockchain/runebase/patcher");

var _patcher2 = require("./helpers/blockchain/pirate/patcher");

var _patcher3 = require("./helpers/blockchain/komodo/patcher");

var _recover = require("./helpers/recover");

var _models = _interopRequireDefault(require("./models"));

var _settings = _interopRequireDefault(require("./config/settings"));

var _syncKomodo = require("./services/syncKomodo");

var _syncRunebase = require("./services/syncRunebase");

var _syncPirate = require("./services/syncPirate");

var _processWithdrawals = require("./services/processWithdrawals");

/* eslint-disable import/first */
global.Olm = _olm["default"];

var _require = require('node-localstorage'),
    LocalStorage = _require.LocalStorage;

var localStorage = new LocalStorage('./scratch');

var _require2 = require('matrix-js-sdk/lib/crypto/store/localStorage-crypto-store'),
    LocalStorageCryptoStore = _require2.LocalStorageCryptoStore;

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
              // console.log('joined admin socket');
              // console.log(userId);
              socket.join('admin');
              sockets[userId] = socket;
            } // console.log(Object.keys(sockets).length);


            socket.on("disconnect", function () {
              delete sockets[userId]; // console.log("Client disconnected");
              // console.log(userId);
            });

          case 3:
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
var telegramClient = new _telegraf.Telegraf(process.env.TELEGRAM_BOT_TOKEN);

var matrixClient = _matrixJsSdk["default"].createClient({
  baseUrl: "https://matrix.org"
});

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var matrixLoginCredentials, schedulePatchDeposits, _schedulePatchDeposits, _schedulePatchDeposits2, _schedulePatchDeposits3;

  return _regenerator["default"].wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return telegramClient.launch();

        case 2:
          _context2.next = 4;
          return discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return matrixClient.login("m.login.password", {
            user: process.env.MATRIX_USER,
            password: process.env.MATRIX_PASS
          });

        case 7:
          matrixLoginCredentials = _context2.sent;
          matrixClient = _matrixJsSdk["default"].createClient({
            baseUrl: "https://matrix.org",
            accessToken: matrixLoginCredentials.access_token,
            sessionStore: new _matrixJsSdk["default"].WebStorageSessionStore(localStorage),
            cryptoStore: new LocalStorageCryptoStore(localStorage),
            userId: matrixLoginCredentials.user_id,
            deviceId: matrixLoginCredentials.device_id,
            timelineSupport: true
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          console.log(_context2.t0);

        case 14:
          _context2.next = 16;
          return (0, _initDatabaseRecords.initDatabaseRecords)(discordClient, telegramClient);

        case 16:
          _context2.next = 18;
          return (0, _recover.recoverDiscordReactdrops)(discordClient, io, queue);

        case 18:
          _context2.next = 20;
          return (0, _recover.recoverDiscordTrivia)(discordClient, io, queue);

        case 20:
          if (!(settings.coin.setting === 'Runebase')) {
            _context2.next = 28;
            break;
          }

          _context2.next = 23;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);

        case 23:
          _context2.next = 25;
          return (0, _patcher.patchRunebaseDeposits)();

        case 25:
          schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });
          _context2.next = 49;
          break;

        case 28:
          if (!(settings.coin.setting === 'Pirate')) {
            _context2.next = 36;
            break;
          }

          _context2.next = 31;
          return (0, _syncPirate.startPirateSync)(discordClient, telegramClient, matrixClient, queue);

        case 31:
          _context2.next = 33;
          return (0, _patcher2.patchPirateDeposits)();

        case 33:
          _schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher2.patchPirateDeposits)();
          });
          _context2.next = 49;
          break;

        case 36:
          if (!(settings.coin.setting === 'Komodo')) {
            _context2.next = 44;
            break;
          }

          _context2.next = 39;
          return (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient, matrixClient, queue);

        case 39:
          _context2.next = 41;
          return (0, _patcher3.patchKomodoDeposits)();

        case 41:
          _schedulePatchDeposits2 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher3.patchKomodoDeposits)();
          });
          _context2.next = 49;
          break;

        case 44:
          _context2.next = 46;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);

        case 46:
          _context2.next = 48;
          return (0, _patcher.patchRunebaseDeposits)();

        case 48:
          _schedulePatchDeposits3 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });

        case 49:
          (0, _router.router)(app, discordClient, telegramClient, matrixClient, io, settings, queue);
          (0, _router2.dashboardRouter)(app, io, discordClient, telegramClient, matrixClient);
          server.listen(port);

        case 52:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[4, 11]]);
}))();
(0, _updatePrice.updatePrice)();

var schedulePriceUpdate = _nodeSchedule["default"].scheduleJob('*/20 * * * *', function () {
  // Update price every 20 minutes
  (0, _updatePrice.updatePrice)();
});

var scheduleWithdrawal = _nodeSchedule["default"].scheduleJob('*/5 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
  var autoWithdrawalSetting;
  return _regenerator["default"].wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _models["default"].features.findOne({
            where: {
              name: 'autoWithdrawal'
            }
          });

        case 2:
          autoWithdrawalSetting = _context3.sent;

          if (autoWithdrawalSetting.enabled) {
            (0, _processWithdrawals.processWithdrawals)(telegramClient, discordClient, matrixClient);
          }

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}))); // Handle olm library process unhandeled rejections


process.on('unhandledRejection', function (reason, promise) {
  console.log('Unhandled Rejection capture');
  console.log('Unhandled Rejection at:', reason.stack || reason);
});
process.on('uncaughtException', function (e) {
  console.log('Unhandled Exception capture');
  console.log('uncaughtException: ', e.stack);
});
console.log('server listening on:', port);