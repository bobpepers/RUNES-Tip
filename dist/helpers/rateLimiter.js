'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var redis = require('redis');

var redisClient = redis.createClient({
  db: 3,
  enable_offline_queue: false
});
// const redisClient = new Redis({ enableOfflineQueue: false });

var _require = require('rate-limiter-flexible'),
    RateLimiterRedis = _require.RateLimiterRedis,
    RateLimiterMemory = _require.RateLimiterMemory;

redisClient.on('error', function (err) {});

var rateLimiterIp = new RateLimiterRedis({
  points: 1,
  duration: 60, // per 60 seconds
  storeClient: redisClient,
  keyPrefix: 'ip',
  execEvenly: false,
  blockDuration: 60,
  inmemoryBlockDuration: 60,
  blockOnPointsConsumed: 1,
  inmemoryBlockOnConsumed: 1,
  insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
  {
    points: 1, // 1 is fair if you have 5 workers and 1 cluster
    duration: 60,
    execEvenly: false
  })
});

var rateLimiterUser = new RateLimiterRedis({
  points: 1,
  duration: 60, // per 60 seconds
  storeClient: redisClient,
  keyPrefix: 'user',
  execEvenly: false,
  blockDuration: 60,
  inmemoryBlockDuration: 60,
  blockOnPointsConsumed: 1,
  inmemoryBlockOnConsumed: 1,
  insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
  {
    points: 1, // 1 is fair if you have 5 workers and 1 cluster
    duration: 600,
    execEvenly: false
  })
});

var rateLimiterFaucet = new RateLimiterRedis({
  points: 1,
  duration: 600, // per 600 seconds
  storeClient: redisClient,
  keyPrefix: 'faucet',
  blockDuration: 600,
  inmemoryBlockDuration: 600,
  execEvenly: false,
  blockOnPointsConsumed: 1,
  inmemoryBlockOnConsumed: 1,
  insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
  {
    points: 1, // 1 is fair if you have 5 workers and 1 cluster
    duration: 600,
    execEvenly: false
  })
});

var rateLimiterMiddlewareFaucet = exports.rateLimiterMiddlewareFaucet = function rateLimiterMiddlewareFaucet(req, res, next) {
  // Requires ./helpers/storeIp.js to be run in middleware before executing this function
  // Consume 1 point for each action

  rateLimiterFaucet.consume(res.locals.ip, 1) // or req.ip
  .then(function (result) {
    // rateLimiterFaucet.penalty(res.locals.ip, 1);
    next();
  }).catch(function (rejRes) {
    console.log(rejRes);
    console.log('too many requests from ip');
    res.status(429).send('Too Many Requests');
  });
};

var rateLimiterMiddlewareUser = exports.rateLimiterMiddlewareUser = function rateLimiterMiddlewareUser(req, res, next) {
  // Consume 1 point for each action
  rateLimiterUser.consume(req.user.id, 1) // or req.ip
  .then(function () {
    // rateLimiterUser.penalty(res.locals.ip, 1);
    next();
  }).catch(function (rejRes) {
    console.log('too many requests from user');
    res.status(429).send('Too Many Requests');
  });
};

var rateLimiterMiddlewareIp = exports.rateLimiterMiddlewareIp = function rateLimiterMiddlewareIp(req, res, next) {
  // Requires ./helpers/storeIp.js to be run in middleware before executing this function
  // Consume 1 point for each action
  rateLimiterIp.consume(res.locals.ip, 1) // or req.ip
  .then(function () {
    // rateLimiterIp.penalty(res.locals.ip, 1);
    next();
  }).catch(function (rejRes) {
    console.log('too many requests from ip');
    res.status(429).send('Too Many Requests');
  });
};