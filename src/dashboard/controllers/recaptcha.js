require('dotenv').config();

const Bluebird = require('bluebird');
const { Recaptcha } = require('recaptcha-v2');

/**
   * Verify ReCaptcha
   * @param {Object} recaptchaData
   * @returns {Promise}
   */
const verifyRecaptcha = (recaptchaData) => {
  if (process.env.RECAPTCHA_SKIP_ENABLED === 'true') { // For development purpose only, you need to add SKIP_ENABLED in .env
    return Bluebird.resolve();
  }
  return new Bluebird((resolve, reject) => {
    const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, recaptchaData);

    recaptcha.verify((success) => {
      if (success) {
        console.log('successfulll');
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
exports.verifyMyCaptcha = (req, res, next) => {
  const { captchaResponse } = req.body;
  if (!captchaResponse) {
    return res.status(422).send({ error: "CAPTCHA_REQUIRED" });
  }
  const recaptchaData = {
    remoteip: req.connection.remoteAddress,
    response: captchaResponse,
    secret: process.env.RECAPTCHA_SECRET_KEY,
  };

  verifyRecaptcha(recaptchaData).then(() => {
    console.log('Captcha Verified');
    return next();
  }).catch((error) => {
    console.log('invalid captcha');
    res.status(401).send({
      error: 'INVALID_CHAPTCHA',
    });
    console.log(error);
  });
};

exports.isSurfCaptcha = (req, res, next) => {
  const { captchaResponse } = req.body;
  if (req.user.surf_count % 10 === 0) {
    if (!captchaResponse) {
      return res.status(422).send({ error: "all fields are required" });
    }
    const recaptchaData = {
      remoteip: req.connection.remoteAddress,
      response: captchaResponse,
      secret: process.env.RECAPTCHA_SECRET_KEY,
    };

    verifyRecaptcha(recaptchaData).then(() => {
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      console.log('Captcha Verified');
      return next();
    }).catch((error) => {
      console.log('invalid captcha');
      res.status(401).send({
        error: 'INVALID_CHAPTCHA',
      });
      console.log(error);
    });
  } else {
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    console.log('Captcha skip');
    next();
  }
};
