"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _generate = require("./generate");

var timingSafeEqual = function timingSafeEqual(a, b) {
  var valid = false;
  valid = _crypto["default"].timingSafeEqual(Buffer.from((0, _generate.generateHash)(a)), Buffer.from((0, _generate.generateHash)(b)));
  return valid;
};

var _default = timingSafeEqual;
exports["default"] = _default;