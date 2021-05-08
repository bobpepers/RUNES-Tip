"use strict";

var _require = require("mongoose"),
    Promise = _require.Promise;

Promise.all = function (promises) {
  var mainPromise = new Promise();
  if (promises.length == 0) {
    mainPromise.resolve(null, promises);
  }

  var pending = 0;
  promises.forEach(function (p, i) {
    pending++;
    p.then(function (val) {
      promises[i] = val;
      if (--pending === 0) {
        mainPromise.resolve(null, promises);
      }
    }, function (err) {
      mainPromise.reject(err);
    });
  });

  return mainPromise;
};

module.exports = Promise;