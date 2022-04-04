"use strict";

var Komodo = require('./komodo'); // dont override global variable


if (typeof window !== 'undefined' && typeof window.Komodo === 'undefined') {
  window.Komodo = Komodo;
}

module.exports = {
  Komodo: Komodo
};