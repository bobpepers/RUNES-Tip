"use strict";

require('dotenv').config();

var Bluebird = require('bluebird');

var _require = require('recaptcha-v2'),
    Recaptcha = _require.Recaptcha;
/**
   * Verify ReCaptcha
   * @param {Object} recaptchaData
   * @returns {Promise}
   */


var verifyRecaptcha = function verifyRecaptcha(recaptchaData) {
  if (process.env.RECAPTCHA_SKIP_ENABLED === 'true') {
    // For development purpose only, you need to add SKIP_ENABLED in .env
    return Bluebird.resolve();
  }

  return new Bluebird(function (resolve, reject) {
    var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, recaptchaData);
    recaptcha.verify(function (success) {
      if (success) {
        console.log('successful');
        return resolve();
      }

      console.log('captcha-rejected');
      return reject();
    });
  });
};
/**
   * Verify ReCaptcha
   * @param {Object} recaptchaData
   * @returns {Promise}
   */


exports.verifyMyCaptcha = function (req, res, next) {
  var captchaResponse = req.body.captchaResponse;

  if (!captchaResponse) {
    return res.status(422).send({
      error: "CAPTCHA_REQUIRED"
    });
  }

  var recaptchaData = {
    remoteip: req.connection.remoteAddress,
    response: captchaResponse,
    secret: process.env.RECAPTCHA_SECRET_KEY
  };
  verifyRecaptcha(recaptchaData).then(function () {
    console.log('Captcha Verified');
    return next();
  })["catch"](function (error) {
    console.log('invalid captcha');
    res.status(401).send({
      error: 'INVALID_CHAPTCHA'
    });
    console.log(error);
  });
};