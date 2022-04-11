"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstance = createInstance;
exports.getInstance = getInstance;

var _dotenv = require("dotenv");

var _runebase = _interopRequireDefault(require("./rpc/runebase"));

var _pirate = _interopRequireDefault(require("./rpc/pirate"));

var _komodo = _interopRequireDefault(require("./rpc/komodo"));

var _settings = _interopRequireDefault(require("../config/settings"));

var settings = (0, _settings["default"])();
(0, _dotenv.config)();
var instance;

function createInstance() {
  if (settings.coin.setting === 'Runebase') {
    return new _runebase["default"]("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
  }

  if (settings.coin.setting === 'Pirate') {
    return new _pirate["default"]("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
  }

  if (settings.coin.setting === 'Komodo') {
    return new _komodo["default"]("http://".concat(process.env.RPC_USER, ":").concat(process.env.RPC_PASS, "@localhost:").concat(process.env.RPC_PORT));
  }
}

function getInstance() {
  if (!instance) {
    instance = createInstance();
  }

  return instance;
}