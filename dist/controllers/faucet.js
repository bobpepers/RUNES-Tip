'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimFaucet = exports.generateHash = exports.fetchFaucetRolls = exports.fetchFaucetRecord = undefined;

var _rweb = require('rweb3');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _rclient = require('../services/rclient');

var _generateRandomString = require('../helpers/generateRandomString');

var _generateRandomString2 = _interopRequireDefault(_generateRandomString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');
// Name of the file : sha512-hash.js
// Loading the crypto module in node.js

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Fetch Wallet
 */


var fetchFaucetRecord = exports.fetchFaucetRecord = async function fetchFaucetRecord(req, res, next) {
  console.log('Fetch fetchFaucetRecord here');
  try {
    var faucetRecord = await _models2.default.faucet.findOne({
      where: {
        userId: req.user.id
      }
    });
    if (!faucetRecord) {
      console.log('not found record');
      res.locals.faucetRecord = await _models2.default.faucet.create({
        userId: req.user.id
      });
    }
    if (faucetRecord) {
      console.log('found record');
      res.locals.faucetRecord = faucetRecord;
    }
    next();
  } catch (error) {
    console.log(error);
    console.log('error');
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch Wallet
 */
var fetchFaucetRolls = exports.fetchFaucetRolls = async function fetchFaucetRolls(req, res, next) {
  console.log('Fetch fetchFaucetRecord here');
  try {
    res.locals.faucetRolls = await _models2.default.faucetRolls.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: _models2.default.faucet,
        as: 'faucet',
        where: {
          userId: req.user.id
        }
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    console.log('error');
    res.locals.error = error;
    next();
  }
};

var roll = function roll(serverSeed, clientSeed, nonce) {
  var keyString = clientSeed + '-' + nonce;
  var hash = crypto.createHash('sha512');
  var data = hash.update(serverSeed + keyString, 'utf-8');
  var genHash = data.digest('hex');
  console.log('hash : ' + genHash);
  var random = parseInt(genHash.substring(0, 5), 16) / 1048576;
  console.log(data);
  console.log(random);
  var max = 10001;
  return Math.floor(random * max);
};

/**
 * Fetch Wallet
 */
var generateHash = exports.generateHash = function generateHash(a) {
  return crypto.createHmac('sha256', 'SuperSexySecret').update(a).digest('hex');
};
var claimFaucet = exports.claimFaucet = async function claimFaucet(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var serverseed = (0, _generateRandomString2.default)(24);
    var clientseed = (0, _generateRandomString2.default)(24);
    var nonce = '' + new Date().valueOf() + Math.floor(Math.random() * 11);
    var salt = 'salty';
    var faucetRecord = await _models2.default.faucet.findOne({
      where: {
        userId: req.user.id
      },
      attributes: ['id', 'earned', 'updatedAt'],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (faucetRecord.updatedAt > new Date(Date.now() - 10 * 60 * 1000)) {
      throw new Error('FAUCET_CLAIM_TOO_FAST');
    }

    var wallet = await _models2.default.wallet.findOne({
      where: {
        userId: req.user.id
      },
      attributes: ['id', 'available', 'locked', 'earned', 'spend'],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var rolled = roll(serverseed, clientseed, nonce);
    var won = void 0;
    if (rolled === 10000) {
      won = 50 * 1e8;
    } else if (rolled < 10000 && rolled >= 9998) {
      won = 15 * 1e8;
    } else if (rolled < 9998 && rolled >= 9994) {
      won = 5 * 1e8;
    } else if (rolled < 9994 && rolled >= 9986) {
      won = 2 * 1e8;
    } else if (rolled < 9986 && rolled >= 9886) {
      won = 0.5 * 1e8;
    } else if (rolled < 9886 && rolled >= 0) {
      won = 0.15 * 1e8;
    } else {
      won = 0;
    }
    // const won2 = (
    //  rolled === 10000 ? 50 * 1e8
    //    : rolled < 10000 && rolled >= 9998 ? 15 * 1e8
    //      : rolled < 9998 && rolled >= 9994 ? 5 * 1e8
    //        : rolled < 9994 && rolled >= 9986 ? 2 * 1e8
    //          : null);

    res.locals.faucetRecord = await faucetRecord.update({
      earned: faucetRecord.earned + won
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    console.log(wallet);

    res.locals.wallet = await wallet.update({
      available: wallet.available + won,
      earned: wallet.earned + won
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.faucetRoll = await _models2.default.faucetRolls.create({
      rolled: rolled,
      serverseed: serverseed,
      clientseed: clientseed,
      nonce: nonce,
      faucetId: faucetRecord.id,
      claimAmount: won
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var createActivity = await _models2.default.activity.create({
      type: 'faucetClaim',
      amount: won,
      earnerId: req.user.id,
      earner_balance: res.locals.wallet.locked + res.locals.wallet.available,
      faucetRollId: res.locals.faucetRoll.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: createActivity.id
      },
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.jackpot_tickets = await _models2.default.user.increment({
      jackpot_tickets: 1
    }, {
      where: {
        id: req.user.id
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

// creating hash object

// Printing the output on the console