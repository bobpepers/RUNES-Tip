"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMembers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../models"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var mapMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, t, optionalRoleMessage, onlineMembers, setting) {
    var roleId, mappedMembersArray, withoutBots, filterWithRoles, _iterator, _step, discordUser, userExist, userIdTest;

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
              return member._roles.includes(roleId) && !member.user.bot;
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
              return !a.user.bot;
            });

          case 14:
            mappedMembersArray = _context.sent;
            _context.next = 17;
            return mappedMembersArray.map(function (a) {
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
              _context.next = 39;
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
              _context.next = 37;
              break;
            }

            _context.next = 33;
            return userExist.user_id.replace('discord-', '');

          case 33:
            userIdTest = _context.sent;

            if (!(userIdTest !== message.author.id)) {
              _context.next = 37;
              break;
            }

            _context.next = 37;
            return withoutBots.push(userExist);

          case 37:
            _context.next = 25;
            break;

          case 39:
            _context.next = 44;
            break;

          case 41:
            _context.prev = 41;
            _context.t0 = _context["catch"](23);

            _iterator.e(_context.t0);

          case 44:
            _context.prev = 44;

            _iterator.f();

            return _context.finish(44);

          case 47:
            return _context.abrupt("return", withoutBots);

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[23, 41, 44, 47]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;