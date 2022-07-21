"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = require("dotenv");

var _runebaseSettings = _interopRequireDefault(require("./runebaseSettings"));

var _pirateSettings = _interopRequireDefault(require("./pirateSettings"));

var _dustSettings = _interopRequireDefault(require("./dustSettings"));

var _tokelSettings = _interopRequireDefault(require("./tokelSettings"));

(0, _dotenv.config)();

var getCoinSettings = function getCoinSettings() {
  if (process.env.CONFIG_FILE === 'RUNEBASE') {
    return _runebaseSettings["default"];
  }

  if (process.env.CONFIG_FILE === 'PIRATE') {
    return _pirateSettings["default"];
  }

  if (process.env.CONFIG_FILE === 'DUST') {
    return _dustSettings["default"];
  }

  if (process.env.CONFIG_FILE === 'TOKEL') {
    return _tokelSettings["default"];
  }
};

var _default = getCoinSettings;
exports["default"] = _default;