"use strict";

var Runebase = require('./runebase');

var Utils = require('./utils'); // dont override global variable


if (typeof window !== 'undefined' && typeof window.Runebase === 'undefined') {
  window.Runebase = Runebase;
}

module.exports = {
  Runebase: Runebase,
  Utils: Utils
};