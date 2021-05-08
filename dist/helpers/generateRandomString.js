"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allCapsAlpha = [].concat(_toConsumableArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
var allLowerAlpha = [].concat(_toConsumableArray("abcdefghijklmnopqrstuvwxyz"));
// const allUniqueChars = [..."~!@#$%^&*()_+-=[]\{}|;:'\",./<>?"];
var allNumbers = [].concat(_toConsumableArray("0123456789"));
var base = [].concat(_toConsumableArray(allCapsAlpha), _toConsumableArray(allNumbers), _toConsumableArray(allLowerAlpha));

var generateRandomString = function generateRandomString(len) {
  return [].concat(_toConsumableArray(Array(len))).map(function (i) {
    return base[Math.random() * base.length | 0];
  }).join('');
};

exports.default = generateRandomString;