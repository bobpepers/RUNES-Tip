"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasUpperCase = void 0;

// export const hasUpperCase = (str) => (/[A-Z]/.test(str));
var hasUpperCase = function hasUpperCase(str) {
  return str.toLowerCase() !== str;
};

exports.hasUpperCase = hasUpperCase;