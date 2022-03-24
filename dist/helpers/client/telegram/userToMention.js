"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserToMentionFromDatabaseRecord = exports.getUserToMentionCtx = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var getUserToMentionFromDatabaseRecord = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user) {
    var userId, userToMention;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = user.user_id.replace('telegram-', '');

            if (user.username && user.username !== '') {
              userToMention = user.username;
            } else if (user.firstname && user.lastname && user.firstname !== '' && user.lastname !== '') {
              userToMention = "".concat(user.firstname, " ").concat(user.lastname);
            } else if (user.firstname && user.firstname !== '') {
              userToMention = user.firstname;
            } else if (user.lastname && user.lastname !== '') {
              userToMention = user.lastname;
            } else {
              userToMention = 'unknownUser';
            }

            return _context.abrupt("return", [userToMention, userId]);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUserToMentionFromDatabaseRecord(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUserToMentionFromDatabaseRecord = getUserToMentionFromDatabaseRecord;

var getUserToMentionCtx = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
    var userId, userToMention;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(ctx.update.message.from);
            userId = ctx.update.message.from.id;

            if (ctx.update.message.from.username && ctx.update.message.from.username !== '') {
              userToMention = ctx.update.message.from.username;
            } else if (ctx.update.message.from.first_name && ctx.update.message.from.last_name && ctx.update.message.from.first_name !== '' && ctx.update.message.from.last_name !== '') {
              userToMention = "".concat(ctx.update.message.from.first_name, " ").concat(ctx.update.message.from.last_name);
            } else if (ctx.update.message.from.first_name && ctx.update.message.from.first_name !== '') {
              userToMention = ctx.update.message.from.first_name;
            } else if (ctx.update.message.from.last_name && ctx.update.message.from.last_name !== '') {
              userToMention = ctx.update.message.from.last_name;
            } else {
              userToMention = 'unknownUser';
            }

            return _context2.abrupt("return", [userToMention, userId]);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getUserToMentionCtx(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUserToMentionCtx = getUserToMentionCtx;