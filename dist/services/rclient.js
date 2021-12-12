"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstance = createInstance;
exports.getInstance = getInstance;

var _rweb = require("rweb3");

var _arrrweb = require("arrrweb3");

var _dotenv = require("dotenv");

var _settings = _interopRequireDefault(require("../config/settings"));

(0, _dotenv.config)();
var instance;

function createInstance() {
  if (_settings["default"].coin.setting === 'Runebase') {
    return new _rweb.Rweb3("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
  }

  if (_settings["default"].coin.setting === 'Pirate') {
    return new _arrrweb.ARRRweb3("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
  }
}

function getInstance() {
  if (!instance) {
    instance = createInstance();
  }

  return instance;
}