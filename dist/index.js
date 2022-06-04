"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _telegraf = require("telegraf");

var _telegram = require("telegram");

var _sessions = require("telegram/sessions");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _compression = _interopRequireDefault(require("compression"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _helmet = _interopRequireDefault(require("helmet"));

var _dotenv = require("dotenv");

var _passport = _interopRequireDefault(require("passport"));

var _olm = _interopRequireDefault(require("@matrix-org/olm"));

var _matrixJsSdk = _interopRequireDefault(require("matrix-js-sdk"));

var _nodeLocalstorage = require("node-localstorage");

var _connectRedis = _interopRequireDefault(require("connect-redis"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _redis = require("redis");

var _socket = _interopRequireDefault(require("socket.io"));

var _localStorageCryptoStore = require("matrix-js-sdk/lib/crypto/store/localStorage-crypto-store");

var _csurf = _interopRequireDefault(require("csurf"));

var _router = require("./router");

var _router2 = require("./dashboard/router");

var _updatePrice = require("./helpers/price/updatePrice");

var _updateConversionRates = require("./helpers/price/updateConversionRates");

var _initDatabaseRecords = require("./helpers/initDatabaseRecords");

var _models = _interopRequireDefault(require("./models"));

var _settings = _interopRequireDefault(require("./config/settings"));

var _syncKomodo = require("./services/syncKomodo");

var _syncRunebase = require("./services/syncRunebase");

var _syncPirate = require("./services/syncPirate");

var _patcher = require("./helpers/blockchain/runebase/patcher");

var _patcher2 = require("./helpers/blockchain/pirate/patcher");

var _patcher3 = require("./helpers/blockchain/komodo/patcher");

var _processWithdrawals = require("./services/processWithdrawals");

var _recover = require("./helpers/recover");

var _logger = _interopRequireDefault(require("./helpers/logger"));

/* eslint-disable import/first */
global.Olm = _olm["default"];
Object.freeze(Object.prototype);
(0, _dotenv.config)();

var checkCSRFRoute = function checkCSRFRoute(req) {
  var hostmachine = req.headers.host.split(':')[0];

  if (req.url === '/api/chaininfo/block' && (hostmachine === 'localhost' || hostmachine === '127.0.0.1') || req.url === '/api/rpc/walletnotify' && (hostmachine === 'localhost' || hostmachine === '127.0.0.1')) {
    return true;
  }

  return false;
};

var conditionalCSRF = function conditionalCSRF(req, res, next) {
  var shouldPass = checkCSRFRoute(req);

  if (shouldPass) {
    return next();
  }

  return (0, _csurf["default"])({
    cookie: {
      secure: true,
      maxAge: 3600
    }
  })(req, res, next);
};

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
  var localStorage, settings, queue, port, app, server, io, RedisStore, redisClient, sessionMiddleware, wrap, sockets, discordClient, telegramClient, storeSession, telegramApiClient, matrixClient, matrixLoginCredentials, schedulePatchDeposits, _schedulePatchDeposits, _schedulePatchDeposits2, _schedulePatchDeposits3, scheduleUpdateConversionRatesFiat, scheduleUpdateConversionRatesCrypto, schedulePriceUpdate, scheduleWithdrawal;

  return _regenerator["default"].wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
          settings = (0, _settings["default"])();
          queue = new _pQueue["default"]({
            concurrency: 1,
            timeout: 1000000000
          });
          port = process.env.PORT || 8080;
          app = (0, _express["default"])();
          server = _http["default"].createServer(app);
          io = (0, _socket["default"])(server, {
            path: '/socket.io',
            cookie: false
          });
          app.use((0, _helmet["default"])());
          app.use((0, _compression["default"])());
          app.use((0, _morgan["default"])('combined'));
          app.use((0, _cors["default"])());
          app.set('trust proxy', 1);
          RedisStore = (0, _connectRedis["default"])(_expressSession["default"]);
          redisClient = (0, _redis.createClient)({
            database: 3,
            legacyMode: true
          });
          _context3.next = 16;
          return redisClient.connect();

        case 16:
          sessionMiddleware = (0, _expressSession["default"])({
            secret: process.env.SESSION_SECRET,
            key: "connect.sid",
            resave: false,
            proxy: true,
            saveUninitialized: false,
            ephemeral: false,
            store: new RedisStore({
              client: redisClient
            }),
            cookie: {
              httpOnly: true,
              secure: true,
              sameSite: 'strict'
            }
          });
          app.use((0, _cookieParser["default"])());
          app.use(_bodyParser["default"].urlencoded({
            extended: false,
            limit: '5mb'
          }));
          app.use(_bodyParser["default"].json());
          app.use(conditionalCSRF);
          app.use(function (req, res, next) {
            var shouldPass = checkCSRFRoute(req);

            if (shouldPass) {
              return next();
            }

            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
          });
          app.use(sessionMiddleware);
          app.use(_passport["default"].initialize());
          app.use(_passport["default"].session());

          wrap = function wrap(middleware) {
            return function (socket, next) {
              return middleware(socket.request, {}, next);
            };
          };

          io.use(wrap(sessionMiddleware));
          io.use(wrap(_passport["default"].initialize()));
          io.use(wrap(_passport["default"].session()));
          sockets = {};
          io.on("connection", /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket) {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      // const userId = socket.request.session.passport ? socket.request.session.passport.user : '';
                      if (socket.request.user && (socket.request.user.role === 4 || socket.request.user.role === 8)) {
                        socket.join('admin'); // sockets[parseInt(userId, 10)] = socket;
                      } // console.log(Object.keys(sockets).length);


                      socket.on("disconnect", function () {// delete sockets[parseInt(userId, 10)];
                      });

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }()); // Discord

          discordClient = new _discord.Client({
            intents: [_discord.Intents.FLAGS.GUILDS, _discord.Intents.FLAGS.GUILD_MEMBERS, _discord.Intents.FLAGS.GUILD_PRESENCES, _discord.Intents.FLAGS.GUILD_MESSAGES, _discord.Intents.FLAGS.DIRECT_MESSAGES, _discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, _discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, _discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, _discord.Intents.FLAGS.GUILD_VOICE_STATES],
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'] // makeCache: Options.cacheWithLimits({
            //  GuildEmoji: 5000, // This is default
            // }),

          });
          _context3.next = 34;
          return discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

        case 34:
          // telegraf client
          telegramClient = new _telegraf.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
          _context3.next = 37;
          return telegramClient.launch();

        case 37:
          // gram.js
          storeSession = new _sessions.StoreSession("telegram_session");
          telegramApiClient = new _telegram.TelegramClient(storeSession, Number(process.env.TELEGRAM_API_ID), process.env.TELEGRAM_API_HASH, {
            connectionRetries: 5
          });
          _context3.next = 41;
          return telegramApiClient.start({
            botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
            onError: function onError(err) {
              return console.log(err);
            }
          });

        case 41:
          _context3.next = 43;
          return telegramApiClient.session.save();

        case 43:
          _context3.next = 45;
          return telegramApiClient.connect();

        case 45:
          // matrix
          matrixClient = _matrixJsSdk["default"].createClient({
            baseUrl: "https://matrix.org"
          });
          _context3.prev = 46;
          _context3.next = 49;
          return matrixClient.login("m.login.password", {
            user: process.env.MATRIX_USER,
            password: process.env.MATRIX_PASS
          });

        case 49:
          matrixLoginCredentials = _context3.sent;
          matrixClient = _matrixJsSdk["default"].createClient({
            baseUrl: "https://matrix.org",
            accessToken: matrixLoginCredentials.access_token,
            sessionStore: new _matrixJsSdk["default"].WebStorageSessionStore(localStorage),
            cryptoStore: new _localStorageCryptoStore.LocalStorageCryptoStore(localStorage),
            userId: matrixLoginCredentials.user_id,
            deviceId: matrixLoginCredentials.device_id,
            timelineSupport: true
          });
          _context3.next = 56;
          break;

        case 53:
          _context3.prev = 53;
          _context3.t0 = _context3["catch"](46);
          console.log(_context3.t0);

        case 56:
          _context3.next = 58;
          return (0, _initDatabaseRecords.initDatabaseRecords)(discordClient, telegramClient, matrixClient);

        case 58:
          if (!(settings.coin.setting === 'Runebase')) {
            _context3.next = 66;
            break;
          }

          _context3.next = 61;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);

        case 61:
          _context3.next = 63;
          return (0, _patcher.patchRunebaseDeposits)();

        case 63:
          schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });
          _context3.next = 87;
          break;

        case 66:
          if (!(settings.coin.setting === 'Pirate')) {
            _context3.next = 74;
            break;
          }

          _context3.next = 69;
          return (0, _syncPirate.startPirateSync)(discordClient, telegramClient, matrixClient, queue);

        case 69:
          _context3.next = 71;
          return (0, _patcher2.patchPirateDeposits)();

        case 71:
          _schedulePatchDeposits = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher2.patchPirateDeposits)();
          });
          _context3.next = 87;
          break;

        case 74:
          if (!(settings.coin.setting === 'Komodo')) {
            _context3.next = 82;
            break;
          }

          _context3.next = 77;
          return (0, _syncKomodo.startKomodoSync)(discordClient, telegramClient, matrixClient, queue);

        case 77:
          _context3.next = 79;
          return (0, _patcher3.patchKomodoDeposits)();

        case 79:
          _schedulePatchDeposits2 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher3.patchKomodoDeposits)();
          });
          _context3.next = 87;
          break;

        case 82:
          _context3.next = 84;
          return (0, _syncRunebase.startRunebaseSync)(discordClient, telegramClient, matrixClient, queue);

        case 84:
          _context3.next = 86;
          return (0, _patcher.patchRunebaseDeposits)();

        case 86:
          _schedulePatchDeposits3 = _nodeSchedule["default"].scheduleJob('10 */1 * * *', function () {
            (0, _patcher.patchRunebaseDeposits)();
          });

        case 87:
          (0, _router.router)(app, discordClient, telegramClient, telegramApiClient, matrixClient, io, settings, queue);
          (0, _router2.dashboardRouter)(app, io, discordClient, telegramClient, telegramApiClient, matrixClient);
          _context3.next = 91;
          return (0, _recover.recoverDiscordReactdrops)(discordClient, io, queue);

        case 91:
          _context3.next = 93;
          return (0, _recover.recoverDiscordTrivia)(discordClient, io, queue);

        case 93:
          _context3.next = 95;
          return (0, _recover.recoverMatrixReactdrops)(matrixClient, io, queue);

        case 95:
          scheduleUpdateConversionRatesFiat = _nodeSchedule["default"].scheduleJob('0 */8 * * *', function () {
            // Update Fiat conversion rates every 8 hours
            (0, _updateConversionRates.updateConversionRatesFiat)();
          });
          (0, _updateConversionRates.updateConversionRatesCrypto)();
          scheduleUpdateConversionRatesCrypto = _nodeSchedule["default"].scheduleJob('*/10 * * * *', function () {
            // Update price every 10 minutes
            (0, _updateConversionRates.updateConversionRatesCrypto)();
          });
          (0, _updatePrice.updatePrice)();
          schedulePriceUpdate = _nodeSchedule["default"].scheduleJob('*/5 * * * *', function () {
            // Update price every 5 minutes
            (0, _updatePrice.updatePrice)();
          });
          scheduleWithdrawal = _nodeSchedule["default"].scheduleJob('*/8 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
            var autoWithdrawalSetting;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return _models["default"].features.findOne({
                      where: {
                        name: 'autoWithdrawal'
                      }
                    });

                  case 2:
                    autoWithdrawalSetting = _context2.sent;

                    if (autoWithdrawalSetting.enabled) {
                      (0, _processWithdrawals.processWithdrawals)(telegramClient, discordClient, matrixClient);
                    }

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          })));
          app.use(function (err, req, res, next) {
            if (err.message && err.message === "EMAIL_NOT_VERIFIED") {
              res.status(401).json({
                error: err.message,
                email: err.email
              });
            } else if (err.message && err === 'LOGIN_FAIL' || err.message && err === 'AUTH_TOKEN_USED' || err.message && err === 'EMAIL_ONLY_ALLOW_LOWER_CASE_INPUT') {
              res.status(401).json({
                error: err.message
              });
            } else {
              res.status(500).json({
                error: err.message
              });
            }
          });
          server.listen(port);
          console.log('server listening on:', port);

        case 104:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, null, [[46, 53]]);
}))();
process.on('unhandledRejection', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err, p) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _logger["default"].error("Error Application Unhandled Rejection: ".concat(err));

            console.log(err, '\nUnhandled Rejection at Promise\n', p, '\n--------------------------------');
            console.log(err.stack);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}());
process.on('uncaughtException', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err, p) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _logger["default"].error("Error Application Uncaught Exception: ".concat(err));

            console.log(err, '\nUnhandled Exception at Promise\n', p, '\n--------------------------------');
            console.log(err.stack);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}());