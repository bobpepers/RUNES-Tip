/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import router from './router';
import updatePrice from './helpers/updatePrice';
import db from './models';
import logger from './helpers/logger';
import { patchDeposits } from './helpers/patcher';

import drawReferralContest from './helpers/referralContest';

logger.info('logger loader');
const schedule = require('node-schedule');
const { startSync } = require('./services/sync');
const {
  Config,
  setRunebaseEnv,
  getRunebasePath,
  isMainnet,
  getRPCPassword,
} = require('./services/rclientConfig');

const session = require('express-session');

const csrf = require('csurf');

const redisScan = require('node-redis-scan');
const cookieParser = require('cookie-parser');

const redis = require('redis');
const socketIo = require("socket.io");

const port = process.env.PORT || 8080;
const CONF = { db: 3 };

const app = express();
setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

const server = http.createServer(app);
const io = socketIo(server, { cookie: false });

// .: Activate "notify-keyspace-events" for expired type events
const pub = redis.createClient(CONF);
const sub = redis.createClient(CONF);
const scanner = new redisScan(pub);
const expired_subKey = `__keyevent@${CONF.db}__:expired`;
const subKey = `__keyevent@${CONF.db}__:set`;

const volumeInfo = {
  surf: 0,
  surf24: 0,
  surfVolume24: 0,
  click: 0,
  click24: 0,
  clickVolume24: 0,
  jackpot: 0,
  impression: 0,
  impression24: 0,
  impressionVolume24: 0,
  tradeVolume: 0,
  trade: 0,
  tradeVolume24: 0,
  trade24: 0,
};

