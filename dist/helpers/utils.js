"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = void 0;

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}; // Unused Array Shufflers, we're using Lodash array shuffler


exports.capitalize = capitalize;

function shuffle(array) {
  var currentIndex = array.length;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // eslint-disable-next-line no-param-reassign

    var _ref = [array[parseInt(randomIndex, 10)], array[parseInt(currentIndex, 10)]];
    array[parseInt(currentIndex, 10)] = _ref[0];
    array[parseInt(randomIndex, 10)] = _ref[1];
  }

  return array;
}