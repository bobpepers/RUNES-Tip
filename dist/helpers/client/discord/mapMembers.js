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

var _user = require("../../../controllers/discord/user");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var mapMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, t, optionalRoleMessage, onlineMembers, setting) {
    var roleId, mappedMembersArray, withoutBots, filterWithRoles, filterWithoutRoles, _iterator, _step, discordUser, userExist, userIdTest, _yield$generateUserWa, _yield$generateUserWa2, user, newAccount, userExistNew, _userIdTest, withoutBotsSorted;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mappedMembersArray = [];
            withoutBots = [];

            if (optionalRoleMessage && optionalRoleMessage.startsWith('<@&')) {
              roleId = optionalRoleMessage.substr(3).slice(0, -1);
            }

            if (!roleId) {
              _context.next = 12;
              break;
            }

            _context.next = 6;
            return onlineMembers.filter(function (member) {
              return member._roles.includes(roleId) && !member.user.bot && member.user.id !== message.author.id;
            });

          case 6:
            filterWithRoles = _context.sent;
            _context.next = 9;
            return filterWithRoles.map(function (a) {
              return a.user;
            });

          case 9:
            mappedMembersArray = _context.sent;
            _context.next = 18;
            break;

          case 12:
            _context.next = 14;
            return onlineMembers.filter(function (a) {
              return !a.user.bot && a.user.id !== message.author.id;
            });

          case 14:
            filterWithoutRoles = _context.sent;
            _context.next = 17;
            return filterWithoutRoles.map(function (a) {
              return a.user;
            });

          case 17:
            mappedMembersArray = _context.sent;

          case 18:
            if (!(mappedMembersArray.length > setting.maxSampleSize)) {
              _context.next = 22;
              break;
            }

            _context.next = 21;
            return _lodash["default"].sampleSize(mappedMembersArray, setting.maxSampleSize);

          case 21:
            mappedMembersArray = _context.sent;

          case 22:
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context.prev = 23;

            _iterator.s();

          case 25:
            if ((_step = _iterator.n()).done) {
              _context.next = 57;
              break;
            }

            discordUser = _step.value;
            _context.next = 29;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(discordUser.id)
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

          case 29:
            userExist = _context.sent;

            if (!userExist) {
              _context.next = 38;
              break;
            }

            _context.next = 33;
            return userExist.user_id.replace('discord-', '');

          case 33:
            userIdTest = _context.sent;

            if (!(userIdTest !== message.author.id)) {
              _context.next = 38;
              break;
            }

            if (userExist.banned) {
              _context.next = 38;
              break;
            }

            _context.next = 38;
            return withoutBots.push(userExist);

          case 38:
            if (userExist) {
              _context.next = 55;
              break;
            }

            _context.next = 41;
            return (0, _user.generateUserWalletAndAddress)(discordUser, t);

          case 41:
            _yield$generateUserWa = _context.sent;
            _yield$generateUserWa2 = (0, _slicedToArray2["default"])(_yield$generateUserWa, 2);
            user = _yield$generateUserWa2[0];
            newAccount = _yield$generateUserWa2[1];
            _context.next = 47;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(discordUser.id)
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

          case 47:
            userExistNew = _context.sent;

            if (!userExistNew) {
              _context.next = 55;
              break;
            }

            _context.next = 51;
            return userExistNew.user_id.replace('discord-', '');

          case 51:
            _userIdTest = _context.sent;

            if (!(_userIdTest !== message.author.id)) {
              _context.next = 55;
              break;
            }

            _context.next = 55;
            return withoutBots.push(userExistNew);

          case 55:
            _context.next = 25;
            break;

          case 57:
            _context.next = 62;
            break;

          case 59:
            _context.prev = 59;
            _context.t0 = _context["catch"](23);

            _iterator.e(_context.t0);

          case 62:
            _context.prev = 62;

            _iterator.f();

            return _context.finish(62);

          case 65:
            _context.next = 67;
            return _lodash["default"].sortBy(withoutBots, 'createdAt');

          case 67:
            withoutBotsSorted = _context.sent;
            return _context.abrupt("return", withoutBotsSorted);

          case 69:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[23, 59, 62, 65]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;