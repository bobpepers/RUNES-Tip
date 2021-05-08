'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _updatePrice = require('./helpers/updatePrice');

var _updatePrice2 = _interopRequireDefault(_updatePrice);

var _drawJackpot = require('./controllers/drawJackpot');

var _drawJackpot2 = _interopRequireDefault(_drawJackpot);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _logger = require('./helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _patcher = require('./helpers/patcher');

var _ticketPatcher = require('./helpers/ticketPatcher');

var _archiveActivity = require('./helpers/archiveActivity');

var _archiveActivity2 = _interopRequireDefault(_archiveActivity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/first */
require('dotenv').config();
// import { decodeToken } from './helpers/token';

// import db from './services/database';


_logger2.default.info('logger loader');
var schedule = require('node-schedule');

var _require = require('./services/sync'),
    startSync = _require.startSync;

var _require2 = require('./services/rclientConfig'),
    Config = _require2.Config,
    setRunebaseEnv = _require2.setRunebaseEnv,
    getRunebasePath = _require2.getRunebasePath,
    isMainnet = _require2.isMainnet,
    getRPCPassword = _require2.getRPCPassword;

var session = require('express-session');

var csrf = require('csurf');

var redisScan = require('node-redis-scan');
var cookieParser = require('cookie-parser');

var redis = require('redis');
var socketIo = require("socket.io");

var port = process.env.PORT || 8080;
var CONF = { db: 3 };

var app = (0, _express2.default)();
setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

var server = _http2.default.createServer(app);
var io = socketIo(server, { cookie: false });

// .: Activate "notify-keyspace-events" for expired type events
var pub = redis.createClient(CONF);
var sub = redis.createClient(CONF);
var scanner = new redisScan(pub);
var expired_subKey = '__keyevent@' + CONF.db + '__:expired';
var subKey = '__keyevent@' + CONF.db + '__:set';

var volumeInfo = {
  surf: 0,
  surf24: 0,
  surfVolume24: 0,
  click: 0,
  click24: 0,
  clickVolume24: 0,
  jackpot: 0
};

function SubscribeExpired(e, r) {
  _models2.default.stats.findOne({}).then(function (exist) {
    if (exist) {
      pub.set('jackpot:', Number(exist.jackpot));
      pub.set('surfVolume:', Number(exist.surf));
      scanner.scan('jackpot:*', function (err, keys) {
        if (err) throw err;
        pub.get('jackpot:', function (e, o) {
          if (e) {
            console.log(e);
          } else {
            volumeInfo.jackpot = Number(o);
            io.sockets.emit("Volume", volumeInfo);
          }
        });
      });
      scanner.scan('surfVolume:*', function (err, keys) {
        if (err) throw err;
        pub.get('surfVolume:', function (e, o) {
          if (e) {
            console.log(e);
          } else {
            volumeInfo.surf = Number(o);
            io.sockets.emit("Volume", volumeInfo);
          }
        });
      });
    } else {
      _models2.default.stats.create({}).then(function (exist) {
        pub.set('jackpot:', Number(exist.jackpot));
        pub.set('surfVolume:', Number(exist.surf));
        scanner.scan('jackpot:*', function (err, keys) {
          if (err) throw err;
          pub.get('jackpot:', function (e, o) {
            if (e) {
              console.log(e);
            } else {
              volumeInfo.jackpot = Number(o);
              io.sockets.emit("Volume", volumeInfo);
            }
          });
        });
        scanner.scan('surfVolume:*', function (err, keys) {
          if (err) throw err;
          pub.get('surfVolume:', function (e, o) {
            if (e) {
              console.log(e);
            } else {
              volumeInfo.surf = Number(o);
              io.sockets.emit("Volume", volumeInfo);
            }
          });
        });
      });
    }
  }).catch(function (error) {
    console.log(error);
  });
  sub.subscribe(expired_subKey, function () {
    console.log('subscribed expired_subKey');
    // TestKey();
  });
  sub.subscribe(subKey, function () {
    console.log('subscribed subKey');
  });
}

/*
REDIS KEYSPACE NOTIFICATIONS
pub.send_command('config', ['set', 'notify-keyspace-events', 'ExKAE'], SubscribeExpired);
--> ExKAE
-----------------------------
K     Keyspace events, published with __keyspace@<db>__ prefix.
E     Keyevent events, published with __keyevent@<db>__ prefix.
g     Generic commands (non-type specific) like DEL, EXPIRE, RENAME, ...
$     String commands
l     List commands
s     Set commands
h     Hash commands
z     Sorted set commands
x     Expired events (events generated every time a key expires)
e     Evicted events (events generated when a key is evicted for maxmemory)
A     Alias for g$lshzxe, so that the "AKE" string means all the events.
 */
pub.send_command('config', ['set', 'notify-keyspace-events', 'ExKAE'], SubscribeExpired);

// .: Subscribe to the "notify-keyspace-events" channel used for insert and expired type events

var updateSurf = function updateSurf(log_list) {
  var dataset = [];
  var keys = Object.keys(log_list);
  var i = 0;
  if (log_list.length === 0) {
    volumeInfo.surfVolume24 = 0;
    volumeInfo.surf24 = 0;
  }
  keys.forEach(function (l) {
    pub.get(log_list[l], function (e, o) {
      i++;
      if (e) {
        console.log(e);
      } else {
        var temp_data = { key: log_list[l], value: o };
        dataset.push(temp_data);
      }
      if (i == keys.length) {
        volumeInfo.surfVolume24 = dataset.reduce(function (a, _ref) {
          var value = _ref.value;
          return a + Number(value);
        }, 0);
        volumeInfo.surf24 = dataset.length;
        console.log(volumeInfo);
      }
    });
  });
};

sub.on('message', function (chan, msg) {
  scanner.scan('surf:*', function (err, keys) {
    if (err) throw err;
    updateSurf(keys);
  });
  scanner.scan('surfVolume:*', function (err, keys) {
    if (err) throw err;
    pub.get('surfVolume:', function (e, o) {
      if (e) {
        console.log(e);
      } else {
        volumeInfo.surf = Number(o);
        console.log(volumeInfo);
        console.log('surfVolume scanner');
        io.sockets.emit("Volume", volumeInfo);
      }
    });
  });
  scanner.scan('jackpot:*', function (err, keys) {
    if (err) throw err;
    pub.get('jackpot:', function (e, o) {
      if (e) {
        console.log(e);
      } else {
        volumeInfo.jackpot = Number(o);
        console.log(volumeInfo);
        console.log('jackpot scanner');
        io.sockets.emit("Volume", volumeInfo);
      }
    });
  });
});

scanner.scan('surf:*', function (err, keys) {
  if (err) throw err;
  updateSurf(keys);
});

// .: For example (create a key & set to expire in 10 seconds)

app.use((0, _compression2.default)());
app.use((0, _morgan2.default)('combined'));
app.use((0, _cors2.default)());
var RedisStore = require('connect-redis')(session);

var sessionStore = new RedisStore({ client: pub });

app.set('trust proxy', 1);

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
app.use(_bodyParser2.default.urlencoded({
  extended: false
}));
app.use(_bodyParser2.default.json());

app.use(sessionMiddleware);
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

// XSRF -- Better handling?
/**
app.use(csrf({
  cookie: {
    httpOnly: false,
    sameSite: true,
    maxAge: 3600,
    secure: false,
  },
}));

app.use((req, res, next) => {
  const token = req.csrfToken();
  console.log(token);
  console.log('token');
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    sameSite: true,
    maxAge: 3600,
    secure: false,
  });
  res.locals.csrfToken = token;

  next();
});
 */

var wrap = function wrap(middleware) {
  return function (socket, next) {
    return middleware(socket.request, {}, next);
  };
};

io.use(wrap(sessionMiddleware));
io.use(wrap(_passport2.default.initialize()));
io.use(wrap(_passport2.default.session()));

// io.use((socket, next) => {
//  console.log(socket.request.user);
//  if (socket.request.user) {
//    next();
//  } else {
//    next(new Error('unauthorized'));
//  }
// });

var interval = void 0;
var onlineUsers = {};

io.on("connection", async function (socket) {
  var userId = socket.request.session.passport ? socket.request.session.passport.user : '';
  console.log('your user id');
  console.log(userId);
  if (userId !== '') {
    onlineUsers[userId] = socket;
    // onlineUsers.reduce((a, b) => { if (a.indexOf(b) < 0)a.push(b); return a; }, []);
  }
  io.emit('Online', Object.keys(onlineUsers).length);
  // onlineUsers[userId].emit('Private', { msg: "private message" });
  console.log(Object.keys(onlineUsers).length);
  socket.on("disconnect", function () {
    // onlineUsers = onlineUsers.filter((item) => item !== userId);
    delete onlineUsers[userId];
    io.emit("Online", Object.keys(onlineUsers).length);
    console.log(Object.keys(onlineUsers).length);
    console.log("Client disconnected");
  });
});

(0, _router2.default)(app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers);

// db.sequelize.sync().then(() => {
server.listen(port);
// setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);
startSync(io, onlineUsers);
// patchDeposits();
// }).catch((err) => {
//  console.log(err);
// });

// setInterval(patchDeposits, 60 * 60 * 1000);

(0, _ticketPatcher.removeStaleTickets)(onlineUsers);
// Run every hour at 15 minute mark
var schedulePatchTickets = schedule.scheduleJob('*/1 * * * *', function () {
  (0, _ticketPatcher.removeStaleTickets)(onlineUsers);
});

(0, _patcher.patchDeposits)();
// Run every hour at 10 minute mark
var schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', function () {
  (0, _patcher.patchDeposits)();
});

