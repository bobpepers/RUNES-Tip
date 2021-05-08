"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// import ClickVolume from '../models/clickVolume';

/**
 * Fetch 24h Surf Volume
 */
var fetchClickVolume = exports.fetchClickVolume = function fetchClickVolume(req, res, next) {
  ClickVolume.estimatedDocumentCount({}, function (err, count) {
    if (err) {
      return next(err);
    }
    console.log(count); // this will print the count to console
    res.json(count);
  });
};

/**
 * Fetch 24h Surf Volume
 */
var clickComplete = exports.clickComplete = function clickComplete(req, res, next) {
  var entry = new ClickVolume({
    time: Math.floor(Date.now() / 1000)
  });
  entry.save(function (err, savedSurf) {
    if (err) {
      return next(err);
    }
    res.status(201).send({ data: savedSurf });
  });
};