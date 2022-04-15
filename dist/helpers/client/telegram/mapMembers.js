"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMembers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _user = require("../../../controllers/telegram/user");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var mapMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, t, onlineMembers, setting) {
    var mappedMembersArray, withoutBots, _iterator, _step, telegramUser, userExist, userIdTest, myNewUserInfo, _yield$generateUserWa, _yield$generateUserWa2, newUser, newAccount, userExistNew, _userIdTest, withoutBotsSorted;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mappedMembersArray = [];
            withoutBots = [];
            _context.next = 4;
            return onlineMembers.filter(function (a) {
              return Number(a.id) !== ctx.update.message.from.id && Number(a.id) !== ctx.botInfo.id;
            });

          case 4:
            mappedMembersArray = _context.sent;

            if (!(mappedMembersArray.length > setting.maxSampleSize)) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return _lodash["default"].sampleSize(mappedMembersArray, setting.maxSampleSize);

          case 8:
            mappedMembersArray = _context.sent;

          case 9:
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context.prev = 10;

            _iterator.s();

          case 12:
            if ((_step = _iterator.n()).done) {
              _context.next = 49;
              break;
            }

            telegramUser = _step.value;
            _context.next = 16;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(Number(telegramUser.id))
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: false
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 16:
            userExist = _context.sent;

            if (!userExist) {
              _context.next = 29;
              break;
            }

            if (!(userExist.username !== telegramUser.username || userExist.firstname !== telegramUser.firstName || userExist.lastname !== telegramUser.lastName)) {
              _context.next = 22;
              break;
            }

            _context.next = 21;
            return userExist.update({
              username: telegramUser.username,
              firstname: telegramUser.firstName,
              lastname: telegramUser.lastName
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 21:
            userExist = _context.sent;

          case 22:
            _context.next = 24;
            return userExist.user_id.replace('telegram-', '');

          case 24:
            userIdTest = _context.sent;

            if (!(userIdTest !== ctx.update.message.from.id)) {
              _context.next = 29;
              break;
            }

            if (userExist.banned) {
              _context.next = 29;
              break;
            }

            _context.next = 29;
            return withoutBots.push(userExist);

          case 29:
            if (userExist) {
              _context.next = 47;
              break;
            }

            myNewUserInfo = {
              userId: Number(telegramUser.id),
              username: telegramUser.username,
              firstname: telegramUser.firstName,
              lastname: telegramUser.lastName
            };
            _context.next = 33;
            return (0, _user.generateUserWalletAndAddress)(myNewUserInfo, t);

          case 33:
            _yield$generateUserWa = _context.sent;
            _yield$generateUserWa2 = (0, _slicedToArray2["default"])(_yield$generateUserWa, 2);
            newUser = _yield$generateUserWa2[0];
            newAccount = _yield$generateUserWa2[1];
            _context.next = 39;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(Number(telegramUser.id))
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: true
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 39:
            userExistNew = _context.sent;

            if (!userExistNew) {
              _context.next = 47;
              break;
            }

            _context.next = 43;
            return userExistNew.user_id.replace('telegram-', '');

          case 43:
            _userIdTest = _context.sent;

            if (!(_userIdTest !== ctx.update.message.from.id)) {
              _context.next = 47;
              break;
            }

            _context.next = 47;
            return withoutBots.push(userExistNew);

          case 47:
            _context.next = 12;
            break;

          case 49:
            _context.next = 54;
            break;

          case 51:
            _context.prev = 51;
            _context.t0 = _context["catch"](10);

            _iterator.e(_context.t0);

          case 54:
            _context.prev = 54;

            _iterator.f();

            return _context.finish(54);

          case 57:
            _context.next = 59;
            return _lodash["default"].sortBy(withoutBots, 'createdAt');

          case 59:
            withoutBotsSorted = _context.sent;
            return _context.abrupt("return", withoutBotsSorted);

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 51, 54, 57]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;