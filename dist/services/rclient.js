'use strict';

var _require = require('rweb3'),
    Rweb3 = _require.Rweb3;

var _require2 = require('./rclientConfig'),
    getRunebaseRPCAddress = _require2.getRunebaseRPCAddress;

var RClient = function () {
  var instance = void 0;

  function createInstance() {
    return new Rweb3(getRunebaseRPCAddress());
  }

  return {
    getInstance: function getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
}();

module.exports = RClient;