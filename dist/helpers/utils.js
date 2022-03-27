"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = void 0;

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

exports.capitalize = capitalize;