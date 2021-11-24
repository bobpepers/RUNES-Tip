"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlocktfa = exports.istfa = exports.ensuretfa = exports.enabletfa = exports.disabletfa = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var speakeasy = require('speakeasy');

var disabletfa = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user, verified;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('disable tfa');
            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                id: req.user.id
              }
            });

          case 3:
            user = _context.sent;
            verified = speakeasy.totp.verify({
              secret: user.tfa_secret,
              encoding: 'base32',
              token: req.body.tfa
            });

            if (!(verified && user && user.tfa === true)) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return user.update({
              tfa: false,
              tfa_secret: ''
            }).then(function (result) {
              res.json({
                data: result.tfa
              });
            });

          case 8:
            next();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function disabletfa(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.disabletfa = disabletfa;

var enabletfa = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var verified, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Use verify() to check the token against the secret
            console.log(req);
            verified = speakeasy.totp.verify({
              secret: req.body.secret,
              encoding: 'base32',
              token: req.body.tfa
            });
            _context2.next = 4;
            return _models["default"].user.findOne({
              where: {
                id: req.user.id
              }
            });

          case 4:
            user = _context2.sent;

            if (!verified && user) {
              console.log('invalid token or secret');
              res.status(400).send(new Error('Invalid token or secret'));
            }

            if (verified && !user) {
              res.status(400).send(new Error('User does not exist'));
            }

            if (!(verified && user && user.tfa === false)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 10;
            return user.update({
              tfa: true,
              tfa_secret: req.body.secret
            }).then(function (result) {
              res.json({
                data: result.tfa
              });
            });

          case 10:
            console.log('insert into db');

          case 11:
            next();

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function enabletfa(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.enabletfa = enabletfa;

var ensuretfa = function ensuretfa(req, res, next) {
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

exports.ensuretfa = ensuretfa;

var istfa = function istfa(req, res, next) {
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

exports.istfa = istfa;

var unlocktfa = function unlocktfa(req, res, next) {
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

exports.unlocktfa = unlocktfa;