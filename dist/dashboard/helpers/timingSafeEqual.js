"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generate = require("./generate");

var crypto = require('crypto');

var timingSafeEqual = function timingSafeEqual(a, b) {
  var valid = false;
  valid = crypto.timingSafeEqual(Buffer.from((0, _generate.generateHash)(a)), Buffer.from((0, _generate.generateHash)(b)));
  return valid;
};

var _default = timingSafeEqual;
exports["default"] = _default;