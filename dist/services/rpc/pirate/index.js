"use strict";

var Pirate = require('./pirate');

var Utils = require('./utils'); // dont override global variable


if (typeof window !== 'undefined' && typeof window.Pirate === 'undefined') {
  window.Pirate = Pirate;
}

module.exports = {
  Pirate: Pirate,
  Utils: Utils
};