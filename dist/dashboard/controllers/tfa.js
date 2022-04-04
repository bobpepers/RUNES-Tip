"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlocktfa = exports.istfa = exports.ensuretfa = exports.enabletfa = exports.disabletfa = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var OTPAuth = _interopRequireWildcard(require("otpauth"));

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var settings = (0, _settings["default"])();

var disabletfa = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user, totp, verified, updatedUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].dashboardUser.findOne({
              where: {
                id: req.user.id
              }
            });

          case 2:
            user = _context.sent;
            totp = new OTPAuth.TOTP({
              issuer: settings.coin.name,
              label: settings.bot.name,
              algorithm: 'SHA1',
              digits: 6,
              period: 30,
              secret: user.tfa_secret // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"

            });
            verified = totp.validate({
              token: req.body.tfa,
              window: 1
            });

            if (!(verified === 0 && user && user.tfa === true)) {
              _context.next = 12;
              break;
            }

            _context.next = 8;
            return user.update({
              tfa: false,
              tfa_secret: ''
            });

          case 8:
            updatedUser = _context.sent;
            res.locals.tfa = updatedUser.tfa;
            res.locals.success = true;
            return _context.abrupt("return", next());

          case 12:
            res.locals.error = 'Wrong TFA Number';
            return _context.abrupt("return", next());

          case 14:
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
    var totp, verified, user, updatedUser;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            totp = new OTPAuth.TOTP({
              issuer: settings.coin.name,
              label: settings.bot.name,
              algorithm: 'SHA1',
              digits: 6,
              period: 30,
              secret: req.body.secret // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"

            });
            verified = totp.validate({
              token: req.body.tfa,
              window: 1
            });
            _context2.next = 4;
            return _models["default"].dashboardUser.findOne({
              where: {
                id: req.user.id
              }
            });

          case 4:
            user = _context2.sent;

            if (!(verified !== 0 && user)) {
              _context2.next = 8;
              break;
            }

            res.locals.error = 'Invalid token or secret';
            return _context2.abrupt("return", next());

          case 8:
            if (!(verified === 0 && !user)) {
              _context2.next = 11;
              break;
            }

            res.locals.error = 'User does not exist';
            return _context2.abrupt("return", next());

          case 11:
            if (!(verified === 0 && user && user.tfa === false)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 14;
            return user.update({
              tfa: true,
              tfa_secret: req.body.secret
            });

          case 14:
            updatedUser = _context2.sent;
            res.locals.tfa = updatedUser.tfa;
            return _context2.abrupt("return", next());

          case 17:
            next();

          case 18:
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
  if (req.session.tfa === true) {
    res.json({
      success: true,
      tfaLocked: true
    });
  }

  if (req.session.tfa === false) {
    next();
  }
};

exports.ensuretfa = ensuretfa;

var istfa = function istfa(req, res, next) {
  // console.log(req.session.tfa);
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
  var totp = new OTPAuth.TOTP({
    issuer: settings.coin.name,
    label: settings.bot.name,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: req.user.tfa_secret // or "OTPAuth.Secret.fromBase32(user.tfa_secret)"

  });
  var verified = totp.validate({
    token: req.body.tfa,
    window: 1
  });

  if (verified === 0) {
    req.session.tfa = false;
    console.log(req.session);
    res.locals.success = true;
    return next();
  }

  if (!verified) {
    res.locals.error = 'Wrong TFA Number';
    return next();
  }
};

exports.unlocktfa = unlocktfa;