"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMembers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var mapMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, t, optionalRoleMessage, onlineMembers) {
    var roleId, mappedMembersArray, withoutBots, filterWithRoles, _iterator, _step, discordUser, userExist, userIdTest;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            withoutBots = [];

            if (optionalRoleMessage && optionalRoleMessage.startsWith('<@&')) {
              roleId = optionalRoleMessage.substr(3).slice(0, -1);
            }

            if (roleId) {
              filterWithRoles = onlineMembers.filter(function (product) {
                return product._roles.includes(roleId);
              });
              mappedMembersArray = filterWithRoles.map(function (a) {
                return a.user;
              });
            } else {
              mappedMembersArray = onlineMembers.map(function (a) {
                return a.user;
              });
            } // eslint-disable-next-line no-restricted-syntax


            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 15;
              break;
            }

            discordUser = _step.value;

            if (!(discordUser.bot === false)) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
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

          case 11:
            userExist = _context.sent;

            if (userExist) {
              userIdTest = userExist.user_id.replace('discord-', '');

              if (userIdTest !== message.author.id) {
                withoutBots.push(userExist);
              }
            }

          case 13:
            _context.next = 6;
            break;

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](4);

            _iterator.e(_context.t0);

          case 20:
            _context.prev = 20;

            _iterator.f();

            return _context.finish(20);

          case 23:
            return _context.abrupt("return", withoutBots);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 17, 20, 23]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;