(0, _updatePrice2.default)(io);
// Update Price every 5 minutes
var schedulePriceUpdate = schedule.scheduleJob('*/5 * * * *', function () {
  (0, _updatePrice2.default)(io);
});

(0, _drawJackpot2.default)(sub, pub, expired_subKey);
// Run every 2 hours at 5 minute mark
_models2.default.cronjob.findOne({
  where: {
    type: 'drawJackpot',
    state: 'executing'
  }
}).then(function (exist) {
  var scheduleJackpotDrawPatcher = schedule.scheduleJob(new Date(exist.expression), function (fireDate) {
    console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
    (0, _drawJackpot2.default)(sub, pub, expired_subKey);
  });
}).catch(function (error) {
  console.log(error);
});
var scheduleJackpotDrawPatcher = schedule.scheduleJob('5 */2 * * *', function () {
  (0, _drawJackpot2.default)(sub, pub, expired_subKey);
});
// setInterval(drawJackpot, 5 * 60 * 1000);

// Archive activity daily older then 3 days
(0, _archiveActivity2.default)();
setInterval(_archiveActivity2.default, 24 * 60 * 60 * 1000);

// archive activity every 5 minutes
var scheduleArchiveActivity = schedule.scheduleJob('*/5 * * * *', function () {
  (0, _archiveActivity2.default)();
});

console.log('server listening on:', port);