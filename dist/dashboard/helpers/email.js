"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendVerificationEmail = exports.sendResetPassword = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _dotenv = require("dotenv");

/* eslint-disable prefer-template */
(0, _dotenv.config)();

var transporter = _nodemailer["default"].createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    requireTLS: true
  }
}); // transporter.sendMail({
//   from: process.env.MAIL_USER,
//   to: 'bagostra@gmail.com',
//   subject: 'Nodejs application restarted',
//   html: 'test',
// }).then(() => {
//   console.log('Email sent successfully');
// }).catch((err) => {
//   console.log('Failed to send email');
//   console.error(err);
// });


var sendEmail = function sendEmail(from, to, subject, html) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html
    }, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(true);
      }
    });
  });
};

var verifySend = function verifySend() {
  return new Promise(function (resolve, reject) {
    transporter.verify(function (error, success) {
      if (error) {
        resolve(false);
        console.log(error);
      } else {
        resolve(true);
      }
    });
  });
};

var sendVerificationEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(email, token) {
    var html, waitForVerify, waitForEmail;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>" + "<div style='background-color: #f2f2f2; padding: 45px;'>" + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>" + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hello</h1>" + "<p style='color: #5f5f5f;'>Click the big button below to activate your account.</p>" + "<a href='" + process.env.ROOT_URL + "/register/verify-email?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Activate Account</a>" + "</div></div></div>";
            _context.next = 3;
            return verifySend();

          case 3:
            waitForVerify = _context.sent;

            if (waitForVerify) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", false);

          case 6:
            _context.next = 8;
            return sendEmail(process.env.MAIL_USER, email, 'Verify Email', html);

          case 8:
            waitForEmail = _context.sent;
            return _context.abrupt("return", waitForEmail);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendVerificationEmail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendVerificationEmail = sendVerificationEmail;

var sendResetPassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(email, firstName, token) {
    var html, waitForVerify, waitForEmail;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>" + "<div style='background-color: #f2f2f2; padding: 45px;'>" + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>" + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hi, " + firstName + "</h1>" + "<p style='color: #5f5f5f; line-height: 22px;'>We've received a request to reset your password. if you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link</p>" + "<a href='" + process.env.ROOT_URL + "/reset-password/new?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Click here to reset your password</a>" + "</div></div></div>";
            _context2.next = 3;
            return verifySend();

          case 3:
            waitForVerify = _context2.sent;

            if (waitForVerify) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", false);

          case 6:
            _context2.next = 8;
            return sendEmail(process.env.MAIL_USER, email, 'Password Reset', html);

          case 8:
            waitForEmail = _context2.sent;
            return _context2.abrupt("return", waitForEmail);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function sendResetPassword(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.sendResetPassword = sendResetPassword;