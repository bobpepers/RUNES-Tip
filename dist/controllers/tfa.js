'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlocktfa = exports.istfa = exports.ensuretfa = exports.enabletfa = exports.disabletfa = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var speakeasy = require('speakeasy');

var disabletfa = exports.disabletfa = async function disabletfa(req, res, next) {
  console.log('disable tfa');
  var user = await _models2.default.user.findOne({
    where: {
      id: req.user.id
    }
  });
  var verified = speakeasy.totp.verify({
    secret: user.tfa_secret,
    encoding: 'base32',
    token: req.body.tfa
  });
  if (verified && user && user.tfa === true) {
    await user.update({
      tfa: false,
      tfa_secret: ''
    }).then(function (result) {
      res.json({ data: result.tfa });
    });
  }
  next();
};

var enabletfa = exports.enabletfa = async function enabletfa(req, res, next) {
  // Use verify() to check the token against the secret
  console.log(req);
  var verified = speakeasy.totp.verify({
    secret: req.body.secret,
    encoding: 'base32',
    token: req.body.tfa
  });

  var user = await _models2.default.user.findOne({
    where: {
      id: req.user.id
    }
  });
  if (!verified && user) {
    console.log('invalid token or secret');
    res.status(400).send(new Error('Invalid token or secret'));
  }
  if (verified && !user) {
    res.status(400).send(new Error('User does not exist'));
  }
  if (verified && user && user.tfa === false) {
    await user.update({
      tfa: true,
      tfa_secret: req.body.secret
    }).then(function (result) {
      res.json({ data: result.tfa });
    });
    console.log('insert into db');
  }
  next();
};

var ensuretfa = exports.ensuretfa = function ensuretfa(req, res, next) {
  console.log(req.session.tfa);
  if (req.session.tfa === true) {
    console.log('ensuretfa');
    res.json({
      success: true,
      tfaLocked: true
    });
  }
  if (req.session.tfa === false) {
    console.log('we can pass');
    next();
  }
};

var istfa = exports.istfa = function istfa(req, res, next) {
  console.log(req.session.tfa);
  if (req.session.tfa === true) {
    console.log('TFA IS LOCKED');
    res.json({
      success: true,
      tfaLocked: true
    });
  }
  if (req.session.tfa === false) {
    console.log('TFA IS UNLOCKED');
    res.json({
      success: true,
      tfaLocked: false
    });
  }
};

var unlocktfa = exports.unlocktfa = function unlocktfa(req, res, next) {
  var verified = speakeasy.totp.verify({
    secret: req.user.tfa_secret,
    encoding: 'base32',
    token: req.body.tfa
  });

  console.log(verified);
  if (verified) {
    req.session.tfa = false;
    console.log(req.session);
    console.log('great');
    res.json({
      success: true,
      tfaLocked: false
    });
  }

  if (!verified) {
    console.log('not verifided');
    res.status(400).send(new Error('Unable to verify'));
  }
};