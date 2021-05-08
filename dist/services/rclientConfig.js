'use strict';

require('dotenv').config();
var _ = require('lodash');
var crypto = require('crypto');

var _require = require('../constants'),
    blockchainEnv = _require.blockchainEnv;

var EXPLORER_TESTNET = 'https://testnet.runebase.io';
var EXPLORER_MAINNET = 'https://explorer.runebase.io';

var Config = {
  HOSTNAME: '127.0.0.1',
  PORT: 8989,
  RPC_USER: process.env.RPC_USER,
  RPC_PORT_TESTNET: 9432,
  RPC_PORT_MAINNET: 9432,
  DEFAULT_LOGLVL: 'debug',
  CONTRACT_VERSION_NUM: 0,
  TRANSFER_MIN_CONFIRMATIONS: 1,
  DEFAULT_GAS_LIMIT: 250000,
  DEFAULT_GAS_PRICE: 0.0000004,
  UNLOCK_SECONDS: 604800
};
// const rpcPassword = getRandomPassword(); // Generate random password for every session
console.log('shut up');
console.log(process.env.RPC_PASS);
var rpcPassword = process.env.RPC_PASS;

var runebaseEnv = void 0;
var runebasePath = void 0;

function setRunebaseEnv(env, path) {
  if (_.isEmpty(env)) {
    throw Error('env cannot be empty.');
  }
  if (_.isEmpty(path)) {
    throw Error('path cannot be empty.');
  }
  if (runebaseEnv) {
    throw Error('runebaseEnv was already set.');
  }
  if (runebasePath) {
    throw Error('runebasePath was already set.');
  }

  runebaseEnv = env;
  runebasePath = path;
  console.log('Environment: ' + runebaseEnv);
  console.log('Runebase Path: ' + runebasePath);
}

function getRunebaseEnv() {
  return runebaseEnv;
}

function getRunebasePath() {
  return runebasePath;
}

function isMainnet() {
  // Throw an error to ensure no code is using this check before it is initialized
  if (!runebaseEnv) {
    throw Error('runebaseEnv not initialized yet before checking env');
  }

  return runebaseEnv === blockchainEnv.MAINNET;
}

function getRPCPassword() {
  var password = rpcPassword;
  _.each(process.argv, function (arg) {
    if (_.includes(arg, '-rpcpassword')) {
      password = _.split(arg, '=', 2)[1];
    }
  });

  return password;
}

function getRunebaseRPCAddress() {
  var port = isMainnet() ? Config.RPC_PORT_MAINNET : Config.RPC_PORT_TESTNET;
  return 'http://' + Config.RPC_USER + ':' + getRPCPassword() + '@localhost:' + port;
}

function getRunebaseExplorerUrl() {
  return isMainnet() ? EXPLORER_MAINNET : EXPLORER_TESTNET;
}

function getRandomPassword() {
  return crypto.randomBytes(5).toString('hex');
}

module.exports = {
  Config: Config,
  setRunebaseEnv: setRunebaseEnv,
  getRunebaseEnv: getRunebaseEnv,
  getRunebasePath: getRunebasePath,
  isMainnet: isMainnet,
  getRPCPassword: getRPCPassword,
  getRunebaseRPCAddress: getRunebaseRPCAddress,
  getRunebaseExplorerUrl: getRunebaseExplorerUrl
};