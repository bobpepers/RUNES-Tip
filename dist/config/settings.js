"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = require("dotenv");

var _runebaseSettings = _interopRequireDefault(require("./runebaseSettings"));

var _pirateSettings = _interopRequireDefault(require("./pirateSettings"));

(0, _dotenv.config)();

var getCoinSettings = function getCoinSettings() {
  if (process.env.CONFIG_FILE === 'RUNEBASE') {
    return _runebaseSettings["default"];
  }

  if (process.env.CONFIG_FILE === 'PIRATE') {
    return _pirateSettings["default"];
  }
};

var _default = getCoinSettings;
exports["default"] = _default;