function SubscribeExpired(e, r) {
  db.stats.findOne({}).then((exist) => {
    if (exist) {
      pub.set('jackpot:', Number(exist.jackpot));
      pub.set('surfVolume:', Number(exist.surf));
      pub.set('impressionVolume:', Number(exist.impression));
      scanner.scan('jackpot:*', (err, keys) => {
        if (err) throw (err);
        pub.get('jackpot:', (e, o) => {
          if (e) {
            console.log(e);
          } else if (o) {
            volumeInfo.jackpot = Number(o);
            io.sockets.emit("Volume", volumeInfo);
          }
        });
      });

      scanner.scan('impressionVolume:*', (err, keys) => {
        if (err) throw (err);
        pub.get('impressionVolume:', (e, o) => {
          if (e) {
            console.log(e);
          } else if (o) {
            volumeInfo.impression = Number(o);
            io.sockets.emit("Volume", volumeInfo);
          }
        });
      });

      // scanner.scan('surfVolume:*', (err, keys) => {
      //  if (err) throw (err);
      pub.get('surfVolume:', (e, o) => {
        if (e) {
          console.log(e);
        } else if (o) {
          console.log(o);
          volumeInfo.surf = Number(o);
          io.sockets.emit("Volume", volumeInfo);
        }
      });
      // });
    } else {
      db.stats.create({}).then((exist) => {
        pub.set('jackpot:', Number(exist.jackpot));
        pub.set('surfVolume:', Number(exist.surf));
        pub.set('impressionVolume:', Number(exist.impression));
        scanner.scan('jackpot:*', (err, keys) => {
          if (err) throw (err);
          pub.get('jackpot:', (e, o) => {
            if (e) {
              console.log(e);
            } else if (o) {
              volumeInfo.jackpot = Number(o);
              io.sockets.emit("Volume", volumeInfo);
            }
          });
        });
        scanner.scan('surfVolume:*', (err, keys) => {
          if (err) throw (err);
          pub.get('surfVolume:', (e, o) => {
            if (e) {
              console.log(e);
            } else if (o) {
              volumeInfo.surf = Number(o);
              io.sockets.emit("Volume", volumeInfo);
            }
          });
        });
        scanner.scan('impressionVolume:*', (err, keys) => {
          if (err) throw (err);
          pub.get('impressionVolume:', (e, o) => {
            if (e) {
              console.log(e);
            } else if (o) {
              volumeInfo.impression = Number(o);
              io.sockets.emit("Volume", volumeInfo);
            }
          });
        });
      });
    }
  }).catch((error) => {
    console.log(error);
  });
  sub.subscribe(expired_subKey, () => {
    console.log('subscribed expired_subKey');
    // TestKey();
  });
  sub.subscribe(subKey, () => {
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

const updateSurf = (log_list) => {
  const dataset = [];
  const keys = Object.keys(log_list);
  let i = 0;
  if (log_list.length === 0) {
    volumeInfo.surfVolume24 = 0;
    volumeInfo.surf24 = 0;
  }
  keys.forEach((l) => {
    pub.get(log_list[l], (e, o) => {
      i++;
      if (e) {
        console.log(e);
      } else {
        const temp_data = { key: log_list[l], value: o };
        dataset.push(temp_data);
      }
      if (i == keys.length) {
        volumeInfo.surfVolume24 = dataset.reduce((a, { value }) => a + Number(value), 0);
        volumeInfo.surf24 = dataset.length;
        console.log(volumeInfo);
        console.log('nomnomnom');
      }
    });
  });
};

const updateTrade = (log_list) => {
  const dataset = [];
  const keys = Object.keys(log_list);
  let i = 0;
  if (log_list.length === 0) {
    volumeInfo.tradeVolume24 = 0;
    volumeInfo.trade24 = 0;
  }
  keys.forEach((l) => {
    pub.get(log_list[l], (e, o) => {
      i++;
      if (e) {
        console.log(e);
      } else {
        const temp_data = { key: log_list[l], value: o };
        dataset.push(temp_data);
      }
      if (i == keys.length) {
        volumeInfo.tradeVolume24 = dataset.reduce((a, { value }) => a + Number(value), 0);
        volumeInfo.trade24 = dataset.length;
        console.log(volumeInfo);
        console.log('nomnomnom');
      }
    });
  });
};

const updateImpressions = (log_list) => {
  const dataset = [];
  const keys = Object.keys(log_list);
  let i = 0;
  if (log_list.length === 0) {
    volumeInfo.impressionVolume24 = 0;
    volumeInfo.impression24 = 0;
  }
  keys.forEach((l) => {
    pub.get(log_list[l], (e, o) => {
      i++;
      if (e) {
        console.log(e);
      } else {
        const temp_data = { key: log_list[l], value: o };
        dataset.push(temp_data);
      }
      if (i == keys.length) {
        volumeInfo.impressionVolume24 = dataset.reduce((a, { value }) => a + Number(value), 0);
        volumeInfo.impression24 = dataset.length;
        console.log(volumeInfo);
      }
    });
  });
};

sub.on('message', (chan, msg) => {
  scanner.scan('surf:*', (err, keys) => {
    if (err) throw (err);
    updateSurf(keys);
  });
  scanner.scan('impression:*', (err, keys) => {
    if (err) throw (err);
    updateImpressions(keys);
  });
  scanner.scan('trade:*', (err, keys) => {
    if (err) throw (err);
    updateTrade(keys);
  });
  // scanner.scan('surfVolume:*', (err, keys) => {
  //  if (err) throw (err);
  pub.get('surfVolume:', (e, o) => {
    if (e) {
      console.log(e);
    } else if (o) {
      volumeInfo.surf = Number(o);
      console.log(o);
      console.log(volumeInfo);
      console.log('surfVolume1 scanner');
      io.sockets.emit("Volume", volumeInfo);
    }
  });
  // });
  scanner.scan('impression:*', (err, keys) => {
    if (err) throw (err);
    pub.get('impressionVolume:', (e, o) => {
      if (e) {
        console.log(e);
      } else if (o) {
        volumeInfo.impression = Number(o);
        console.log(volumeInfo);
        console.log('surfVolume scanner');
        io.sockets.emit("Volume", volumeInfo);
      }
    });
  });
  scanner.scan('jackpot:*', (err, keys) => {
    if (err) throw (err);
    pub.get('jackpot:', (e, o) => {
      if (e) {
        console.log(e);
      } else if (o) {
        volumeInfo.jackpot = Number(o);
        console.log(volumeInfo);
        console.log('jackpot scanner');
        io.sockets.emit("Volume", volumeInfo);
      }
    });
  });
});

scanner.scan('surf:*', (err, keys) => {
  if (err) throw (err);
  updateSurf(keys);
});

scanner.scan('impression:*', (err, keys) => {
  if (err) throw (err);
  updateImpressions(keys);
});

scanner.scan('trade:*', (err, keys) => {
  if (err) throw (err);
  updateTrade(keys);
});


app.use(compression());
app.use(morgan('combined'));
app.use(cors());
const RedisStore = require('connect-redis')(session);

const sessionStore = new RedisStore({ client: pub });

app.set('trust proxy', 1);

const sessionMiddleware = session({
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
    sameSite: 'strict',
  },
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb',
}));
app.use(bodyParser.json());

app.use(sessionMiddleware);


const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));



let interval;
const onlineUsers = {};

router(app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers);

server.listen(port);
// setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);
startSync(io, onlineUsers);

patchDeposits();
const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
  patchDeposits();
});

updatePrice(io);
// Update Price every 5 minutes
const schedulePriceUpdate = schedule.scheduleJob('*/10 * * * *', () => {
  updatePrice(io);
});



drawReferralContest(sub, pub, expired_subKey);
// Run every 2 hours at 5 minute mark
db.cronjob.findOne({
  where: {
    type: 'drawJackpot',
    state: 'executing',
  },
}).then((exist) => {
  const scheduleReferralContestDrawPatcher = schedule.scheduleJob(new Date(exist.expression), (fireDate) => {
    console.log(`This job was supposed to run at ${fireDate}, but actually ran at ${new Date()}`);
    drawReferralContest(sub, pub, expired_subKey);
  });
}).catch((error) => {
  console.log(error);
});

const scheduleReferralContestDrawPatcher = schedule.scheduleJob('5 */2 * * *', () => {
  drawReferralContest(sub, pub, expired_subKey);
});


console.log('server listening on:', port);
